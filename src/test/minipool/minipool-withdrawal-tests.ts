// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { takeSnapshot, revertSnapshot, mineBlocks, increaseTime } from "../_utils/evm";
import { createMinipool, getMinipoolMinimumRPLStake, stakeMinipool, submitMinipoolWithdrawable } from "../_helpers/minipool";
import { close } from "./scenario-close";
import { dissolve } from "./scenario-dissolve";
import { refund } from "./scenario-refund";
import { stake } from "./scenario-stake";
import { withdrawValidatorBalance } from "./scenario-withdraw-validator-balance";
import { withdraw } from "./scenario-withdraw";
import { nodeStakeRPL, setNodeTrusted, setNodeWithdrawalAddress } from "../_helpers/node";
import { setDAOProtocolBootstrapSetting } from "../dao/scenario-dao-protocol-bootstrap";
import { userDeposit } from "../_helpers/deposit";
import { mintRPL } from "../_helpers/tokens";
import { printTitle } from "../_utils/formatting";
import { shouldRevert } from "../_utils/testing";
import { getValidatorPubkey } from "../_utils/beacon";
import { getNetworkSetting } from "../_helpers/settings";
import { getNodeFee, submitPrices } from "../_helpers/network";
import { setDaoNodeTrustedBootstrapUpgrade } from "../dao/scenario-dao-node-trusted-bootstrap";
import { Contract } from "web3-eth-contract";

// Tests
export default function runMinipoolWithdrawalTests(web3: Web3, rp: RocketPool) {
	describe("Minipool Withdrawal Tests", () => {
		// settings
		const gasLimit = 8000000;

		// Accounts
		let owner: string;
		let node: string;
		let nodeWithdrawalAddress: string;
		let trustedNode: string;
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
		const launchTimeout = 60 * 60 * 72; // 72 hours
		const withdrawalDelay = 20;
		const scrubPeriod = 60 * 60 * 24; // 24 hours
		let minipool: MinipoolContract;
		let unbondedMinipool: MinipoolContract;
		let fullDepositMinipool: MinipoolContract;
		let penaltyTestContract: Contract;
		const maxPenaltyRate = web3.utils.toWei("0.5", "ether");

		before(async () => {
			// Get accounts
			[owner, node, nodeWithdrawalAddress, trustedNode, random] = await web3.eth.getAccounts();

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
				from: trustedNode,
				gas: gasLimit,
			});
			await setNodeTrusted(web3, rp, trustedNode, "saas_1", "node@home.com", owner);

			// Set settings
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsMinipool", "minipool.launch.timeout", launchTimeout, {
				from: owner,
				gas: gasLimit,
			});
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsMinipool", "minipool.withdrawal.delay", withdrawalDelay, {
				from: owner,
				gas: gasLimit,
			});
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsMinipool", "minipool.scrub.period", scrubPeriod, {
				from: owner,
				gas: gasLimit,
			});

			// Set rETH collateralisation target to a value high enough it won't cause excess ETH to be funneled back into deposit pool and mess with our calcs
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.reth.collateral.target", web3.utils.toWei("50", "ether"), {
				from: owner,
				gas: gasLimit,
			});

			// Set RPL price
			const block = await web3.eth.getBlockNumber();
			await submitPrices(web3, rp, block, web3.utils.toWei("1", "ether"), "0", { from: trustedNode, gas: gasLimit });

			// Add penalty helper contract
			const rocketStorage = await rp.contracts.get("rocketStorage");
			const penaltyTest = require("../../contracts/PenaltyTest.json");

			const penaltyTestContractInstance = new web3.eth.Contract(penaltyTest.abi);
			penaltyTestContract = await penaltyTestContractInstance
				.deploy({
					data: penaltyTest.bytecode,
					arguments: [rocketStorage.options.address],
				})
				.send({ from: owner, gas: gasLimit });

			await setDaoNodeTrustedBootstrapUpgrade(web3, rp, "addContract", "rocketPenaltyTest", penaltyTest.abi, penaltyTestContract.options.address, {
				from: owner,
				gas: gasLimit,
			});

			// Enable penalties
			const rocketMinipoolPenalty = await rp.contracts.get("rocketMinipoolPenalty");
			await rocketMinipoolPenalty.methods.setMaxPenaltyRate(maxPenaltyRate).send({ from: owner, gas: gasLimit });

			// Hard code fee to 50%
			const fee = web3.utils.toWei("0.5", "ether");
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.node.fee.minimum", fee, {
				from: owner,
				gas: gasLimit,
			});
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.node.fee.target", fee, {
				from: owner,
				gas: gasLimit,
			});
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.node.fee.maximum", fee, {
				from: owner,
				gas: gasLimit,
			});

			// Deposit some user funds to assign to pool
			const userDepositAmount = web3.utils.toWei("16", "ether");
			await userDeposit(web3, rp, {
				from: random,
				value: userDepositAmount,
				gas: gasLimit,
			});

			// Stake RPL to cover minipools
			const minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
			const rplStake = minipoolRplStake.mul(web3.utils.toBN(3));
			await mintRPL(web3, rp, owner, node, rplStake);
			await nodeStakeRPL(web3, rp, rplStake, { from: node, gas: gasLimit });
			await mintRPL(web3, rp, owner, trustedNode, rplStake);
			await nodeStakeRPL(web3, rp, rplStake, { from: trustedNode, gas: gasLimit });

			// Create minipools
			minipool = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;

			// unbondedMinipool = (await createMinipool(web3, rp, {
			// 	from: trustedNode,
			// 	gas: gasLimit,
			// })) as MinipoolContract;
			// await stakeMinipool(web3, rp, unbondedMinipool, {
			// 	from: trustedNode,
			// 	gas: gasLimit,
			// });

			fullDepositMinipool = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("32", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;

			// Wait required scrub period
			await increaseTime(web3, scrubPeriod + 1);

			await stakeMinipool(web3, rp, minipool, {
				from: node,
				gas: gasLimit,
			});
			await stakeMinipool(web3, rp, fullDepositMinipool, {
				from: node,
				gas: gasLimit,
			});
		});

		async function withdrawAndCheck(
			minipool: MinipoolContract,
			withdrawalBalance: string,
			from: string,
			finalise: boolean,
			expectedUser: string,
			expectedNode: string
		) {
			const withdrawalBalanceBN = web3.utils.toBN(web3.utils.toWei(withdrawalBalance, "ether"));
			const expectedUserBN = web3.utils.toBN(web3.utils.toWei(expectedUser, "ether"));
			const expectedNodeBN = web3.utils.toBN(web3.utils.toWei(expectedNode, "ether"));

			// Process withdrawal
			const { nodeBalanceChange, rethBalanceChange } = await withdrawValidatorBalance(web3, rp, minipool, withdrawalBalanceBN.toString(), from, finalise);

			// Check results
			assert(expectedUserBN.eq(rethBalanceChange), "User balance was incorrect");
			assert(expectedNodeBN.eq(nodeBalanceChange), "Node balance was incorrect");
		}

		async function slashAndCheck(from: string, expectedSlash: string) {
			const expectedSlashBN = web3.utils.toBN(expectedSlash);
			const rocketNodeStaking = await rp.contracts.get("rocketNodeStaking");
			const rplStake1 = await rocketNodeStaking.methods
				.getNodeRPLStake(node)
				.call()
				.then((value: any) => web3.utils.toBN(value));
			await minipool.slash({ from: from, gas: gasLimit });
			const rplStake2 = await rocketNodeStaking.methods
				.getNodeRPLStake(node)
				.call()
				.then((value: any) => web3.utils.toBN(value));
			const slashedAmount = rplStake1.sub(rplStake2);
			assert(expectedSlashBN.eq(slashedAmount), "Slashed amount was incorrect");
		}

		it(printTitle("node operator withdrawal address", "can process withdrawal when balance is greater than 32 ETH and marked as withdrawable"), async () => {
			// Mark minipool withdrawable
			await submitMinipoolWithdrawable(web3, rp, minipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});
			// Process withdraw
			await withdrawAndCheck(minipool, "36", nodeWithdrawalAddress, true, "17", "19");
		});

		it(printTitle("random user", "can process withdrawal when balance is greater than 32 ETH and marked as withdrawable"), async () => {
			// Mark minipool withdrawable
			await submitMinipoolWithdrawable(web3, rp, minipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});
			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Process withdraw
			await withdrawAndCheck(minipool, "36", random, false, "17", "19");
		});

		it(
			printTitle("node operator withdrawal address", "can process withdrawal when balance is greater than 32 ETH and not marked as withdrawable"),
			async () => {
				// Process withdraw
				await withdrawAndCheck(minipool, "36", nodeWithdrawalAddress, false, "17", "19");
			}
		);

		it(printTitle("random user", "can process withdrawal when balance is greater than 32 ETH and not marked as withdrawable"), async () => {
			// Process withdraw
			await withdrawAndCheck(minipool, "36", random, false, "17", "19");
		});

		it(
			printTitle("node operator withdrawal address", "can process withdrawal when balance is greater than 16 ETH, less than 32 ETH and marked as withdrawable"),
			async () => {
				// Mark minipool withdrawable
				await submitMinipoolWithdrawable(web3, rp, minipool.address, {
					from: trustedNode,
					gas: gasLimit,
				});
				// Process withdraw
				await withdrawAndCheck(minipool, "28", nodeWithdrawalAddress, true, "16", "12");
			}
		);

		it(printTitle("random user", "can process withdrawal when balance is greater than 16 ETH, less than 32 ETH and marked as withdrawable"), async () => {
			// Mark minipool withdrawable
			await submitMinipoolWithdrawable(web3, rp, minipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});
			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Process withdraw
			await withdrawAndCheck(minipool, "28", random, false, "16", "12");
		});

		it(
			printTitle(
				"node operator withdrawal address",
				"can process withdrawal when balance is greater than 16 ETH, less than 32 ETH and not marked as withdrawable"
			),
			async () => {
				// Process withdraw
				await withdrawAndCheck(minipool, "28", nodeWithdrawalAddress, false, "16", "12");
			}
		);

		it(printTitle("random user", "can process withdrawal when balance is greater than 16 ETH, less than 32 ETH and not marked as withdrawable"), async () => {
			// Process withdraw
			await withdrawAndCheck(minipool, "28", random, false, "16", "12");
		});

		it(printTitle("node operator withdrawal address", "can process withdrawal when balance is less than 16 ETH and marked as withdrawable"), async () => {
			// Mark minipool withdrawable
			await submitMinipoolWithdrawable(web3, rp, minipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});
			// Process withdraw
			await withdrawAndCheck(minipool, "15", nodeWithdrawalAddress, true, "15", "0");
		});

		it(printTitle("random address", "can process withdrawal when balance is less than 16 ETH and marked as withdrawable after 14 days"), async () => {
			// Mark minipool withdrawable
			await submitMinipoolWithdrawable(web3, rp, minipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});
			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Process withdraw
			await withdrawAndCheck(minipool, "15", random, false, "15", "0");
			await slashAndCheck(random, web3.utils.toBN(web3.utils.toWei("1")).toString());
		});

		it(printTitle("random address", "cannot slash a node operator by sending 4 ETH and distribute after 14 days"), async () => {
			// Mark minipool withdrawable
			await submitMinipoolWithdrawable(web3, rp, minipool.address, { from: trustedNode, gas: gasLimit });
			// Process withdraw
			await withdrawAndCheck(minipool, "28", nodeWithdrawalAddress, true, "16", "12");
			// Wait 14 days and mine enough blocks to pass cooldown
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			await mineBlocks(web3, 101);
			// Process withdraw and attempt to slash
			await withdrawAndCheck(minipool, "4", random, false, "4", "0");
			await shouldRevert(minipool.slash({ from: random, gas: gasLimit }), "Was able to slash minipool", "No balance to slash");
		});

		it(printTitle("random address", "cannot process withdrawal when balance is less than 16 ETH and marked as withdrawable before 14 days"), async () => {
			// Mark minipool withdrawable
			await submitMinipoolWithdrawable(web3, rp, minipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});
			// Process withdraw
			const withdrawalBalance = web3.utils.toWei("15", "ether");
			await shouldRevert(
				withdrawValidatorBalance(web3, rp, minipool, withdrawalBalance, random, false),
				"Processed withdrawal before 14 days have passed",
				"Non-owner must wait 14 days after withdrawal to distribute balance"
			);
		});

		it(printTitle("node operator withdrawal address", "cannot process withdrawal and finalise minipool while not marked as withdrawable"), async () => {
			// Process withdraw
			const withdrawalBalance = web3.utils.toWei("32", "ether");
			await shouldRevert(
				withdrawValidatorBalance(web3, rp, minipool, withdrawalBalance, nodeWithdrawalAddress, true),
				"Processed withdrawal and finalise pool while status was not withdrawable",
				"Minipool must be withdrawable"
			);
		});

		it(printTitle("node operator withdrawal address", "can process withdrawal when balance is less than 16 ETH and not marked as withdrawable"), async () => {
			// Process withdraw
			await withdrawAndCheck(minipool, "15", nodeWithdrawalAddress, false, "15", "0");
		});

		it(
			printTitle(
				"node operator withdrawal address",
				"cannot process withdrawal and finalise pool when balance is less than 16 ETH and not marked as withdrawable"
			),
			async () => {
				// Process withdraw
				const withdrawalBalance = web3.utils.toWei("15", "ether");
				await shouldRevert(
					withdrawValidatorBalance(web3, rp, minipool, withdrawalBalance, nodeWithdrawalAddress, true),
					"Processed withdrawal and destroyed pool while status was not withdrawable",
					"Minipool must be withdrawable"
				);
			}
		);

		// Unbonded pools (temporarily disabled)
		// it(printTitle("trusted node", "can process withdrawal on unbonded minipool when balance is greater than 32 ETH and marked as withdrawable"), async () => {
		// 	// Mark minipool withdrawable
		// 	await submitMinipoolWithdrawable(web3, rp, unbondedMinipool.address, { from: trustedNode, gas: gasLimit });
		// 	// Process withdraw
		// 	await withdrawAndCheck(unbondedMinipool, "36", trustedNode, true, "35", "1");
		// });
		//
		// it(printTitle("trusted node", "can process withdrawal on unbonded minipool when balance is less than 32 ETH and marked as withdrawable"), async () => {
		// 	// Mark minipool withdrawable
		// 	await submitMinipoolWithdrawable(web3, rp, unbondedMinipool.address, { from: trustedNode, gas: gasLimit });
		// 	// Process withdraw
		// 	await withdrawAndCheck(unbondedMinipool, "30", trustedNode, true, "30", "0");
		// });

		// Full deposit minipools
		it(
			printTitle("trusted node", "can process withdrawal on full deposit minipool when balance is greater than 32 ETH and marked as withdrawable"),
			async () => {
				// Mark minipool withdrawable
				await submitMinipoolWithdrawable(web3, rp, fullDepositMinipool.address, { from: trustedNode, gas: gasLimit });
				// Process withdraw
				await withdrawAndCheck(fullDepositMinipool, "36", node, true, "1", "35");
			}
		);

		it(printTitle("trusted node", "can process withdrawal on full deposit minipool when balance is less than 32 ETH and marked as withdrawable"), async () => {
			// Mark minipool withdrawable
			await submitMinipoolWithdrawable(web3, rp, fullDepositMinipool.address, { from: trustedNode, gas: gasLimit });
			// Process withdraw
			await withdrawAndCheck(fullDepositMinipool, "30", node, true, "0", "30");
		});

		// ETH penalty events
		// it(printTitle("node operator withdrawal address", "can process withdrawal and finalise pool when penalised by DAO"), async () => {
		// 	// Penalise the minipool 50% of it's ETH
		// 	await penaltyTestContract.methods.setPenaltyRate(minipool.address, maxPenaltyRate).call();
		// 	//console.log(await penaltyTestContract.methods.setPenaltyRate(minipool.address, maxPenaltyRate).call());
		// 	// Mark minipool withdrawable
		// 	await submitMinipoolWithdrawable(web3, rp, minipool.address, {
		// 		from: trustedNode,
		// 		gas: gasLimit,
		// 	});
		// 	// Process withdraw - 36 ETH would normally give node operator 19 and user 17 but with a 50% penalty, and extra 9.5 goes to the user
		// 	await withdrawAndCheck(minipool, "36", nodeWithdrawalAddress, true, "26.5", "9.5");
		// });
		//
		// it(printTitle("node operator withdrawal address", "cannot be penalised greater than the max penalty rate set by DAO"), async () => {
		// 	// Try to penalise the minipool 75% of it's ETH (max is 50%)
		// 	await penaltyTestContract.methods.setPenaltyRate(minipool.address, web3.utils.toWei("0.75")).call();
		// 	// Mark minipool withdrawable
		// 	await submitMinipoolWithdrawable(web3, rp, minipool.address, {
		// 		from: trustedNode,
		// 		gas: gasLimit,
		// 	});
		// 	// Process withdraw - 36 ETH would normally give node operator 19 and user 17 but with a 50% penalty, and extra 9.5 goes to the user
		// 	await withdrawAndCheck(minipool, "36", nodeWithdrawalAddress, true, "26.5", "9.5");
		// });

		it(printTitle("guardian", "can disable penalising all together"), async () => {
			// Disable penalising by setting rate to 0
			const rocketMinipoolPenalty = await rp.contracts.get("rocketMinipoolPenalty");
			await rocketMinipoolPenalty.methods.setMaxPenaltyRate("0").send({ from: owner, gas: gasLimit });
			// Try to penalise the minipool 50%
			await penaltyTestContract.methods.setPenaltyRate(minipool.address, web3.utils.toWei("0.5")).call();
			// Mark minipool withdrawable
			await submitMinipoolWithdrawable(web3, rp, minipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});
			// Process withdraw
			await withdrawAndCheck(minipool, "36", nodeWithdrawalAddress, true, "17", "19");
		});
	});
}
