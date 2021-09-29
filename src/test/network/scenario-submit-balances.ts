// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";

// Submit network ETH balances
export async function submitBalances(
	web3: Web3,
	rp: RocketPool,
	block: number,
	totalEth: string,
	stakingEth: string,
	rethSupply: string,
	options: SendOptions
) {
	// Load contracts
	const rocketDAONodeTrusted = await rp.contracts.get("rocketDAONodeTrusted");
	const rocketStorage = await rp.contracts.get("rocketStorage");

	// Get parameters
	const trustedNodeCount = await rocketDAONodeTrusted.methods
		.getMemberCount()
		.call()
		.then((value: any) => web3.utils.toBN(value));

	// Get submission keys
	const nodeSubmissionKey = web3.utils.soliditySha3("network.balances.submitted.node", options.from, block, totalEth, stakingEth, rethSupply);
	const submissionCountKey = web3.utils.soliditySha3("network.balances.submitted.count", block, totalEth, stakingEth, rethSupply);

	// Get submission details
	function getSubmissionDetails() {
		return Promise.all([
			rocketStorage.methods.getBool(nodeSubmissionKey).call(),
			rocketStorage.methods
				.getUint(submissionCountKey)
				.call()
				.then((value: any) => web3.utils.toBN(value)),
		]).then(([nodeSubmitted, count]) => ({ nodeSubmitted, count }));
	}

	// Get balances
	function getBalances() {
		return Promise.all([
			rp.network.getBalancesBlock().then((value: any) => web3.utils.toBN(value)),
			rp.network.getTotalETHBalance().then((value: any) => web3.utils.toBN(value)),
			rp.network.getStakingETHBalance().then((value: any) => web3.utils.toBN(value)),
			rp.network.getTotalRETHSupply().then((value: any) => web3.utils.toBN(value)),
		]).then(([block, totalEth, stakingEth, rethSupply]) => ({
			block,
			totalEth,
			stakingEth,
			rethSupply,
		}));
	}

	// Get initial submission details
	const submission1 = await getSubmissionDetails();

	// Submit balances
	await rp.network.submitBalances(block, totalEth, stakingEth, rethSupply, options);

	// Get updated submission details & balances
	const [submission2, balances] = await Promise.all([getSubmissionDetails(), getBalances()]);

	// Check if balances should be updated
	const expectUpdatedBalances = submission2.count.mul(web3.utils.toBN(2)).gt(trustedNodeCount);

	// Check submission details
	assert.isFalse(submission1.nodeSubmitted, "Incorrect initial node submitted status");
	assert.isTrue(submission2.nodeSubmitted, "Incorrect updated node submitted status");
	assert(submission2.count.eq(submission1.count.add(web3.utils.toBN(1))), "Incorrect updated submission count");

	// Check balances
	if (expectUpdatedBalances) {
		assert(balances.block.eq(web3.utils.toBN(block)), "Incorrect updated network balances block");
		assert(balances.totalEth.eq(web3.utils.toBN(totalEth)), "Incorrect updated network total ETH balance");
		assert(balances.stakingEth.eq(web3.utils.toBN(stakingEth)), "Incorrect updated network staking ETH balance");
		assert(balances.rethSupply.eq(web3.utils.toBN(rethSupply)), "Incorrect updated network total rETH supply");
	} else {
		assert(!balances.block.eq(web3.utils.toBN(block)), "Incorrectly updated network balances block");
		assert(!balances.totalEth.eq(web3.utils.toBN(totalEth)), "Incorrectly updated network total ETH balance");
		assert(!balances.stakingEth.eq(web3.utils.toBN(stakingEth)), "Incorrectly updated network staking ETH balance");
		assert(!balances.rethSupply.eq(web3.utils.toBN(rethSupply)), "Incorrectly updated network total rETH supply");
	}
}

// Execute update network balances
export async function executeUpdateBalances(
	web3: Web3,
	rp: RocketPool,
	block: number,
	totalEth: string,
	stakingEth: string,
	rethSupply: string,
	options: SendOptions
) {
	// Get balances
	function getBalances() {
		return Promise.all([
			rp.network.getBalancesBlock().then((value: any) => web3.utils.toBN(value)),
			rp.network.getTotalETHBalance().then((value: any) => web3.utils.toBN(value)),
			rp.network.getStakingETHBalance().then((value: any) => web3.utils.toBN(value)),
			rp.network.getTotalRETHSupply().then((value: any) => web3.utils.toBN(value)),
		]).then(([block, totalEth, stakingEth, rethSupply]) => ({
			block,
			totalEth,
			stakingEth,
			rethSupply,
		}));
	}

	// Submit balances
	await rp.network.executeUpdateBalances(block, totalEth, stakingEth, rethSupply, options);

	// Get updated balances
	const balances = await getBalances();

	// Check balances
	assert(balances.block.eq(web3.utils.toBN(block)), "Incorrect updated network balances block");
	assert(balances.totalEth.eq(web3.utils.toBN(totalEth)), "Incorrect updated network total ETH balance");
	assert(balances.stakingEth.eq(web3.utils.toBN(stakingEth)), "Incorrect updated network staking ETH balance");
	assert(balances.rethSupply.eq(web3.utils.toBN(rethSupply)), "Incorrect updated network total rETH supply");
}
