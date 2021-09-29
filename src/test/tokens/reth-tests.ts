// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { takeSnapshot, revertSnapshot, mineBlocks, increaseTime } from "../_utils/evm";
import { nodeStakeRPL, setNodeTrusted, setNodeWithdrawalAddress } from "../_helpers/node";
import { getRethBalance, getRethExchangeRate, getRethTotalSupply, mintRPL } from "../_helpers/tokens";
import { printTitle } from "../_utils/formatting";
import { shouldRevert } from "../_utils/testing";
import { createMinipool, getMinipoolMinimumRPLStake, payoutMinipool, stakeMinipool, submitMinipoolWithdrawable } from "../_helpers/minipool";
import { setDAOProtocolBootstrapSetting } from "../dao/scenario-dao-protocol-bootstrap";
import { submitBalances } from "../_helpers/network";
import { getValidatorPubkey } from "../_utils/beacon";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { getDepositExcessBalance, userDeposit } from "../_helpers/deposit";
import { burnReth } from "./scenario-burn-reth";
import { transferReth } from "./scenario-transfer-reth";
import { withdrawValidatorBalance } from "../minipool/scenario-withdraw-validator-balance";

// Tests
export default function runRethTests(web3: Web3, rp: RocketPool) {
	describe("rETH", () => {
		// settings
		const gasLimit = 8000000;

		// Accounts
		let owner: string;
		let node: string;
		let nodeWithdrawalAddress: string;
		let trustedNode: string;
		let staker1: string;
		let staker2: string;
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

		// Setup
		let minipool: MinipoolContract;
		const validatorPubkey = getValidatorPubkey();
		const withdrawalBalance = web3.utils.toWei("36", "ether");
		let rethBalance: any;
		const submitPricesFrequency = 500;
		const depositDelay = 100;

		before(async () => {
			// Get current rETH exchange rate
			const exchangeRate1 = await getRethExchangeRate(web3, rp).then((value: any) => web3.utils.toBN(value));

			// Get accounts
			[owner, node, nodeWithdrawalAddress, trustedNode, staker1, staker2, random] = await web3.eth.getAccounts();

			// Make deposit
			await userDeposit(web3, rp, {
				from: staker1,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			});

			// Register node
			await rp.node.registerNode("Australia/Brisbane", {
				from: node,
				gas: gasLimit,
			});
			await setNodeWithdrawalAddress(web3, rp, node, nodeWithdrawalAddress, {
				from: node,
				gas: gasLimit,
			});

			// Register trusted nodes
			await rp.node.registerNode("Australia/Brisbane", {
				from: trustedNode,
				gas: gasLimit,
			});
			await setNodeTrusted(web3, rp, trustedNode, "saas_1", "node@home.com", owner);

			// Set settings
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.reth.collateral.target", web3.utils.toWei("1", "ether"), {
				from: owner,
				gas: gasLimit,
			});
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.submit.prices.frequency", submitPricesFrequency, {
				from: owner,
				gas: gasLimit,
			});
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.reth.deposit.delay", depositDelay, {
				from: owner,
				gas: gasLimit,
			});

			// Stake RPL to cover minipools
			const rplStake = await getMinipoolMinimumRPLStake(web3, rp);
			await mintRPL(web3, rp, owner, node, rplStake);
			await nodeStakeRPL(web3, rp, rplStake, { from: node, gas: gasLimit });

			// Create and withdraw from withdrawable minipool
			minipool = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;
			await stakeMinipool(web3, rp, minipool, validatorPubkey, {
				from: node,
				gas: gasLimit,
			});
			await submitMinipoolWithdrawable(web3, rp, minipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});

			// Update network ETH total to alter rETH exchange rate
			const rethSupply = await getRethTotalSupply(web3, rp);
			const nodeFee = await minipool.getNodeFee().then((value: string | number) => web3.utils.toBN(value));
			const depositBalance = web3.utils.toBN(web3.utils.toWei("32"));
			const userAmount = web3.utils.toBN(web3.utils.toWei("16"));
			const rewards = web3.utils.toBN(withdrawalBalance).sub(depositBalance);
			const halfRewards = rewards.divn(2);
			const nodeCommissionFee = halfRewards.mul(nodeFee).div(web3.utils.toBN(web3.utils.toWei("1")));
			const ethBalance = userAmount.add(halfRewards.sub(nodeCommissionFee)).toString();
			await submitBalances(web3, rp, 1, ethBalance, "0", rethSupply, {
				from: trustedNode,
				gas: gasLimit,
			});

			// Get & check staker rETH balance
			rethBalance = await getRethBalance(web3, rp, staker1).then((value: any) => web3.utils.toBN(value));
			assert(rethBalance.gt(web3.utils.toBN(0)), "Incorrect staker rETH balance");

			// Get & check updated rETH exchange rate
			const exchangeRate2 = await getRethExchangeRate(web3, rp).then((value: any) => web3.utils.toBN(value));
			assert(!exchangeRate1.eq(exchangeRate2), "rETH exchange rate has not changed");
		});

		it(printTitle("rETH holder", "cannot burn rETH before enough time has passed"), async () => {
			// Make user deposit
			const depositAmount = web3.utils.toBN(web3.utils.toWei("20", "ether"));
			await userDeposit(web3, rp, {
				from: staker2,
				value: depositAmount,
				gas: gasLimit,
			});

			// Check deposit pool excess balance
			const excessBalance = await getDepositExcessBalance(web3, rp);
			assert(web3.utils.toBN(excessBalance).eq(depositAmount), "Incorrect deposit pool excess balance");

			// Burn rETH
			await shouldRevert(
				burnReth(web3, rp, rethBalance, {
					from: staker1,
					gas: gasLimit,
				}),
				"Burn should have failed before enough time has passed",
				"Not enough time has passed since deposit"
			);
		});

		it(printTitle("rETH holder", "cannot transfer rETH before enough time has passed"), async () => {
			// Make user deposit
			const depositAmount = web3.utils.toBN(web3.utils.toWei("20", "ether"));
			await userDeposit(web3, rp, {
				from: staker2,
				value: depositAmount,
				gas: gasLimit,
			});

			// Transfer rETH
			await shouldRevert(
				transferReth(web3, rp, random, rethBalance, {
					from: staker1,
					gas: gasLimit,
				}),
				"Transfer should have failed before enough time has passed",
				"Not enough time has passed since deposit"
			);
		});

		it(printTitle("rETH holder", "can transfer rETH after enough time has passed"), async () => {
			// Make user deposit
			const depositAmount = web3.utils.toBN(web3.utils.toWei("20", "ether"));
			await userDeposit(web3, rp, {
				from: staker2,
				value: depositAmount,
				gas: gasLimit,
			});

			// Wait "network.reth.deposit.delay" blocks
			await mineBlocks(web3, depositDelay);

			// Transfer rETH
			await transferReth(web3, rp, random, rethBalance, {
				from: staker1,
				gas: gasLimit,
			});
		});

		it(printTitle("rETH holder", "can transfer rETH without waiting if received via transfer"), async () => {
			// Make user deposit
			const depositAmount = web3.utils.toBN(web3.utils.toWei("20", "ether"));
			await userDeposit(web3, rp, {
				from: staker2,
				value: depositAmount,
				gas: gasLimit,
			});

			// Wait "network.reth.deposit.delay" blocks
			await mineBlocks(web3, depositDelay);

			// Transfer rETH
			await transferReth(web3, rp, random, rethBalance, {
				from: staker1,
				gas: gasLimit,
			});

			// Transfer rETH again
			await transferReth(web3, rp, staker1, rethBalance, {
				from: random,
				gas: gasLimit,
			});
		});

		it(printTitle("rETH holder", "can burn rETH for ETH collateral"), async () => {
			// Wait "network.reth.deposit.delay" blocks
			await mineBlocks(web3, depositDelay);

			// Send ETH to the minipool to simulate receiving from SWC
			await web3.eth.sendTransaction({
				from: trustedNode,
				to: minipool.address,
				value: withdrawalBalance,
			});

			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Run the payout function now
			await withdrawValidatorBalance(web3, rp, minipool, "0", random, false);

			// Burn rETH
			await burnReth(web3, rp, rethBalance, {
				from: staker1,
				gas: gasLimit,
			});
		});

		it(printTitle("rETH holder", "can burn rETH for excess deposit pool ETH"), async () => {
			// Make user deposit
			const depositAmount = web3.utils.toBN(web3.utils.toWei("20", "ether"));
			await userDeposit(web3, rp, {
				from: staker2,
				value: depositAmount,
				gas: gasLimit,
			});

			// Check deposit pool excess balance
			const excessBalance = await getDepositExcessBalance(web3, rp);
			assert(web3.utils.toBN(excessBalance).eq(depositAmount), "Incorrect deposit pool excess balance");

			// Wait "network.reth.deposit.delay" blocks
			await mineBlocks(web3, depositDelay);

			// Burn rETH
			await burnReth(web3, rp, rethBalance, {
				from: staker1,
				gas: gasLimit,
			});
		});

		it(printTitle("rETH holder", "cannot burn an invalid amount of rETH"), async () => {
			// Wait "network.reth.deposit.delay" blocks
			await mineBlocks(web3, depositDelay);

			// Send ETH to the minipool to simulate receving from SWC
			await web3.eth.sendTransaction({
				from: trustedNode,
				to: minipool.address,
				value: withdrawalBalance,
			});

			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Run the payout function now
			await withdrawValidatorBalance(web3, rp, minipool, "0", random, false);

			// Get burn amounts
			const burnZero = web3.utils.toWei("0", "ether");
			const burnExcess = web3.utils.toBN(web3.utils.toWei("100", "ether"));
			assert(burnExcess.gt(rethBalance), "Burn amount does not exceed rETH balance");

			// Attempt to burn 0 rETH
			await shouldRevert(
				burnReth(web3, rp, burnZero, {
					from: staker1,
				}),
				"Burned an invalid amount of rETH",
				"Invalid token burn amount"
			);

			// Attempt to burn too much rETH
			await shouldRevert(
				burnReth(web3, rp, burnExcess.toString(), {
					from: staker1,
				}),
				"Burned an amount of rETH greater than the token balance",
				"Insufficient rETH balance"
			);
		});

		it(printTitle("rETH holder", "cannot burn rETH with insufficient collateral"), async () => {
			// Wait "network.reth.deposit.delay" blocks
			await mineBlocks(web3, depositDelay);

			// Attempt to burn rETH for contract collateral
			await shouldRevert(
				burnReth(web3, rp, rethBalance, {
					from: staker1,
					gas: gasLimit,
				}),
				"Burned rETH with an insufficient contract ETH balance",
				"Insufficient ETH balance for exchange"
			);

			// Make user deposit
			const depositAmount = web3.utils.toBN(web3.utils.toWei("10", "ether"));
			await userDeposit(web3, rp, {
				from: staker2,
				value: depositAmount,
				gas: gasLimit,
			});

			// Check deposit pool excess balance
			const excessBalance = await getDepositExcessBalance(web3, rp);
			assert(web3.utils.toBN(excessBalance).eq(depositAmount), "Incorrect deposit pool excess balance");

			// Attempt to burn rETH for excess deposit pool ETH
			await shouldRevert(
				burnReth(web3, rp, rethBalance, {
					from: staker1,
					gas: gasLimit,
				}),
				"Burned rETH with an insufficient deposit pool excess ETH balance",
				"Insufficient ETH balance for exchange"
			);
		});
	});
}
