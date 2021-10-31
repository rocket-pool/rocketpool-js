// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { takeSnapshot, revertSnapshot, increaseTime } from "../_utils/evm";
import { createMinipool, getMinipoolMinimumRPLStake, stakeMinipool } from "../_helpers/minipool";
import { nodeStakeRPL, setNodeTrusted, setNodeWithdrawalAddress } from "../_helpers/node";
import { setDAOProtocolBootstrapSetting } from "../dao/scenario-dao-protocol-bootstrap";
import { userDeposit } from "../_helpers/deposit";
import { mintRPL } from "../_helpers/tokens";
import { printTitle } from "../_utils/formatting";
import { shouldRevert } from "../_utils/testing";
import { setDAONodeTrustedBootstrapSetting } from "../dao/scenario-dao-node-trusted-bootstrap";
import { close } from "./scenario-close";
import { voteScrub } from "./scenario-scrub";

// Tests
export default function runMinipoolScrubTests(web3: Web3, rp: RocketPool) {
	describe("Minipool Scrub Tests", () => {
		// settings
		const gasLimit = 8000000;

		// Accounts
		let owner: string;
		let node: string;
		let nodeWithdrawalAddress: string;
		let trustedNode1: string;
		let trustedNode2: string;
		let trustedNode3: string;
		let random: string;

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

		// Constants
		const launchTimeout = 60 * 60 * 72; // 72 hours
		const withdrawalDelay = 20;
		const scrubPeriod = 60 * 60 * 24; // 24 hours
		const minipoolSalt = 1;

		// Setup
		let prelaunchMinipool: MinipoolContract;

		before(async () => {
			// Get accounts
			[owner, node, nodeWithdrawalAddress, trustedNode1, trustedNode2, trustedNode3, random] = await web3.eth.getAccounts();

			// Register node & set withdrawal address
			await rp.node.registerNode("Australia/Brisbane", {
				from: node,
				gas: gasLimit,
			});
			await setNodeWithdrawalAddress(web3, rp, node, nodeWithdrawalAddress, {
				from: node,
				gas: gasLimit,
			});

			// Register trusted node
			await rp.node.registerNode("Australia/Brisbane", {
				from: trustedNode1,
				gas: gasLimit,
			});
			await setNodeTrusted(web3, rp, trustedNode1, "saas_1", "node@home.com", owner);
			await rp.node.registerNode("Australia/Brisbane", {
				from: trustedNode2,
				gas: gasLimit,
			});
			await setNodeTrusted(web3, rp, trustedNode2, "saas_2", "node@home.com", owner);
			await rp.node.registerNode("Australia/Brisbane", {
				from: trustedNode3,
				gas: gasLimit,
			});
			await setNodeTrusted(web3, rp, trustedNode3, "saas_3", "node@home.com", owner);

			// Set a small proposal cooldown
			await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsMinipool", "minipool.launch.timeout", launchTimeout, {
				from: owner,
				gas: gasLimit,
			});
			await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsMinipool", "minipool.withdrawal.delay", withdrawalDelay, {
				from: owner,
				gas: gasLimit,
			});
			await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsMinipool", "minipool.scrub.period", scrubPeriod, {
				from: owner,
				gas: gasLimit,
			});

			// Set rETH collateralisation target to a value high enough it won't cause excess ETH to be funneled back into deposit pool and mess with our calcs
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.reth.collateral.target", web3.utils.toWei("50", "ether"), {
				from: owner,
				gas: gasLimit,
			});

			// Make user deposit to refund first prelaunch minipool
			const refundAmount = web3.utils.toWei("16", "ether");
			await userDeposit(web3, rp, { from: random, value: refundAmount, gas: gasLimit });

			// Stake RPL to cover minipools
			const minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
			const rplStake = minipoolRplStake.mul(web3.utils.toBN(7));
			await mintRPL(web3, rp, owner, node, rplStake);
			await nodeStakeRPL(web3, rp, rplStake, { from: node, gas: gasLimit });

			// Create minipool
			prelaunchMinipool = (await createMinipool(web3, rp, { from: node, value: web3.utils.toWei("32", "ether") })) as MinipoolContract;
		});

		//
		// General
		//
		it(printTitle("node", "cannot stake a prelaunch pool if scrub period has not elapsed"), async () => {
			await shouldRevert(
				stakeMinipool(web3, rp, prelaunchMinipool, { from: node, gas: gasLimit }),
				"Was able to stake minipool before scrub period elapsed",
				"Not enough time has passed to stake"
			);
		});

		it(printTitle("node", "can stake a prelaunch pool if scrub period has elapsed"), async () => {
			// Increase time by scrub period
			await increaseTime(web3, scrubPeriod + 1);
			// Should be able to stake
			await stakeMinipool(web3, rp, prelaunchMinipool, { from: node, gas: gasLimit });
		});

		it(printTitle("node", "cannot close a scrubbed minipool before funds are returned"), async () => {
			await voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode1, gas: gasLimit });
			await voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode2, gas: gasLimit });

			await shouldRevert(
				close(web3, rp, prelaunchMinipool, { from: node, gas: gasLimit }),
				"Closed minipool before fund were returned",
				"Node ETH balance was not successfully transferred to node operator"
			);
		});

		it(printTitle("node", "can close a scrubbed minipool after funds are returned"), async () => {
			await voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode1, gas: gasLimit });
			await voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode2, gas: gasLimit });

			// Send 16 ETH to minipool
			await web3.eth.sendTransaction({
				from: random,
				to: prelaunchMinipool.address,
				value: web3.utils.toWei("16", "ether"),
			});

			await close(web3, rp, prelaunchMinipool, { from: node, gas: gasLimit });
		});

		//
		// ODAO
		//
		it(printTitle("trusted node", "can scrub a prelaunch minipool (no penalty)"), async () => {
			// 2 out of 3 should dissolve the minipool
			await voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode1, gas: gasLimit });
			await voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode2, gas: gasLimit });
		});

		it(printTitle("trusted node", "can scrub a prelaunch minipool (with penalty)"), async () => {
			// Enabled penalty
			await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsMinipool", "minipool.scrub.penalty.enabled", true, {
				from: owner,
				gas: gasLimit,
			});
			// 2 out of 3 should dissolve the minipool
			await voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode1, gas: gasLimit });
			await voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode2, gas: gasLimit });
		});

		it(printTitle("trusted node", "cannot vote to scrub twice"), async () => {
			await voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode1, gas: gasLimit });
			await shouldRevert(
				voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode1, gas: gasLimit }),
				"Was able to vote scrub twice from same member",
				"Member has already voted to scrub"
			);
		});

		it(printTitle("trust node", "cannot vote to scrub a staking minipool"), async () => {
			// Increase time by scrub period and stake
			await increaseTime(web3, scrubPeriod + 1);
			await stakeMinipool(web3, rp, prelaunchMinipool, { from: node, gas: gasLimit });
			// Should not be able to vote scrub
			await shouldRevert(
				voteScrub(web3, rp, prelaunchMinipool, { from: trustedNode1, gas: gasLimit }),
				"Was able to vote scrub a staking minipool",
				"The minipool can only be scrubbed while in prelaunch"
			);
		});

		//
		// Misc
		//
		it(printTitle("guardian", "can not set launch timeout lower than scrub period"), async () => {
			await shouldRevert(
				setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsMinipool", "minipool.launch.timeout", scrubPeriod - 1, {
					from: owner,
					gas: gasLimit,
				}),
				"Set launch timeout lower than scrub period",
				"Launch timeout must be greater than scrub period"
			);
		});

		it(printTitle("guardian", "can not set scrub period higher than launch timeout"), async () => {
			await shouldRevert(
				setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsMinipool", "minipool.scrub.period", launchTimeout + 1, {
					from: owner,
					gas: gasLimit,
				}),
				"Set scrub period higher than launch timeout",
				"Scrub period must be less than launch timeout"
			);
		});
	});
}
