// Imports
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { takeSnapshot, revertSnapshot, increaseTime } from "../_utils/evm";
import { SendOptions } from "web3-eth-contract";
import { nodeDeposit, nodeStakeRPL, setNodeTrusted } from "../_helpers/node";
import { approveRPL, mintRPL } from "../_helpers/tokens";
import { printTitle } from "../_utils/formatting";
import { shouldRevert } from "../_utils/testing";
import { setRewardsClaimIntervalTime } from "../dao/scenario-dao-protocol-bootstrap";
import { Contract } from "web3-eth-contract";
import { stakeRpl } from "./scenario-stake-rpl";
import { withdrawRpl } from "./scenario-withdraw-rpl";
import { setDAONodeTrustedBootstrapSetting } from "../dao/scenario-dao-node-trusted-bootstrap";
import { userDeposit } from "../_helpers/deposit";
import { createMinipool, stakeMinipool } from "../_helpers/minipool";
import { submitWithdrawable } from "../minipool/scenario-submit-withdrawable";
import { withdrawValidatorBalance } from "../minipool/scenario-withdraw-validator-balance";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";

// Tests
export default function runNodeDistributorTests(web3: Web3, rp: RocketPool) {
	describe("Node Distributor", () => {
		// settings
		const gasLimit = 8000000;

		// Accounts
		let owner: string;
		let node1: string;
		let node2: string;
		let random: string;
		let trustedNode: string;

		const scrubPeriod = 60 * 60 * 24; // 24 hours
		let distributorAddress: string;
		let rplStake: string;

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

		async function registerNodeOld(options: SendOptions) {
			await rp.node.registerNode("Australia/Brisbane", options);
		}


		// Setup
		before(async () => {
			// Get accounts
			[owner, node1, node2, random, trustedNode] = await web3.eth.getAccounts();

			// const rocketNodeDistributorFactory = await RocketNodeDistributorFactory.deployed();

			// Set settings
			await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsMinipool", "minipool.scrub.period", scrubPeriod, {
				from: owner,
				gas: gasLimit,
			});

			// Register node
			await rp.node.registerNode("Australia/Brisbane", {
				from: node,
				gas: gasLimit,
			});
			await rp.node.registerNode("Australia/Brisbane", {
				from: trustedNode,
				gas: gasLimit,
			});

			await setNodeTrusted(web3, rp, trustedNode, "rocketpool_1", "node@home.com", owner);

			// Mint RPL to accounts
			const rplAmount = web3.utils.toWei("10000", "ether");
			await mintRPL(web3, rp, owner, node1, rplAmount);
			await mintRPL(web3, rp, owner, node2, rplAmount);
			await mintRPL(web3, rp, owner, random, rplAmount);

		});
    
	});
}
