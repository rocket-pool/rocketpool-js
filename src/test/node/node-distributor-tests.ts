// Imports
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { takeSnapshot, revertSnapshot, increaseTime } from "../_utils/evm";
import { SendOptions } from "web3-eth-contract";
import { nodeDeposit, nodeStakeRPL, registerNode, setNodeTrusted } from "../_helpers/node";
import { approveRPL, mintRPL } from "../_helpers/tokens";
import { printTitle } from "../_utils/formatting";
import { shouldRevert } from "../_utils/testing";
import { setRewardsClaimIntervalTime } from "../dao/scenario-dao-protocol-bootstrap";
import { Contract } from "web3-eth-contract";
import { stakeRpl } from "./scenario-stake-rpl";
import { withdrawRpl } from "./scenario-withdraw-rpl";
import { setDAONodeTrustedBootstrapSetting } from "../dao/scenario-dao-node-trusted-bootstrap";
import { userDeposit } from "../_helpers/deposit";
import { createMinipool, getMinipoolMinimumRPLStake, getMinipoolMinimumRPLStake, stakeMinipool } from "../_helpers/minipool";
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

			const rocketNodeDistributorFactory = await rp.contracts.get("rocketNodeDistributorFactory");

			// Set settings
			await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsMinipool", "minipool.scrub.period", scrubPeriod, {
				from: owner,
				gas: gasLimit,
			});

			// Register node
			await registerNodeOld({
				from: node1,
				gas: gasLimit,
			});
			distributorAddress = await rocketNodeDistributorFactory.methods.getProxyAddress(node1);

			// Register trusted node
			await registerNodeOld( {
				from: trustedNode,
				gas: gasLimit,
			});

			await setNodeTrusted(web3, rp, trustedNode, "rocketpool_1", "node@home.com", owner);

			// Mint RPL to accounts
			const minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
			rplStake = minipoolRplStake.mul(web3.utils.toBN(7));
			await mintRPL(web3, rp, owner, node1, rplStake);
			await nodeStakeRPL(web3, rp, rplStake, { from: node1}, true);
			await mintRPL(web3, rp, owner, node2, rplStake);
		});

		it(printTitle("node operator", "can not initialise fee distributor if registered after upgrade"), async () => {
			// Upgrade distributor
			await upgradeOneDotOne(owner);
			// Register node
			await registerNode(web3, rp, {from: node2});
			await nodeStakeRPL(web3, rp, rplStake, {from: node2});
			// Attempt to initialise
			await shouldRevert(rp.node.initialiseFeeDistributor({from: node2}), "Was able to initialise again", "Already initialised");
		});
    
	});
}
