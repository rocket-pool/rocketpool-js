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
import { createMinipool, getMinipoolMinimumRPLStake, stakeMinipool, submitMinipoolWithdrawable } from "../_helpers/minipool";
import { submitWithdrawable } from "../minipool/scenario-submit-withdrawable";
import { withdrawValidatorBalance } from "../minipool/scenario-withdraw-validator-balance";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { distributeRewards } from "./scenario-distribute-rewards";

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

		// Setup
		before(async () => {
			// Get accounts
			[owner, node1, node2, random, trustedNode] = await web3.eth.getAccounts();

			// Set settings
			await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsMinipool", "minipool.scrub.period", scrubPeriod, {
				from: owner,
				gas: gasLimit,
			});

			// Register node
			await rp.node.registerNode("Australia/Brisbane", {
				from: node1,
				gas: gasLimit,
			});

			// Get the distributor address
			distributorAddress = await rp.node.getNodeDistributorProxyAddress(node1);

			// Register trusted node
			await registerNode(web3, rp, {
				from: trustedNode,
				gas: gasLimit,
			});
			await setNodeTrusted(web3, rp, trustedNode, "rocketpool_1", "node@home.com", owner);

			// Mint RPL to accounts
			const minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
			rplStake = minipoolRplStake.mul(web3.utils.toBN(7));
			await mintRPL(web3, rp, owner, node1, rplStake);
			await nodeStakeRPL(web3, rp, rplStake, { from: node1 });
			await mintRPL(web3, rp, owner, node2, rplStake);
		});

		it(printTitle("node operator", "can not initialise fee distributor if registered after upgrade"), async () => {
			// Register node
			await registerNode(web3, rp, {
				from: node2,
				gas: gasLimit,
			});
			await nodeStakeRPL(web3, rp, rplStake, { from: node2 });
			// Attempt to initialise
			await shouldRevert(rp.node.initialiseFeeDistributor({ from: node2 }), "Was able to initialise again", "Already initialised");
		});

		it(printTitle("node operator", "can not initialise fee distributor if already initialised"), async () => {
			// Attempt to initialise a second time
			await shouldRevert(rp.node.initialiseFeeDistributor({ from: node1 }), "Was able to initialise again", "Already initialised");
		});

		it(printTitle("node operator", "can distribute rewards with no minipools"), async () => {
			// Send ETH and distribute
			await web3.eth.sendTransaction({ to: distributorAddress, from: owner, value: web3.utils.toWei("1", "ether") });
			await distributeRewards(web3, rp, node2, null);
		});

		it(printTitle("node operator", "can distribute rewards with 1 minipool"), async () => {
			// Register node
			await registerNode(web3, rp, { from: node2, gas: gasLimit });
			await nodeStakeRPL(web3, rp, rplStake, { from: node2, gas: gasLimit });
			// Create and stake a minipool
			const stakingMinipool = (await createMinipool(web3, rp, { from: node2, value: web3.utils.toWei("32", "ether"), gas: gasLimit })) as MinipoolContract;
			await increaseTime(web3, scrubPeriod + 1);
			await stakeMinipool(web3, rp, stakingMinipool, { from: node2, gas: gasLimit });
			// Distribute
			await web3.eth.sendTransaction({ to: distributorAddress, from: owner, value: web3.utils.toWei("1", "ether"), gas: gasLimit });
			await distributeRewards(web3, rp, node2, null);
		});

		it(printTitle("node operator", "can distribute rewards with multiple minipools"), async () => {
			// Register node
			await registerNode(web3, rp, { from: node2, gas: gasLimit });
			await nodeStakeRPL(web3, rp, rplStake, { from: node2, gas: gasLimit });
			// Create and stake a minipool
			const stakingMinipool1 = (await createMinipool(web3, rp, { from: node2, value: web3.utils.toWei("32", "ether"), gas: gasLimit })) as MinipoolContract;
			const stakingMinipool2 = (await createMinipool(web3, rp, { from: node2, value: web3.utils.toWei("32", "ether"), gas: gasLimit })) as MinipoolContract;
			await increaseTime(web3, scrubPeriod + 1);
			await stakeMinipool(web3, rp, stakingMinipool1, { from: node2, gas: gasLimit });
			await stakeMinipool(web3, rp, stakingMinipool2, { from: node2, gas: gasLimit });

			await web3.eth.sendTransaction({ to: distributorAddress, from: owner, value: web3.utils.toWei("1", "ether"), gas: gasLimit });
			await distributeRewards(web3, rp, node2, null);
		});

		it(printTitle("node operator", "can distribute rewards after staking and withdrawing"), async () => {
			// Register node
			await registerNode(web3, rp, { from: node2, gas: gasLimit });
			await nodeStakeRPL(web3, rp, rplStake, { from: node2, gas: gasLimit });
			// Create and stake a minipool
			const stakingMinipool1 = (await createMinipool(web3, rp, { from: node2, value: web3.utils.toWei("32", "ether"), gas: gasLimit })) as MinipoolContract;
			const stakingMinipool2 = (await createMinipool(web3, rp, { from: node2, value: web3.utils.toWei("32", "ether"), gas: gasLimit })) as MinipoolContract;
			await increaseTime(web3, scrubPeriod + 1);
			await stakeMinipool(web3, rp, stakingMinipool1, { from: node2, gas: gasLimit });
			await stakeMinipool(web3, rp, stakingMinipool2, { from: node2, gas: gasLimit });

			// Mark minipool as withdrawable to remove it from the average fee calculation
			await submitMinipoolWithdrawable(web3, rp, stakingMinipool1.address, { from: trustedNode, gas: gasLimit });

			await web3.eth.sendTransaction({ to: distributorAddress, from: owner, value: web3.utils.toWei("1", "ether"), gas: gasLimit });
			await distributeRewards(web3, rp, node2, null);
		});
	});
}
