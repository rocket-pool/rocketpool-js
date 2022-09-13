// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { takeSnapshot, revertSnapshot } from "../_utils/evm";
import { nodeStakeRPL, setNodeTrusted } from "../_helpers/node";
import { setDAOProtocolBootstrapSetting } from "../dao/scenario-dao-protocol-bootstrap";
import { setDAONodeTrustedBootstrapSetting } from "../dao/scenario-dao-node-trusted-bootstrap";
import { createMinipool, getMinipoolMinimumRPLStake } from "../_helpers/minipool";
import { mintRPL } from "../_helpers/tokens";
import { printTitle } from "../_utils/formatting";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { shouldRevert } from "../_utils/testing";
import { submitPenalty } from "./scenario-submit-penalties";

// Tests
export default function runNetworkPenaltiesTests(web3: Web3, rp: RocketPool) {
	describe("Network Penalties Tests", () => {
		// settings
		const gasLimit = 8000000;

		// Accounts
		let owner: string;
		let node: string;
		let trustedNode1: string;
		let trustedNode2: string;
		let trustedNode3: string;
		let trustedNode4: string;
		let random: string;

		const proposalCooldown = 10;
		const proposalVoteTime = 10;
		const proposalVoteDelayBlocks = 4;

		let minipool: MinipoolContract;

		// State snapshotting
		let suiteSnapshotId: string, testSnapshotId: string;
		before(async () => {
			suiteSnapshotId = await takeSnapshot(web3);
		});
		after(async () => {
			await revertSnapshot(web3, suiteSnapshotId);
		});
		beforeEach(async () => {
			testSnapshotId = await takeSnapshot(web3);
		});
		afterEach(async () => {
			await revertSnapshot(web3, testSnapshotId);
		});

		before(async () => {
			// Get accounts
			[owner, node, trustedNode1, trustedNode2, trustedNode3, trustedNode4, random] = await web3.eth.getAccounts();

			// Register nodes
			await rp.node.registerNode("Australia/Brisbane", {
				from: node,
				gas: gasLimit,
			});

			await rp.node.registerNode("Australia/Brisbane", {
				from: trustedNode1,
				gas: gasLimit,
			});

			await rp.node.registerNode("Australia/Brisbane", {
				from: trustedNode2,
				gas: gasLimit,
			});

			await rp.node.registerNode("Australia/Brisbane", {
				from: trustedNode3,
				gas: gasLimit,
			});

			// Register trusted node
			await setNodeTrusted(web3, rp, trustedNode1, "rocketpool_1", "node@home.com", owner);
			await setNodeTrusted(web3, rp, trustedNode2, "rocketpool_1", "node@home.com", owner);
			await setNodeTrusted(web3, rp, trustedNode3, "rocketpool_1", "node@home.com", owner);

			// Set a small proposal cooldown
			await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsProposals", "proposal.cooldown", proposalCooldown, {
				from: owner,
				gas: gasLimit,
			});
			await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsProposals", "proposal.vote.blocks", proposalVoteTime, {
				from: owner,
				gas: gasLimit,
			});
			await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsProposals", "proposal.vote.delay.blocks", proposalVoteDelayBlocks, {
				from: owner,
				gas: gasLimit,
			});

			// Set max penalty rate
			await rp.minipool.setMaxPenaltyRate(web3.utils.toWei("1", "ether"), { from: owner, gas: gasLimit });

			// Mint RPL to accounts
			const minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
			const rplStake = minipoolRplStake.mul(web3.utils.toBN(7));
			await mintRPL(web3, rp, owner, node, rplStake);
			await nodeStakeRPL(web3, rp, rplStake, { from: node });

			// Create a minipool
			minipool = (await createMinipool(web3, rp, { from: node, value: web3.utils.toWei("32", "ether"), gas: gasLimit }, 0)) as MinipoolContract;
		});

		it(printTitle("trusted nodes", "can submit penalties"), async () => {

			// Set parameters
			const minipoolAddress = minipool.address;

			for (let block = 1; block < 5; block++) {
				await submitPenalty(web3, rp, minipoolAddress, block, {
					from: trustedNode1,
					gas: gasLimit,
				});
				await submitPenalty(web3, rp, minipoolAddress, block, {
					from: trustedNode2,
					gas: gasLimit,
				});
				await submitPenalty(web3, rp, minipoolAddress, block, {
					from: trustedNode3,
					gas: gasLimit,
				});
			}

		});


		it(printTitle("node operator", "cannot submit penalties"), async () => {

			// Set parameters
			const block = 1;
			const minipoolAddress = minipool.address;

			// Submit different balances
			await shouldRevert(submitPenalty(web3, rp, minipoolAddress, block, {
				from: node,
				gas: gasLimit,
			}), "Was able to submit penalty", "Invalid trusted node");

		});

	});
}
