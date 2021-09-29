// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { takeSnapshot, revertSnapshot, mineBlocks, getCurrentTime, increaseTime } from "../_utils/evm";
import {
	getCalculatedTotalEffectiveRPLStake,
	getNodeEffectiveRPLStake,
	getNodeMinimumRPLStake,
	getNodeRPLStake,
	nodeDeposit,
	nodeStakeRPL,
	registerNode,
	setNodeTrusted,
	setNodeWithdrawalAddress,
} from "../_helpers/node";
import { mintRPL } from "../_helpers/tokens";
import { printTitle } from "../_utils/formatting";
import { shouldRevert } from "../_utils/testing";
import {
	setDAONetworkBootstrapRewardsClaimer,
	setDAOProtocolBootstrapSetting,
	setRewardsClaimIntervalTime,
	setRPLInflationIntervalRate,
	setRPLInflationStartTime,
	spendRewardsClaimTreasury,
} from "../dao/scenario-dao-protocol-bootstrap";
import { submitPrices } from "../_helpers/network";
import { rewardsClaimersPercTotalGet } from "./scenario-rewards-claim";
import { rewardsClaimNode } from "./scenario-rewards-claim-node";
import { rewardsClaimTrustedNode } from "./scenario-rewards-claim-trusted-node";
import { getRewardsDAOTreasuryBalance, rewardsClaimDAO } from "./scenario-rewards-claim-dao";
import Minipool from "../../rocketpool/minipool/minipool";
import { createMinipool, stakeMinipool } from "../_helpers/minipool";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { userDeposit } from "../_helpers/deposit";

// Tests
export default function runRewardsTests(web3: Web3, rp: RocketPool) {
	describe("Rewards", () => {
		// settings
		const gasLimit = 8000000;
		const ONE_DAY = 24 * 60 * 60;

		// Accounts
		let owner: string;
		let userOne: string;
		let registeredNode1: string;
		let registeredNode2: string;
		let registeredNodeTrusted1: string;
		let registeredNodeTrusted2: string;
		let registeredNodeTrusted3: string;
		let node1WithdrawalAddress: string;
		let daoInvoiceRecipient: string;

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

		// The testing config
		const claimIntervalBlocks = 16;
		// Interval for calculating inflation
		const claimIntervalTime = ONE_DAY * 28;

		// Set some RPL inflation scenes
		const rplInflationSetup = async function () {
			// Current time
			const currentTime = await getCurrentTime(web3);
			// Starting block for when inflation will begin
			const timeStart = currentTime + ONE_DAY;
			// Yearly inflation target
			const yearlyInflationTarget = 0.05;

			// Set the daily inflation start time
			await setRPLInflationStartTime(web3, rp, timeStart, {
				from: owner,
				gas: gasLimit,
			});
			// Set the daily inflation rate
			await setRPLInflationIntervalRate(web3, rp, yearlyInflationTarget, {
				from: owner,
				gas: gasLimit,
			});

			// claimIntervalTime must be greater than rewardIntervalTime for tests to properly function
			assert(claimIntervalTime > ONE_DAY, "Tests will not function correctly unless claimIntervalTime is greater than inflation period (1 day)");

			// Return the starting block for inflation when it will be available
			return timeStart + ONE_DAY;
		};

		// Set a rewards claiming contract
		const rewardsContractSetup = async function (_claimContract: string, _claimAmountPerc: number) {
			// Set the amount this contract can claim
			await setDAONetworkBootstrapRewardsClaimer(web3, rp, _claimContract, web3.utils.toWei(_claimAmountPerc.toString(), "ether"), {
				from: owner,
				gas: gasLimit,
			});
			// Set the claim interval blocks
			await setRewardsClaimIntervalTime(web3, rp, claimIntervalBlocks, {
				from: owner,
				gas: gasLimit,
			});
		};

		before(async () => {
			// Get accounts
			[
				owner,
				userOne,
				registeredNode1,
				registeredNode2,
				registeredNodeTrusted1,
				registeredNodeTrusted2,
				registeredNodeTrusted3,
				node1WithdrawalAddress,
				daoInvoiceRecipient,
			] = await web3.eth.getAccounts();

			// Disable RocketClaimNode claims contract
			await setDAONetworkBootstrapRewardsClaimer(web3, rp, "rocketClaimNode", web3.utils.toWei("0", "ether"), {
				from: owner,
				gas: gasLimit,
			});

			// Register nodes
			await registerNode(web3, rp, { from: registeredNode1, gas: gasLimit });
			await registerNode(web3, rp, { from: registeredNode2, gas: gasLimit });
			await registerNode(web3, rp, {
				from: registeredNodeTrusted1,
				gas: gasLimit,
			});
			await registerNode(web3, rp, {
				from: registeredNodeTrusted2,
				gas: gasLimit,
			});
			await registerNode(web3, rp, {
				from: registeredNodeTrusted3,
				gas: gasLimit,
			});

			// Set node 1 withdrawal address
			await setNodeWithdrawalAddress(web3, rp, registeredNode1, node1WithdrawalAddress, {
				from: registeredNode1,
				gas: gasLimit,
			});

			// Set nodes as trusted
			await setNodeTrusted(web3, rp, registeredNodeTrusted1, "saas_1", "node@home.com", owner);
			await setNodeTrusted(web3, rp, registeredNodeTrusted2, "saas_2", "node@home.com", owner);

			// Set max per-minipool stake to 100% and RPL price to 1 ether
			const block = await web3.eth.getBlockNumber();
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNode", "node.per.minipool.stake.maximum", web3.utils.toWei("1", "ether"), {
				from: owner,
				gas: gasLimit,
			});
			await submitPrices(web3, rp, block, web3.utils.toWei("1", "ether"), "0", {
				from: registeredNodeTrusted1,
				gas: gasLimit,
			});
			await submitPrices(web3, rp, block, web3.utils.toWei("1", "ether"), "0", {
				from: registeredNodeTrusted2,
				gas: gasLimit,
			});

			// Mint and stake RPL
			await mintRPL(web3, rp, owner, registeredNode1, web3.utils.toWei("32", "ether"));
			await mintRPL(web3, rp, owner, registeredNode2, web3.utils.toWei("32", "ether"));
			await nodeStakeRPL(web3, rp, web3.utils.toWei("32", "ether"), {
				from: registeredNode1,
				gas: gasLimit,
			});
			await nodeStakeRPL(web3, rp, web3.utils.toWei("32", "ether"), {
				from: registeredNode2,
				gas: gasLimit,
			});

			// User deposits
			await userDeposit(web3, rp, {
				from: userOne,
				value: web3.utils.toWei("48", "ether"),
				gas: gasLimit,
			});

			// Create minipools
			const minipool1 = (await createMinipool(web3, rp, {
				from: registeredNode1,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;
			const minipool2 = (await createMinipool(web3, rp, {
				from: registeredNode2,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;
			const minipool3 = (await createMinipool(web3, rp, {
				from: registeredNode2,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;

			// Stake minipools
			await stakeMinipool(web3, rp, minipool1, null, {
				from: registeredNode1,
				gas: gasLimit,
			});
			await stakeMinipool(web3, rp, minipool2, null, {
				from: registeredNode2,
				gas: gasLimit,
			});
			await stakeMinipool(web3, rp, minipool3, null, {
				from: registeredNode2,
				gas: gasLimit,
			});

			// Check node effective stakes
			const node1EffectiveStake = await getNodeEffectiveRPLStake(web3, rp, registeredNode1).then((value: any) => web3.utils.toBN(value));
			const node2EffectiveStake = await getNodeEffectiveRPLStake(web3, rp, registeredNode2).then((value: any) => web3.utils.toBN(value));
			assert(node1EffectiveStake.eq(web3.utils.toBN(web3.utils.toWei("16", "ether"))), "Incorrect node 1 effective stake");
			assert(node2EffectiveStake.eq(web3.utils.toBN(web3.utils.toWei("32", "ether"))), "Incorrect node 2 effective stake");
		});

		it(printTitle("userOne", "fails to set interval blocks for rewards claim period"), async () => {
			// Set the rewards claims interval in blocks
			await shouldRevert(
				setRewardsClaimIntervalTime(web3, rp, 100, {
					from: userOne,
					gas: gasLimit,
				}),
				"Non owner set interval blocks for rewards claim period",
				"Account is not a temporary guardian"
			);
		});

		it(printTitle("guardian", "succeeds setting interval blocks for rewards claim period"), async () => {
			// Set the rewards claims interval in blocks
			await setRewardsClaimIntervalTime(web3, rp, 100, {
				from: owner,
				gas: gasLimit,
			});
		});

		it(printTitle("userOne", "fails to set contract claimer percentage for rewards"), async () => {
			// Set the amount this contract can claim
			await shouldRevert(
				setDAONetworkBootstrapRewardsClaimer(web3, rp, "myHackerContract", web3.utils.toWei("0.1", "ether"), {
					from: userOne,
					gas: gasLimit,
				}),
				"Non owner set contract claimer percentage for rewards",
				"Account is not a temporary guardian"
			);
		});

		it(printTitle("guardian", "set contract claimer percentage for rewards, then update it"), async () => {
			// Set the amount this contract can claim
			await setDAONetworkBootstrapRewardsClaimer(web3, rp, "rocketClaimDAO", web3.utils.toWei("0.0001", "ether"), {
				from: owner,
				gas: gasLimit,
			});
			// Set the amount this contract can claim, then update it
			await setDAONetworkBootstrapRewardsClaimer(web3, rp, "rocketClaimNode", web3.utils.toWei("0.01", "ether"), {
				from: owner,
				gas: gasLimit,
			});
			// Update now
			await setDAONetworkBootstrapRewardsClaimer(web3, rp, "rocketClaimNode", web3.utils.toWei("0.02", "ether"), {
				from: owner,
				gas: gasLimit,
			});
		});

		it(printTitle("guardian", "set contract claimer percentage for rewards, then update it to zero"), async () => {
			// Get the total current claims amounts
			const totalClaimersPerc = parseFloat(
				web3.utils.fromWei(
					await rewardsClaimersPercTotalGet(web3, rp, {
						from: owner,
						gas: gasLimit,
					})
				)
			);
			// Set the amount this contract can claim, then update it
			await setDAONetworkBootstrapRewardsClaimer(web3, rp, "rocketClaimNode", web3.utils.toWei("0.01", "ether"), {
				from: owner,
				gas: gasLimit,
			});
			// Update now
			await setDAONetworkBootstrapRewardsClaimer(
				web3,
				rp,
				"rocketClaimNode",
				web3.utils.toWei("0", "ether"),
				{
					from: owner,
					gas: gasLimit,
				},
				totalClaimersPerc
			);
		});

		it(printTitle("guardian", "set contract claimers total percentage to 100%"), async () => {
			// Get the total current claims amounts
			const totalClaimersPerc = parseFloat(
				web3.utils.fromWei(
					await rewardsClaimersPercTotalGet(web3, rp, {
						from: owner,
						gas: gasLimit,
					})
				)
			);
			// Get the total % needed to make 100%
			const claimAmount = (1 - totalClaimersPerc).toFixed(4);
			// Set the amount this contract can claim and expect total claimers amount to equal 1 ether (100%)
			await setDAONetworkBootstrapRewardsClaimer(
				web3,
				rp,
				"rocketClaimNode",
				web3.utils.toWei(claimAmount.toString(), "ether"),
				{
					from: owner,
					gas: gasLimit,
				},
				1
			);
		});

		it(printTitle("guardian", "fail to set contract claimers total percentage over 100%"), async () => {
			// Get the total current claims amounts
			const totalClaimersPerc = parseFloat(
				web3.utils.fromWei(
					await rewardsClaimersPercTotalGet(web3, rp, {
						from: owner,
						gas: gasLimit,
					})
				)
			);
			// Get the total % needed to make 100%
			const claimAmount = (1 - totalClaimersPerc + 0.001).toFixed(4);
			// Set the amount this contract can claim and expect total claimers amount to equal 1 ether (100%)
			await shouldRevert(
				setDAONetworkBootstrapRewardsClaimer(web3, rp, "rocketClaimNode", web3.utils.toWei(claimAmount.toString(), "ether"), {
					from: owner,
					gas: gasLimit,
				}),
				"Total claimers percentrage over 100%",
				"Claimers cannot total more than 100%"
			);
		});

		it(printTitle("userOne", "fails to call claim method on rewards pool contract as they are not a registered claimer contract"), async () => {
			// Init rewards pool
			const rocketRewardsPool = await rp.contracts.get("rocketRewardsPool");
			// Try to call the claim method
			await shouldRevert(
				rocketRewardsPool.methods.claim(userOne, userOne, web3.utils.toWei("0.1")).send({
					from: userOne,
					gas: gasLimit,
				}),
				"Non claimer network contract called claim method",
				"Contract not found"
			);
		});

		/*** Regular Nodes **************************/
		it(printTitle("node", "can claim RPL"), async () => {
			// Initialize RPL inflation & claims contract
			const rplInflationStartTime = await rplInflationSetup();
			await rewardsContractSetup("rocketClaimNode", 0.5);

			// Move to inflation start plus one claim interval
			const currentTime = await getCurrentTime(web3);
			assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
			await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);

			// Claim RPL
			await rewardsClaimNode(web3, rp, {
				from: registeredNode1,
				gas: gasLimit,
			});
			await rewardsClaimNode(web3, rp, {
				from: registeredNode2,
				gas: gasLimit,
			});

			// Move to next claim interval
			await increaseTime(web3, claimIntervalTime);

			// Claim RPL again
			await rewardsClaimNode(web3, rp, {
				from: registeredNode1,
				gas: gasLimit,
			});
			await rewardsClaimNode(web3, rp, {
				from: registeredNode2,
				gas: gasLimit,
			});
		});

		it(printTitle("node", "cannot claim RPL before inflation has begun"), async () => {
			// Initialize claims contract
			await rewardsContractSetup("rocketClaimNode", 0.5);

			// Attempt to claim RPL
			await shouldRevert(
				rewardsClaimNode(web3, rp, {
					from: registeredNode1,
					gas: gasLimit,
				}),
				"Node claimed RPL before RPL inflation began",
				"The node is currently unable to claim"
			);
		});

		it(printTitle("node", "cannot claim RPL while the node claim contract is disabled"), async () => {
			// Initialize RPL inflation & claims contract
			const rplInflationStartTime = await rplInflationSetup();
			await rewardsContractSetup("rocketClaimNode", 0.5);

			// Move to inflation start plus one claim interval
			const currentTime = await getCurrentTime(web3);
			assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start block");
			await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);

			// Disable RocketClaimNode claims contract
			await setDAONetworkBootstrapRewardsClaimer(web3, rp, "rocketClaimNode", web3.utils.toWei("0", "ether"), {
				from: owner,
				gas: gasLimit,
			});

			// Attempt to claim RPL
			await shouldRevert(
				rewardsClaimNode(web3, rp, {
					from: registeredNode1,
					gas: gasLimit,
				}),
				"Node claimed RPL while node claim contract was disabled",
				"The node is currently unable to claim"
			);
		});

		it(printTitle("node", "cannot claim RPL twice in the same interval"), async () => {
			// Initialize RPL inflation & claims contract
			const rplInflationStartTime = await rplInflationSetup();
			await rewardsContractSetup("rocketClaimNode", 0.5);

			// Move to inflation start plus one claim interval
			const currentTime = await getCurrentTime(web3);
			assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
			await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);

			// Claim RPL
			await rewardsClaimNode(web3, rp, {
				from: registeredNode1,
				gas: gasLimit,
			});

			// Attempt to claim RPL again
			await shouldRevert(
				rewardsClaimNode(web3, rp, {
					from: registeredNode1,
					gas: gasLimit,
				}),
				"Node claimed RPL twice in the same interval",
				"Claimer is not entitled to tokens, they have already claimed in this interval or they are claiming more rewards than available to this claiming contract."
			);
		});

		it(printTitle("node", "cannot claim RPL while their node is undercollateralized"), async () => {
			// Initialize RPL inflation & claims contract
			const rplInflationStartTime = await rplInflationSetup();
			await rewardsContractSetup("rocketClaimNode", 0.5);

			// Move to inflation start plus one claim interval
			const currentTime = await getCurrentTime(web3);
			assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
			await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);

			// Decrease RPL price to undercollateralize node
			const block = await web3.eth.getBlockNumber();
			const calculatedTotalEffectiveStake = await getCalculatedTotalEffectiveRPLStake(web3, rp, web3.utils.toWei("0.01", "ether"));
			await submitPrices(web3, rp, block, web3.utils.toWei("0.01", "ether"), calculatedTotalEffectiveStake, {
				from: registeredNodeTrusted1,
				gas: gasLimit,
			});
			await submitPrices(web3, rp, block, web3.utils.toWei("0.01", "ether"), calculatedTotalEffectiveStake, {
				from: registeredNodeTrusted2,
				gas: gasLimit,
			});

			// Get & check node's current and minimum RPL stakes
			const [currentRplStake, minimumRplStake] = await Promise.all([
				getNodeRPLStake(web3, rp, registeredNode1).then((value: any) => web3.utils.toBN(value)),
				getNodeMinimumRPLStake(web3, rp, registeredNode1).then((value: any) => web3.utils.toBN(value)),
			]);
			assert(currentRplStake.lt(minimumRplStake), "Node's current RPL stake should be below their minimum RPL stake");

			// Attempt to claim RPL
			await shouldRevert(
				rewardsClaimNode(web3, rp, {
					from: registeredNode1,
					gas: gasLimit,
				}),
				"Node claimed RPL while under collateralized",
				"The node is currently unable to claim"
			);
		});

		/*** Trusted Node **************************/
		it(printTitle("trustedNode1", "fails to call claim before RPL inflation has begun"), async () => {
			// Setup RPL inflation
			const rplInflationStartTime = await rplInflationSetup();
			// Init this claiming contract on the rewards pool
			await rewardsContractSetup("rocketClaimTrustedNode", 0.5);
			// Current time
			const currentTime = await getCurrentTime(web3);
			// Can this trusted node claim before there is any inflation available?
			assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
			// Now make sure we can't claim yet
			await shouldRevert(
				rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
					from: registeredNodeTrusted1,
					gas: gasLimit,
				}),
				"Made claim before RPL inflation started",
				"This trusted node is not able to claim yet and must wait until a full claim interval passes"
			);
		});

		it(printTitle("trustedNode1", "makes a claim, then fails to make another in the same claim interval"), async () => {
			// Setup RPL inflation
			const rplInflationStartTime = await rplInflationSetup();
			// Init this claiming contract on the rewards pool
			await rewardsContractSetup("rocketClaimTrustedNode", 0.1);
			// Current time
			const currentTime = await getCurrentTime(web3);
			// Can this trusted node claim before there is any inflation available?
			assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
			// Move to start of RPL inflation and ahead one claim interval
			await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);
			// Make a claim now
			await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
				from: registeredNodeTrusted1,
				gas: gasLimit,
			});
			// Should fail
			await shouldRevert(
				rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
					from: registeredNodeTrusted1,
					gas: gasLimit,
				}),
				"Made claim again before next interval",
				"Claimer is not entitled to tokens, they have already claimed in this interval or they are claiming more rewards than available to this claiming contract"
			);
		});

		it(printTitle("trustedNode3", "fails to claim rewards as they have not waited one claim interval"), async () => {
			// Setup RPL inflation
			const rplInflationStartTime = await rplInflationSetup();
			// Init this claiming contract on the rewards pool
			await rewardsContractSetup("rocketClaimTrustedNode", 0.15);
			// Current time
			const currentTime = await getCurrentTime(web3);
			// Can this trusted node claim before there is any inflation available?
			assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
			// Move to start of RPL inflation and ahead one claim interval
			await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);
			// Make node 4 trusted now
			await setNodeTrusted(web3, rp, registeredNodeTrusted3, "saas_3", "node@home.com", owner);
			// Make a claim now
			await shouldRevert(
				rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted3, {
					from: registeredNodeTrusted3,
					gas: gasLimit,
				}),
				"Made claim before next interval",
				"This trusted node is not able to claim yet and must wait until a full claim interval passes"
			);
		});

		it(printTitle("trustedNode1", "fails to make a claim when trusted node contract claim perc is set to 0"), async () => {
			// Setup RPL inflation
			const rplInflationStartTime = await rplInflationSetup();
			// Init this claiming contract on the rewards pool
			await rewardsContractSetup("rocketClaimTrustedNode", 0);
			// Current block
			const currentTime = await getCurrentTime(web3);
			// Can this trusted node claim before there is any inflation available?
			assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
			// Move to start of RPL inflation and ahead one claim interval
			await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);
			// Make a claim now
			await shouldRevert(
				rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
					from: registeredNodeTrusted1,
					gas: gasLimit,
				}),
				"Made claim again before next interval",
				"This trusted node is not able to claim yet and must wait until a full claim interval passes"
			);
		});

		it(
			printTitle("trustedNode1+4", "trusted node 1 makes a claim after RPL inflation has begun and newly registered trusted node 4 claim in next interval"),
			async () => {
				// Setup RPL inflation
				const rplInflationStartTime = await rplInflationSetup();
				// Init this claiming contract on the rewards pool
				await rewardsContractSetup("rocketClaimTrustedNode", 0.0123);
				// Current time
				const currentTime = await getCurrentTime(web3);
				// Can this trusted node claim before there is any inflation available?
				assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
				// Move to start of RPL inflation and ahead one claim interval
				await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);
				// Make a claim now
				await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
					from: registeredNodeTrusted1,
					gas: gasLimit,
				});
				// Make node 3 trusted now
				await setNodeTrusted(web3, rp, registeredNodeTrusted3, "saas_3", "node@home.com", owner);
				// Move to next claim interval
				await increaseTime(web3, claimIntervalTime);
				// Attempt claim in the next interval
				await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted3, {
					from: registeredNodeTrusted3,
					gas: gasLimit,
				});
			}
		);

		it(
			printTitle(
				"trustedNode1+2+3",
				"trusted node 1 makes a claim after RPL inflation has begun, claim rate is changed, then trusted node 2 makes a claim and newly registered trusted node 3 claim in next interval"
			),
			async () => {
				// Setup RPL inflation
				const rplInflationStartTime = await rplInflationSetup();
				// Set the contracts perc it can claim 1 =100%
				const claimPercOrig = 0.1;
				// Init this claiming contract on the rewards pool
				await rewardsContractSetup("rocketClaimTrustedNode", claimPercOrig);
				// Current time
				const currentTime = await getCurrentTime(web3);
				// Can this trusted node claim before there is any inflation available?
				assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
				// Move to start of RPL inflation and ahead one claim interval
				await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);
				// Make a claim now
				await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
					from: registeredNodeTrusted1,
					gas: gasLimit,
				});
				// Change inflation rate now, should only kick in on the next interval
				const claimPercChange = 0.2;
				// Update it
				await rewardsContractSetup("rocketClaimTrustedNode", claimPercChange);
				// Make a claim now and pass it the expected contract claim percentage
				await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted2, {
					from: registeredNodeTrusted2,
					gas: gasLimit,
				});
				// Make node 3 trusted now
				await setNodeTrusted(web3, rp, registeredNodeTrusted3, "saas_3", "node@home.com", owner);
				// Move ahead 2 claim intervals
				await increaseTime(web3, claimIntervalTime);
				// Attempt claim in the next interval with new inflation rate
				await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted3, {
					from: registeredNodeTrusted3,
					gas: gasLimit,
				});
			}
		);

		/*** DAO ***************************/
		it(
			printTitle(
				"daoClaim",
				"trusted node makes a claim and the DAO receives its automatic share of rewards correctly on its claim contract, then protocol DAO spends some"
			),
			async () => {
				// Setup RPL inflation
				const rplInflationStartTime = await rplInflationSetup();
				// Init this claiming contract on the rewards pool
				await rewardsContractSetup("rocketClaimTrustedNode", 0.1);
				// Current time
				const currentTime = await getCurrentTime(web3);
				// Can this trusted node claim before there is any inflation available?
				assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
				// Move to start of RPL inflation and ahead a few claim intervals to simulate some being missed
				await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime * 3);
				// Make a claim now from a trusted node and verify the DAO collected it's perc
				await rewardsClaimDAO(web3, rp, {
					from: registeredNodeTrusted1,
					gas: gasLimit,
				});
				// Make a claim now from another trusted node
				await rewardsClaimDAO(web3, rp, {
					from: registeredNodeTrusted2,
					gas: gasLimit,
				});
				// Get the balance of the DAO treasury and spend it
				const daoTreasuryBalance = await getRewardsDAOTreasuryBalance(web3, rp, {
					from: registeredNodeTrusted1,
					gas: gasLimit,
				});
				// Now spend some via the protocol DAO in bootstrap mode
				await spendRewardsClaimTreasury(web3, rp, "invoice123", daoInvoiceRecipient, daoTreasuryBalance, {
					from: owner,
					gas: gasLimit,
				});
			}
		);

		it(
			printTitle(
				"daoClaim",
				"trusted node makes a claim and the DAO receives its automatic share of rewards correctly on its claim contract, then fails to spend more than it has"
			),
			async () => {
				// Setup RPL inflation
				const rplInflationStartTime = await rplInflationSetup();
				// Init this claiming contract on the rewards pool
				await rewardsContractSetup("rocketClaimTrustedNode", 0.1);
				// Current time
				const currentTime = await getCurrentTime(web3);
				// Can this trusted node claim before there is any inflation available?
				assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
				// Move to start of RPL inflation and ahead a few claim intervals to simulate some being missed
				await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime * 3);
				// Make a claim now from another trusted node
				await rewardsClaimDAO(web3, rp, {
					from: registeredNodeTrusted2,
					gas: gasLimit,
				});
				// Get the balance of the DAO treasury and spend it
				const daoTreasuryBalance = await getRewardsDAOTreasuryBalance(web3, rp, {
					from: registeredNodeTrusted2,
					gas: gasLimit,
				});
				// Now spend some via the protocol DAO in bootstrap mode
				await shouldRevert(
					spendRewardsClaimTreasury(web3, rp, "invoice123", daoInvoiceRecipient, daoTreasuryBalance + "1", {
						from: owner,
						gas: gasLimit,
					}),
					"Protocol DAO spent more RPL than it had in its treasury",
					"You cannot send 0 RPL or more than the DAO has in its account"
				);
			}
		);

		it(printTitle("daoClaim", "trusted node make a claim and the DAO claim rate is set to 0, trusted node makes another 2 claims"), async () => {
			// Setup RPL inflation
			const rplInflationStartTime = await rplInflationSetup();
			// Init this claiming contract on the rewards pool
			await rewardsContractSetup("rocketClaimTrustedNode", 0.1);
			// Current time
			const currentTime = await getCurrentTime(web3);
			// Can this trusted node claim before there is any inflation available?
			assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
			// Move to start of RPL inflation and ahead a few claim intervals to simulate some being missed
			await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);
			// Make a claim now from a trusted node and verify the DAO collected it's perc
			await rewardsClaimDAO(web3, rp, {
				from: registeredNodeTrusted1,
				gas: gasLimit,
			});
			// Forward to next interval, set claim amount to 0, should kick in the interval after next
			await rewardsContractSetup("rocketClaimDAO", 0);
			// Make a claim now from another trusted node
			await rewardsClaimDAO(web3, rp, {
				from: registeredNodeTrusted2,
				gas: gasLimit,
			});
			await rewardsContractSetup("rocketClaimTrustedNode", 0.2);
			// Next interval
			await increaseTime(web3, claimIntervalTime);
			// Make another claim, dao shouldn't receive anything
			await rewardsClaimDAO(web3, rp, {
				from: registeredNodeTrusted2,
				gas: gasLimit,
			});
		});

		it(
			printTitle(
				"daoClaim",
				"trusted nodes make multiples claims, rewards sent to dao claims contract, DAO rewards address is set and next claims send its balance to its rewards address"
			),
			async () => {
				// Setup RPL inflation
				const rplInflationStartTime = await rplInflationSetup();
				// Init this claiming contract on the rewards pool
				await rewardsContractSetup("rocketClaimTrustedNode", 0.1);
				// Current time
				const currentTime = await getCurrentTime(web3);
				// Can this trusted node claim before there is any inflation available?
				assert.isBelow(currentTime, rplInflationStartTime, "Current block should be below RPL inflation start time");
				// Move to start of RPL inflation and ahead a few claim intervals to simulate some being missed
				await increaseTime(web3, rplInflationStartTime - currentTime + claimIntervalTime);
				// Make a claim now from a trusted node and verify the DAO collected it's perc
				await rewardsClaimDAO(web3, rp, {
					from: registeredNodeTrusted1,
					gas: gasLimit,
				});
				await rewardsClaimDAO(web3, rp, {
					from: registeredNodeTrusted2,
					gas: gasLimit,
				});
				// Next interval
				await increaseTime(web3, claimIntervalTime);
				// Node claim again
				await rewardsClaimDAO(web3, rp, {
					from: registeredNodeTrusted1,
					gas: gasLimit,
				});
				// Node claim again
				await rewardsClaimDAO(web3, rp, {
					from: registeredNodeTrusted2,
					gas: gasLimit,
				});
			}
		);
	});
}
