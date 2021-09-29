// Imports
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { takeSnapshot, revertSnapshot, increaseTime } from "../_utils/evm";
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
export default function runNodeStakingTests(web3: Web3, rp: RocketPool) {
	describe("Node Staking", () => {
		// settings
		const gasLimit = 8000000;

		// Accounts
		let owner: string;
		let node: string;
		let random: string;
		let trustedNode: string;

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

		let rocketNodeStaking: Contract;
		// Setup
		before(async () => {
			// Get accounts
			[owner, node, random, trustedNode] = await web3.eth.getAccounts();

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
			await mintRPL(web3, rp, owner, node, rplAmount);
			await mintRPL(web3, rp, owner, random, rplAmount);

			rocketNodeStaking = await rp.contracts.get("rocketNodeStaking");
		});

		it(printTitle("node operator", "can stake RPL"), async () => {
			// Set parameters
			const rplAmount = web3.utils.toWei("5000", "ether");

			// Approve transfer & stake RPL once
			await approveRPL(web3, rp, rocketNodeStaking.options.address, rplAmount, {
				from: node,
				gas: gasLimit,
			});
			await stakeRpl(web3, rp, rplAmount, {
				from: node,
				gas: gasLimit,
			});

			// Make node deposit / create minipool
			await nodeDeposit(web3, rp, {
				from: node,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			});
			// Approve transfer & stake RPL twice
			await approveRPL(web3, rp, rocketNodeStaking.options.address, rplAmount, {
				from: node,
				gas: gasLimit,
			});
			await stakeRpl(web3, rp, rplAmount, {
				from: node,
				gas: gasLimit,
			});
		});

		it(printTitle("random address", "cannot stake RPL"), async () => {
			// Set parameters
			const rplAmount = web3.utils.toWei("10000", "ether");

			// Approve transfer & attempt to stake RPL
			await approveRPL(web3, rp, rocketNodeStaking.options.address, rplAmount, {
				from: node,
				gas: gasLimit,
			});
			await shouldRevert(
				stakeRpl(web3, rp, rplAmount, {
					from: random,
					gas: gasLimit,
				}),
				"Random address staked RPL",
				"Invalid node"
			);
		});

		it(printTitle("node operator", "can withdraw staked RPL"), async () => {
			// Set parameters
			const rplAmount = web3.utils.toWei("10000", "ether");

			// Remove withdrawal cooldown period
			await setRewardsClaimIntervalTime(web3, rp, 0, {
				from: owner,
				gas: gasLimit,
			});

			// Stake RPL
			await nodeStakeRPL(web3, rp, rplAmount, { from: node, gas: gasLimit });

			// Withdraw staked RPL
			await withdrawRpl(web3, rp, rplAmount, {
				from: node,
				gas: gasLimit,
			});
		});

		it(printTitle("node operator", "cannot withdraw staked RPL during the cooldown period"), async () => {
			// Set parameters
			const rplAmount = web3.utils.toWei("10000", "ether");

			// Stake RPL
			await nodeStakeRPL(web3, rp, rplAmount, { from: node, gas: gasLimit });

			// Withdraw staked RPL
			await shouldRevert(
				withdrawRpl(web3, rp, rplAmount, {
					from: node,
					gas: gasLimit,
				}),
				"Withdrew staked RPL during the cooldown period",
				"The withdrawal cooldown period has not passed"
			);
		});

		it(printTitle("node operator", "cannot withdraw more RPL than they have staked"), async () => {
			// Set parameters
			const stakeAmount = web3.utils.toWei("10000", "ether");
			const withdrawAmount = web3.utils.toWei("20000", "ether");

			// Remove withdrawal cooldown period
			await setRewardsClaimIntervalTime(web3, rp, 0, {
				from: owner,
				gas: gasLimit,
			});

			// Stake RPL
			await nodeStakeRPL(web3, rp, stakeAmount, {
				from: node,
				gas: gasLimit,
			});

			// Withdraw staked RPL
			await shouldRevert(
				withdrawRpl(web3, rp, withdrawAmount, {
					from: node,
					gas: gasLimit,
				}),
				"Withdrew more RPL than was staked",
				"Withdrawal amount exceeds node's staked RPL balance"
			);
		});

		it(printTitle("node operator", "cannot withdraw RPL leaving the node undercollateralized"), async () => {
			// Set parameters
			const rplAmount = web3.utils.toWei("10000", "ether");

			// Remove withdrawal cooldown period
			await setRewardsClaimIntervalTime(web3, rp, 0, {
				from: owner,
				gas: gasLimit,
			});

			// Stake RPL
			await nodeStakeRPL(web3, rp, rplAmount, { from: node, gas: gasLimit });

			// Make node deposit / create minipool
			await nodeDeposit(web3, rp, {
				from: node,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			});

			// Withdraw staked RPL
			await shouldRevert(
				withdrawRpl(web3, rp, rplAmount, {
					from: node,
					gas: gasLimit,
				}),
				"Withdrew RPL leaving the node undercollateralized",
				"Node's staked RPL balance after withdrawal is less than required balance"
			);
		});

		it(printTitle("node operator", "can withdraw RPL after finalising their minipool"), async () => {
			// Set parameters
			const rplAmount = web3.utils.toWei("10000", "ether");

			// Remove withdrawal cooldown period
			await setRewardsClaimIntervalTime(web3, rp, 0, {
				from: owner,
				gas: gasLimit,
			});

			// Stake RPL
			await nodeStakeRPL(web3, rp, rplAmount, { from: node, gas: gasLimit });

			// Create a staking minipool
			await userDeposit(web3, rp, {
				from: random,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			});
			const minipool = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;
			await stakeMinipool(web3, rp, minipool, null, {
				from: node,
				gas: gasLimit,
			});

			// Cannot withdraw RPL yet
			await shouldRevert(
				withdrawRpl(web3, rp, rplAmount, {
					from: node,
					gas: gasLimit,
				}),
				"Withdrew RPL leaving the node undercollateralized",
				"Node's staked RPL balance after withdrawal is less than required balance"
			);

			// Mark pool as withdrawable
			await submitWithdrawable(web3, rp, minipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});

			// Still cannot withdraw RPL yet
			await shouldRevert(
				withdrawRpl(web3, rp, rplAmount, {
					from: node,
					gas: gasLimit,
				}),
				"Withdrew RPL leaving the node undercollateralized",
				"Node's staked RPL balance after withdrawal is less than required balance"
			);

			// Withdraw and finalise
			await withdrawValidatorBalance(web3, rp, minipool, web3.utils.toWei("32", "ether"), node, true);

			// Should be able to withdraw now
			await withdrawRpl(web3, rp, rplAmount, {
				from: node,
				gas: gasLimit,
			});
		});

		it(printTitle("node operator", "cannot withdraw RPL if random distributes balance on their minipool until they finalise"), async () => {
			// Set parameters
			const rplAmount = web3.utils.toWei("10000", "ether");

			// Remove withdrawal cooldown period
			await setRewardsClaimIntervalTime(web3, rp, 0, {
				from: owner,
				gas: gasLimit,
			});

			// Stake RPL
			await nodeStakeRPL(web3, rp, rplAmount, { from: node, gas: gasLimit });

			// Create a staking minipool
			await userDeposit(web3, rp, {
				from: random,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			});
			const minipool = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;
			await stakeMinipool(web3, rp, minipool, null, {
				from: node,
				gas: gasLimit,
			});

			// Mark pool as withdrawable
			await submitWithdrawable(web3, rp, minipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});

			// Wait 14 days
			await increaseTime(web3, 60 * (60 * 24 * 14) + 1);

			// Withdraw and finalise
			await withdrawValidatorBalance(web3, rp, minipool, web3.utils.toWei("32", "ether"), random, false);

			// Cannot withdraw RPL yet
			await shouldRevert(
				withdrawRpl(web3, rp, rplAmount, {
					from: node,
					gas: gasLimit,
				}),
				"Withdrew RPL leaving the node undercollateralized",
				"Node's staked RPL balance after withdrawal is less than required balance"
			);

			// Finalise the pool
			await minipool.finalise({ from: node, gas: gasLimit });

			// Should be able to withdraw now
			await withdrawRpl(web3, rp, rplAmount, {
				from: node,
				gas: gasLimit,
			});
		});

		it(printTitle("random address", "cannot withdraw staked RPL"), async () => {
			// Set parameters
			const rplAmount = web3.utils.toWei("10000", "ether");

			// Remove withdrawal cooldown period
			await setRewardsClaimIntervalTime(web3, rp, 0, {
				from: owner,
				gas: gasLimit,
			});

			// Stake RPL
			await nodeStakeRPL(web3, rp, rplAmount, { from: node, gas: gasLimit });

			// Withdraw staked RPL
			await shouldRevert(
				withdrawRpl(web3, rp, rplAmount, {
					from: random,
					gas: gasLimit,
				}),
				"Random address withdrew staked RPL",
				"Invalid node"
			);
		});
	});
}
