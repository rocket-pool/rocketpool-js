// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";
import { shouldRevert } from "../_utils/testing";

// Submit network prices
export async function submitPenalty(web3: Web3, rp: RocketPool, minipoolAddress: string, block: number, options: SendOptions) {
	// Load contracts
	const rocketDAONodeTrusted = await rp.contracts.get("rocketDAONodeTrusted");
	const rocketStorage = await rp.contracts.get("rocketStorage");
	const rocketMinipoolPenalty = await rp.contracts.get("rocketMinipoolPenalty");
	const rocketNetworkPenalties = await rp.contracts.get("rocketNetworkPenalties");
	const rocketDAOProtocolSettingsNetwork = await rp.contracts.get("rocketDAOProtocolSettingsNetwork");

	// Get parameters
	const trustedNodeCount = await rocketDAONodeTrusted.methods.getMemberCount().call().then((value: any) => web3.utils.toBN(value));

	// Get submission keys
	const penaltyKey = web3.utils.soliditySha3("network.penalties.penalty", minipoolAddress);
	const nodeSubmissionKey = web3.utils.soliditySha3("network.penalties.submitted.node", options.from, minipoolAddress, block);
	const submissionCountKey = web3.utils.soliditySha3("network.penalties.submitted.count", minipoolAddress, block);
	const executionKey = web3.utils.soliditySha3("network.penalties.executed", minipoolAddress, block);

	const maxPenaltyRate = await rocketMinipoolPenalty.methods.getMaxPenaltyRate().call();
	const penaltyThreshold = await rocketDAOProtocolSettingsNetwork.methods.getNodePenaltyThreshold().call().then((value: any) => web3.utils.toBN(value));

	// Get submission details
	function getSubmissionDetails() {
		return Promise.all([
			rocketStorage.methods.getBool(nodeSubmissionKey).call(),
			rocketStorage.methods.getUint(submissionCountKey).call().then((value: any) => web3.utils.toBN(value)),
			rocketStorage.methods.getBool(executionKey).call(),
		]).then(
			([nodeSubmitted, count, executed]) =>
				({nodeSubmitted, count, executed})
		);
	}

	function getPenalty() {
		return Promise.all([
			rocketMinipoolPenalty.methods.getPenaltyRate(minipoolAddress).call().then((value: any) => web3.utils.toBN(value)),
			rocketStorage.methods.getUint(penaltyKey).call().then((value: any) => web3.utils.toBN(value))
		]).then(
			([penaltyRate, penaltyCount]) =>
				({penaltyRate, penaltyCount})
		);
	}

	// Get initial submission details
	const [ submission1, penalty1 ] = await Promise.all([
		getSubmissionDetails(),
		getPenalty()
	]);

	// Submit balances
	if (submission1.executed) {
		await shouldRevert(rocketNetworkPenalties.methods.submitPenalty(minipoolAddress, block).send(options), "Did not revert on already executed penalty", "Penalty already applied for this block");
	} else {
		await rocketNetworkPenalties.methods.submitPenalty(minipoolAddress, block).send(options);
	}

	// Get updated submission details & balances
	const [ submission2, penalty2 ] = await Promise.all([
		getSubmissionDetails(),
		getPenalty()
	]);

	// Check if balances should be updated
	const expectedUpdatedPenalty = web3.utils.toBN(web3.utils.toWei("1", "ether")).mul(submission2.count).div(trustedNodeCount).gte(penaltyThreshold);

	// Check submission details
	assert.isFalse(submission1.nodeSubmitted, "Incorrect initial node submitted status");

	if (!submission1.executed) {
		assert.isTrue(submission2.nodeSubmitted, "Incorrect updated node submitted status");
		assert(submission2.count.eq(submission1.count.add(web3.utils.toBN(1))), "Incorrect updated submission count");
	}

	// Check penalty
	if (!submission1.executed && expectedUpdatedPenalty) {
		assert.isTrue(submission2.executed, "Penalty not executed");
		assert.strictEqual(penalty2.penaltyCount.toString(), penalty1.penaltyCount.add(web3.utils.toBN(1)).toString(), "Penalty count not updated");

		// Unless we hit max penalty, expect to see an increase in the penalty rate
		if (penalty1.penaltyRate.lt(maxPenaltyRate) && penalty2.penaltyCount.gte(web3.utils.toBN("3"))){
			assert.isTrue(penalty2.penaltyRate.gt(penalty1.penaltyRate), "Penalty rate did not increase");
		}
	} else if(!expectedUpdatedPenalty) {
		assert.isFalse(submission2.executed, "Penalty executed");
	}
}
