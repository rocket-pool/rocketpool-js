// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { takeSnapshot, revertSnapshot, mineBlocks, increaseTime } from "../_utils/evm";
import { createMinipool, getMinipoolMinimumRPLStake, getNodeActiveMinipoolCount, stakeMinipool, submitMinipoolWithdrawable } from "../_helpers/minipool";
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
import { getNodeFee } from "../_helpers/network";
import { setDaoNodeTrustedBootstrapUpgrade } from "../dao/scenario-dao-node-trusted-bootstrap";

// Tests
export default function runMinipoolTests(web3: Web3, rp: RocketPool) {
	describe("Minipool", () => {
		// settings
		const gasLimit = 8000000;

		// Accounts
		let owner: string;
		let node: string;
		let nodeWithdrawalAddress: string;
		let trustedNode: string;
		let dummySwc: string;
		let random: string;

		// Minipool validator keys
		const stakingMinipoolPubkey = getValidatorPubkey();
		const withdrawableMinipoolPubkey = getValidatorPubkey();

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
		const launchTimeout = 20;
		const withdrawalDelay = 20;
		let initializedMinipool: MinipoolContract;
		let prelaunchMinipool: MinipoolContract;
		let prelaunchMinipool2: MinipoolContract;
		let stakingMinipool: MinipoolContract;
		let withdrawableMinipool: MinipoolContract;
		let dissolvedMinipool: MinipoolContract;
		const withdrawalBalance = web3.utils.toWei("36", "ether");
		let newDelegateAddress = "0x0000000000000000000000000000000000000001";

		before(async () => {
			// Get accounts
			[owner, node, nodeWithdrawalAddress, trustedNode, dummySwc, random] = await web3.eth.getAccounts();

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

			// Set rETH collateralisation target to a value high enough it won't cause excess ETH to be funneled back into deposit pool and mess with our calcs
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.reth.collateral.target", web3.utils.toWei("50", "ether"), {
				from: owner,
				gas: gasLimit,
			});

			// Make user deposit to refund first prelaunch minipool
			const refundAmount = web3.utils.toWei("16", "ether");
			await userDeposit(web3, rp, {
				from: random,
				value: refundAmount,
				gas: gasLimit,
			});

			// Stake RPL to cover minipools
			const minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
			const rplStake = minipoolRplStake.mul(web3.utils.toBN(7));
			await mintRPL(web3, rp, owner, node, rplStake);
			await nodeStakeRPL(web3, rp, rplStake, { from: node, gas: gasLimit });

			// Create minipools
			prelaunchMinipool = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("32", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;
			prelaunchMinipool2 = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("32", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;
			stakingMinipool = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("32", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;
			withdrawableMinipool = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("32", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;
			initializedMinipool = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;
			dissolvedMinipool = (await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("16", "ether"),
				gas: gasLimit,
			})) as MinipoolContract;

			// Stake minipools
			await stakeMinipool(web3, rp, stakingMinipool, stakingMinipoolPubkey, {
				from: node,
				gas: gasLimit,
			});
			await stakeMinipool(web3, rp, withdrawableMinipool, withdrawableMinipoolPubkey, { from: node, gas: gasLimit });

			// Set minipool to withdrawable
			await rp.minipool.submitMinipoolWithdrawable(withdrawableMinipool.address, { from: trustedNode, gas: gasLimit });

			// Dissolve minipool
			await dissolvedMinipool.dissolve({ from: node, gas: gasLimit });

			// Check minipool statuses
			const initializedStatus = await initializedMinipool.contract.methods
				.getStatus()
				.call()
				.then((value: any) => web3.utils.toBN(value));
			const prelaunchStatus = await prelaunchMinipool.contract.methods
				.getStatus()
				.call()
				.then((value: any) => web3.utils.toBN(value));
			const prelaunch2Status = await prelaunchMinipool2.contract.methods
				.getStatus()
				.call()
				.then((value: any) => web3.utils.toBN(value));
			const stakingStatus = await stakingMinipool.contract.methods
				.getStatus()
				.call()
				.then((value: any) => web3.utils.toBN(value));
			const withdrawableStatus = await withdrawableMinipool.contract.methods
				.getStatus()
				.call()
				.then((value: any) => web3.utils.toBN(value));
			const dissolvedStatus = await dissolvedMinipool.contract.methods
				.getStatus()
				.call()
				.then((value: any) => web3.utils.toBN(value));
			assert(initializedStatus.eq(web3.utils.toBN(0)), "Incorrect initialized minipool status");
			assert(prelaunchStatus.eq(web3.utils.toBN(1)), "Incorrect prelaunch minipool status");
			assert(prelaunch2Status.eq(web3.utils.toBN(1)), "Incorrect prelaunch minipool status");
			assert(stakingStatus.eq(web3.utils.toBN(2)), "Incorrect staking minipool status");
			assert(withdrawableStatus.eq(web3.utils.toBN(3)), "Incorrect withdrawable minipool status");
			assert(dissolvedStatus.eq(web3.utils.toBN(4)), "Incorrect dissolved minipool status");

			// Check minipool refund balances
			const prelaunchRefundBalance = await prelaunchMinipool.contract.methods
				.getNodeRefundBalance()
				.call()
				.then((value: any) => web3.utils.toBN(value));
			const prelaunch2RefundBalance = await prelaunchMinipool2.contract.methods
				.getNodeRefundBalance()
				.call()
				.then((value: any) => web3.utils.toBN(value));
			assert(prelaunchRefundBalance.eq(web3.utils.toBN(refundAmount)), "Incorrect prelaunch minipool refund balance");
			assert(prelaunch2RefundBalance.eq(web3.utils.toBN(0)), "Incorrect prelaunch minipool refund balance");

			// Check minipool queues
			const rocketMinipoolQueue = await rp.contracts.get("rocketMinipoolQueue");
			const [totalLength, fullLength, halfLength, emptyLength] = await Promise.all([
				rocketMinipoolQueue.methods
					.getTotalLength()
					.call()
					.then((value: any) => web3.utils.toBN(value)), // Total
				rocketMinipoolQueue.methods
					.getLength(1)
					.call()
					.then((value: any) => web3.utils.toBN(value)), // Full
				rocketMinipoolQueue.methods
					.getLength(2)
					.call()
					.then((value: any) => web3.utils.toBN(value)), // Half
				rocketMinipoolQueue.methods
					.getLength(3)
					.call()
					.then((value: any) => web3.utils.toBN(value)), // Empty
			]);

			// Total should match sum
			assert(totalLength.eq(fullLength.add(halfLength).add(emptyLength)));
			assert(fullLength.toNumber() === 2, "Incorrect number of minipools in full queue");
			assert(halfLength.toNumber() === 1, "Incorrect number of minipools in half queue");
			assert(emptyLength.toNumber() === 0, "Incorrect number of minipools in empty queue");
		});

		async function upgradeNetworkDelegateContract() {
			// Upgrade the delegate contract
			await setDaoNodeTrustedBootstrapUpgrade(web3, rp, "upgradeContract", "rocketMinipoolDelegate", [], newDelegateAddress, {
				from: owner,
				gas: gasLimit,
			});

			// Check effective delegate is still the original
			const minipoolABI = await rp.contracts.abi("rocketMinipool");
			const minipool = new web3.eth.Contract(minipoolABI, stakingMinipool.address);
			const effectiveDelegate = await minipool.methods.getEffectiveDelegate().call();
			assert(effectiveDelegate !== newDelegateAddress, "Effective delegate was updated");
		}

		//
		// General
		//
		it(printTitle("random address", "cannot send ETH to non-payable minipool delegate methods"), async () => {
			// Attempt to send ETH to view method
			await shouldRevert(
				prelaunchMinipool.contract.methods.getStatus().send({
					from: random,
					value: web3.utils.toWei("1", "ether"),
					gas: gasLimit,
				}),
				"Sent ETH to a non-payable minipool delegate view method",
				"Transaction reverted silently"
			);

			// Attempt to send ETH to mutator method
			await shouldRevert(
				refund(web3, rp, prelaunchMinipool, {
					from: node,
					value: web3.utils.toWei("1", "ether"),
					gas: gasLimit,
				}),
				"Sent ETH to a non-payable minipool delegate mutator method",
				"Transaction reverted silently"
			);
		});

		it(printTitle("minipool", "has correct withdrawal credentials"), async () => {
			// Withdrawal credentials settings
			const withdrawalPrefix = "01";
			const padding = "0000000000000000000000";

			// Get minipool withdrawal credentials
			const withdrawalCredentials = await initializedMinipool.contract.methods.getWithdrawalCredentials().call();

			// Check withdrawal credentials
			const expectedWithdrawalCredentials = "0x" + withdrawalPrefix + padding + initializedMinipool.address.substr(2);
			assert.equal(withdrawalCredentials.toLowerCase(), expectedWithdrawalCredentials.toLowerCase(), "Invalid minipool withdrawal credentials");
		});

		it(printTitle("node operator", "cannot create a minipool if network capacity is reached and destroying a minipool reduces the capacity"), async () => {
			// Retrieve the current number of minipools
			const minipoolCount = await rp.minipool.getMinipoolCount();
			// Set max to the current number
			await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsMinipool", "minipool.maximum.count", minipoolCount, {
				from: owner,
				gas: gasLimit,
			});
			// Creating minipool should fail now
			await shouldRevert(
				createMinipool(web3, rp, {
					from: node,
					value: web3.utils.toWei("32", "ether"),
					gas: gasLimit,
				}),
				"Was able to create a minipool when capacity is reached",
				"Global minipool limit reached"
			);
			// Destroy a pool
			await withdrawValidatorBalance(web3, rp, withdrawableMinipool, withdrawalBalance, nodeWithdrawalAddress, true);
			// Creating minipool should no longer fail
			await createMinipool(web3, rp, {
				from: node,
				value: web3.utils.toWei("32", "ether"),
				gas: gasLimit,
			});
		});

		it(printTitle("node operator", "cannot create a minipool if delegate address is set to a non-contract"), async () => {
			// Upgrade network delegate contract to random address
			await upgradeNetworkDelegateContract();
			// Creating minipool should fail now
			await shouldRevert(
				createMinipool(web3, rp, { from: node, value: web3.utils.toWei("32", "ether"), gas: gasLimit }),
				"Was able to create a minipool with bad delegate address",
				"Delegate contract does not exist"
			);
		});

		it(printTitle("node operator", "cannot delegatecall to a delgate address that is a non-contract"), async () => {
			// Creating minipool should fail now
			const newMinipool = (await createMinipool(web3, rp, { from: node, value: web3.utils.toWei("32", "ether"), gas: gasLimit })) as MinipoolContract;
			const minipoolABI = await rp.contracts.abi("rocketMinipool");
			const newMinipoolBase = new web3.eth.Contract(minipoolABI, newMinipool.address);
			// Upgrade network delegate contract to random address
			await upgradeNetworkDelegateContract();
			// Call upgrade delegate
			await newMinipoolBase.methods.setUseLatestDelegate(true).send({ from: node, gas: gasLimit });
			// Staking should fail now
			await shouldRevert(
				stakeMinipool(web3, rp, newMinipool, null, { from: node, gas: gasLimit }),
				"Was able to create a minipool with bad delegate address",
				"Delegate contract does not exist"
			);
		});

		//
		// Refund
		//
		it(printTitle("node operator", "can refund a refinanced node deposit balance"), async () => {
			// Refund from minipool with refund balance
			await refund(web3, rp, prelaunchMinipool, {
				from: node,
				gas: gasLimit,
			});
		});

		it(printTitle("node operator", "cannot refund with no refinanced node deposit balance"), async () => {
			// Refund
			await refund(web3, rp, prelaunchMinipool, {
				from: node,
				gas: gasLimit,
			});

			// Attempt refund from minipools with no refund balance
			await shouldRevert(
				refund(web3, rp, prelaunchMinipool, {
					from: node,
					gas: gasLimit,
				}),
				"Refunded from a minipool which was already refunded from",
				"No amount of the node deposit is available for refund"
			);

			await shouldRevert(
				refund(web3, rp, prelaunchMinipool2, {
					from: node,
					gas: gasLimit,
				}),
				"Refunded from a minipool with no refund balance",
				"No amount of the node deposit is available for refund"
			);
		});

		it(printTitle("random address", "cannot refund a refinanced node deposit balance"), async () => {
			// Attempt refund from minipool with refund balance
			await shouldRevert(
				refund(web3, rp, prelaunchMinipool, {
					from: random,
					gas: gasLimit,
				}),
				"Random address refunded from a minipool",
				"Invalid minipool owner"
			);
		});

		//
		// Finalise
		//
		it(printTitle("node operator", "can finalise a withdrawn minipool"), async () => {
			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Withdraw without finalising
			await withdrawValidatorBalance(web3, rp, withdrawableMinipool, withdrawalBalance, random, false);
			// Get number of active minipools before
			const count1 = await getNodeActiveMinipoolCount(web3, rp, node).then((value: any) => web3.utils.toBN(value));
			// Finalise
			await withdrawableMinipool.finalise({
				from: nodeWithdrawalAddress,
				gas: gasLimit,
			});
			// Get number of active minipools after
			const count2 = await getNodeActiveMinipoolCount(web3, rp, node).then((value: any) => web3.utils.toBN(value));
			// Make sure active minipool count reduced by one
			assert(count1.sub(count2).eq(web3.utils.toBN(1)), "Active minipools did not decrement by 1");
		});

		it(printTitle("node operator", "cannot finalise a withdrawn minipool twice"), async () => {
			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Withdraw without finalising
			await withdrawValidatorBalance(web3, rp, withdrawableMinipool, withdrawalBalance, random, false);
			// Finalise
			await withdrawableMinipool.finalise({
				from: nodeWithdrawalAddress,
				gas: gasLimit,
			});
			// Second time should fail
			await shouldRevert(
				withdrawableMinipool.finalise({
					from: nodeWithdrawalAddress,
					gas: gasLimit,
				}),
				"Was able to finalise pool twice",
				"Minipool has already been finalised"
			);
		});

		it(printTitle("node operator", "cannot finalise a non-withdrawn minipool"), async () => {
			// Finalise
			await shouldRevert(
				withdrawableMinipool.finalise({
					from: nodeWithdrawalAddress,
					gas: gasLimit,
				}),
				"Minipool was finalised before withdrawn",
				"Minipool balance must have been distributed at least once"
			);
		});

		it(printTitle("random address", "cannot finalise a withdrawn minipool"), async () => {
			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Withdraw without finalising
			await withdrawValidatorBalance(web3, rp, withdrawableMinipool, withdrawalBalance, random, false);
			// Finalise
			await shouldRevert(withdrawableMinipool.finalise({ from: random, gas: gasLimit }), "Minipool was finalised by random", "Invalid minipool owner");
		});

		//
		// Slash
		//
		it(printTitle("random address", "can slash node operator if withdrawal balance is less than 16 ETH"), async () => {
			// Stake the prelaunch minipool (it has 16 ETH user funds)
			await stakeMinipool(web3, rp, prelaunchMinipool, null, {
				from: node,
				gas: gasLimit,
			});
			// Mark it as withdrawable
			await submitMinipoolWithdrawable(web3, rp, prelaunchMinipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});
			// Post an 8 ETH balance which should result in 8 ETH worth of RPL slashing
			await withdrawValidatorBalance(web3, rp, prelaunchMinipool, web3.utils.toWei("8", "ether"), nodeWithdrawalAddress, false);
			// Call slash method
			await prelaunchMinipool.slash({ from: random, gas: gasLimit });

			// Auction house should now have slashed 8 ETH worth of RPL (which is 800 RPL at starting price)
			const rocketVault = await rp.contracts.get("rocketVault");
			const rocketTokenRPL = await rp.contracts.get("rocketTokenRPL");
			const balance = await rocketVault.methods
				.balanceOfToken("rocketAuctionManager", rocketTokenRPL.options.address)
				.call()
				.then((value: any) => web3.utils.toBN(value));
			assert(balance.eq(web3.utils.toBN(web3.utils.toWei("800", "ether"))));
		});

		it(printTitle("node operator", "is slashed if withdraw is processed when balance is less than 16 ETH"), async () => {
			// Stake the prelaunch minipool (it has 16 ETH user funds)
			await stakeMinipool(web3, rp, prelaunchMinipool, null, {
				from: node,
				gas: gasLimit,
			});
			// Mark it as withdrawable
			await submitMinipoolWithdrawable(web3, rp, prelaunchMinipool.address, {
				from: trustedNode,
				gas: gasLimit,
			});
			// Post an 8 ETH balance which should result in 8 ETH worth of RPL slashing
			await withdrawValidatorBalance(web3, rp, prelaunchMinipool, web3.utils.toWei("8", "ether"), nodeWithdrawalAddress, true);

			// Auction house should now have slashed 8 ETH worth of RPL (which is 800 RPL at starting price)
			const rocketVault = await rp.contracts.get("rocketVault");
			const rocketTokenRPL = await rp.contracts.get("rocketTokenRPL");
			const balance = await rocketVault.methods
				.balanceOfToken("rocketAuctionManager", rocketTokenRPL.options.address)
				.call()
				.then((value: any) => web3.utils.toBN(value));
			assert(balance.eq(web3.utils.toBN(web3.utils.toWei("800", "ether"))));
		});

		//
		// Dissolve
		//
		it(printTitle("node operator", "can dissolve their own minipools"), async () => {
			// Dissolve minipools
			await dissolve(web3, rp, initializedMinipool, {
				from: node,
				gas: gasLimit,
			});
			await dissolve(web3, rp, prelaunchMinipool, {
				from: node,
				gas: gasLimit,
			});
		});

		it(printTitle("node operator", "cannot dissolve their own staking minipools"), async () => {
			// Attempt to dissolve staking minipool
			await shouldRevert(
				dissolve(web3, rp, stakingMinipool, {
					from: node,
					gas: gasLimit,
				}),
				"Dissolved a staking minipool",
				"The minipool can only be dissolved while initialised or in prelaunch"
			);
		});

		it(printTitle("random address", "can dissolve a timed out minipool at prelaunch"), async () => {
			// Time prelaunch minipool out
			await mineBlocks(web3, launchTimeout);

			// Dissolve prelaunch minipool
			await dissolve(web3, rp, prelaunchMinipool, {
				from: random,
				gas: gasLimit,
			});
		});

		it(printTitle("random address", "cannot dissolve a minipool which is not at prelaunch"), async () => {
			// Time prelaunch minipool out
			await mineBlocks(web3, launchTimeout);

			// Attempt to dissolve initialized minipool
			await shouldRevert(
				dissolve(web3, rp, initializedMinipool, {
					from: random,
					gas: gasLimit,
				}),
				"Random address dissolved a minipool which was not at prelaunch",
				"The minipool can only be dissolved by its owner unless it has timed out"
			);
		});

		it(printTitle("random address", "cannot dissolve a minipool which has not timed out"), async () => {
			// Attempt to dissolve prelaunch minipool
			await shouldRevert(
				dissolve(web3, rp, prelaunchMinipool, {
					from: random,
				}),
				"Random address dissolved a minipool which has not timed out",
				"The minipool can only be dissolved by its owner unless it has timed out"
			);
		});

		//
		// Stake
		//
		it(printTitle("node operator", "can stake a minipool at prelaunch"), async () => {
			// Stake prelaunch minipool
			await stake(web3, rp, prelaunchMinipool, getValidatorPubkey(), "", {
				from: node,
				gas: gasLimit,
			});
		});

		it(printTitle("node operator", "cannot stake a minipool which is not at prelaunch"), async () => {
			// Attempt to stake initialized minipool
			await shouldRevert(
				stake(web3, rp, initializedMinipool, getValidatorPubkey(), "", {
					from: node,
					gas: gasLimit,
				}),
				"Staked a minipool which was not at prelaunch",
				"The minipool can only begin staking while in prelaunch"
			);
		});

		it(printTitle("node operator", "cannot stake a minipool with a reused validator pubkey"), async () => {
			// Get pubkey
			const pubkey = getValidatorPubkey();

			// Stake prelaunch minipool
			await stake(web3, rp, prelaunchMinipool, pubkey, "", {
				from: node,
				gas: gasLimit,
			});

			// Attempt to stake second prelaunch minipool with same pubkey
			await shouldRevert(
				stake(web3, rp, prelaunchMinipool2, pubkey, "", {
					from: node,
					gas: gasLimit,
				}),
				"Staked a minipool with a reused validator pubkey",
				"Validator pubkey is already in use"
			);
		});

		it(printTitle("node operator", "cannot stake a minipool with incorrect withdrawal credentials"), async () => {
			// Get withdrawal credentials
			const invalidWithdrawalCredentials = "0x1111111111111111111111111111111111111111111111111111111111111111";

			// Attempt to stake prelaunch minipool
			await shouldRevert(
				stake(web3, rp, prelaunchMinipool, getValidatorPubkey(), invalidWithdrawalCredentials, {
					from: node,
					gas: gasLimit,
				}),
				"Staked a minipool with incorrect withdrawal credentials",
				"Transaction reverted silently"
			);
		});

		it(printTitle("random address", "cannot stake a minipool"), async () => {
			// Attempt to stake prelaunch minipool
			await shouldRevert(
				stake(web3, rp, prelaunchMinipool, getValidatorPubkey(), "", {
					from: random,
					gas: gasLimit,
				}),
				"Random address staked a minipool",
				"Invalid minipool owner"
			);
		});

		//
		// Withdraw validator balance
		//
		it(printTitle("random", "random address cannot withdraw and destroy a node operators minipool balance"), async () => {
			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Attempt to send validator balance
			await shouldRevert(
				withdrawValidatorBalance(web3, rp, withdrawableMinipool, withdrawalBalance, random, true),
				"Random address withdrew validator balance from a node operators minipool",
				"Invalid minipool owner"
			);
		});

		it(printTitle("random", "random address can trigger a payout of withdrawal balance if balance is greater than 16 ETH"), async () => {
			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Attempt to send validator balance
			await withdrawValidatorBalance(web3, rp, withdrawableMinipool, withdrawalBalance, random, false);
		});

		it(printTitle("random", "random address cannot trigger a payout of withdrawal balance if balance is less than 16 ETH"), async () => {
			// Attempt to send validator balance
			await shouldRevert(
				withdrawValidatorBalance(web3, rp, withdrawableMinipool, web3.utils.toWei("15", "ether"), random, false),
				"Random address was able to execute withdraw on sub 16 ETH minipool",
				"Non-owner must wait 14 days after withdrawal to distribute balance"
			);
		});

		it(
			printTitle(
				"node operator withdrawal address",
				"can withdraw their ETH once it is received, then distribute ETH to the rETH contract / deposit pool and destroy the minipool"
			),
			async () => {
				// Send validator balance and withdraw
				await withdrawValidatorBalance(web3, rp, withdrawableMinipool, withdrawalBalance, nodeWithdrawalAddress, true);
			}
		);

		it(
			printTitle(
				"node operator account",
				"can also withdraw their ETH once it is received, then distribute ETH to the rETH contract / deposit pool and destroy the minipool"
			),
			async () => {
				// Send validator balance and withdraw
				await withdrawValidatorBalance(web3, rp, withdrawableMinipool, withdrawalBalance, node, true);
			}
		);

		it(printTitle("malicious node operator", "can not prevent a payout by using a reverting contract as withdraw address"), async () => {
			// Set the node's withdraw address to a reverting contract
			const revertOnTransfer = require("../../contracts/RevertOnTransfer.json");
			const networkId = await web3.eth.net.getId();
			await setNodeWithdrawalAddress(web3, rp, node, revertOnTransfer.networks[networkId].address, {
				from: nodeWithdrawalAddress,
				gas: gasLimit,
			});
			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Send validator balance and withdraw and should not revert
			await withdrawValidatorBalance(web3, rp, withdrawableMinipool, withdrawalBalance, random, false);
		});

		it(printTitle("random address", "can send validator balance to a withdrawable minipool in one transaction"), async () => {
			await web3.eth.sendTransaction({
				from: random,
				to: withdrawableMinipool.address,
				value: withdrawalBalance,
				gas: gasLimit,
			});

			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Process validator balance
			await withdrawValidatorBalance(web3, rp, withdrawableMinipool, "0", random, false);
		});

		it(printTitle("random address", "can send validator balance to a withdrawable minipool across multiple transactions"), async () => {
			// Get tx amount (half of withdrawal balance)
			const amount1 = web3.utils.toBN(withdrawalBalance).div(web3.utils.toBN(2));
			const amount2 = web3.utils.toBN(withdrawalBalance).sub(amount1);

			await web3.eth.sendTransaction({
				from: random,
				to: withdrawableMinipool.address,
				value: amount1,
				gas: gasLimit,
			});

			await web3.eth.sendTransaction({
				from: owner,
				to: withdrawableMinipool.address,
				value: amount2,
				gas: gasLimit,
			});

			// Wait 14 days
			await increaseTime(web3, 60 * 60 * 24 * 14 + 1);
			// Process payout
			await withdrawValidatorBalance(web3, rp, withdrawableMinipool, "0", random, false);
		});

		//
		// Close
		//
		it(printTitle("node operator", "can close a dissolved minipool"), async () => {
			// Close dissolved minipool
			await close(web3, rp, dissolvedMinipool, {
				from: node,
				gas: gasLimit,
			});
		});

		it(printTitle("node operator", "cannot close a minipool which is not dissolved"), async () => {
			// Attempt to close staking minipool
			await shouldRevert(
				close(web3, rp, stakingMinipool, {
					from: node,
					gas: gasLimit,
				}),
				"Closed a minipool which was not dissolved",
				"The minipool can only be closed while dissolved"
			);
		});

		it(printTitle("random address", "cannot close a dissolved minipool"), async () => {
			// Attempt to close dissolved minipool
			await shouldRevert(
				close(web3, rp, dissolvedMinipool, {
					from: random,
					gas: gasLimit,
				}),
				"Random address closed a minipool",
				"Invalid minipool owner"
			);
		});

		//
		// Unbonded minipools
		//
		it(printTitle("trusted node", "cannot create an unbonded minipool if node fee is < 80% of maximum"), async () => {
			// Sanity check that current node fee is less than 80% of maximum
			const nodeFee = await getNodeFee(web3, rp).then((value: any) => web3.utils.toBN(value));
			const maximumNodeFee = await getNetworkSetting(rp, "MaximumNodeFee").then((value: any) => web3.utils.toBN(value));
			assert(nodeFee.lt(maximumNodeFee.muln(0.8)), "Node fee is greater than 80% of maximum fee");

			// Stake RPL to cover minipool
			const minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
			const rplStake = minipoolRplStake.mul(web3.utils.toBN(6));
			await mintRPL(web3, rp, owner, trustedNode, rplStake);
			await nodeStakeRPL(web3, rp, rplStake, {
				from: trustedNode,
				gas: gasLimit,
			});

			// Creating an unbonded minipool should revert
			await shouldRevert(
				createMinipool(web3, rp, {
					from: trustedNode,
					value: "0",
					gas: gasLimit,
				}),
				"Trusted node was able to create unbonded minipool with fee < 80% of max",
				"Current commission rate is not high enough to create unbonded minipools"
			);
		});

		it(printTitle("trusted node", "can create an unbonded minipool if node fee is > 80% of maximum"), async () => {
			// Deposit enough unassigned ETH to increase the fee above 80% of max
			await userDeposit(web3, rp, {
				from: random,
				value: web3.utils.toWei("900", "ether"),
				gas: gasLimit,
			});

			// Sanity check that current node fee is greater than 80% of maximum
			const nodeFee = await getNodeFee(web3, rp).then((value: any) => web3.utils.toBN(value));
			const maximumNodeFee = await getNetworkSetting(rp, "MaximumNodeFee").then((value: any) => web3.utils.toBN(value));
			assert(nodeFee.gt(maximumNodeFee.muln(0.8)), "Node fee is not greater than 80% of maximum fee");

			// Stake RPL to cover minipool
			const minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
			const rplStake = minipoolRplStake.mul(web3.utils.toBN(6));
			await mintRPL(web3, rp, owner, trustedNode, rplStake);
			await nodeStakeRPL(web3, rp, rplStake, {
				from: trustedNode,
				gas: gasLimit,
			});

			// Creating the unbonded minipool
			await createMinipool(web3, rp, {
				from: trustedNode,
				value: "0",
				gas: gasLimit,
			});
		});

		//
		// Delegate upgrades
		//
		it(printTitle("node operator", "can upgrade and rollback their delegate contract"), async () => {
			await upgradeNetworkDelegateContract();
			// Get contract
			const minipoolABI = await rp.contracts.abi("rocketMinipool");
			const minipool = new web3.eth.Contract(minipoolABI, stakingMinipool.address);
			// Store original delegate
			const originalDelegate = await minipool.methods.getEffectiveDelegate().call();
			// Call upgrade delegate
			await minipool.methods.delegateUpgrade().send({ from: node, gas: gasLimit });
			// Check delegate settings
			let effectiveDelegate = await minipool.methods.getEffectiveDelegate().call();
			const previousDelegate = await minipool.methods.getPreviousDelegate().call();
			assert(effectiveDelegate === newDelegateAddress, "Effective delegate was not updated");
			assert(previousDelegate === originalDelegate, "Previous delegate was not updated");
			// Call upgrade rollback
			await minipool.methods.delegateRollback().send({ from: node });
			// Check effective delegate
			effectiveDelegate = await minipool.methods.getEffectiveDelegate().call();
			assert(effectiveDelegate === originalDelegate, "Effective delegate was not rolled back");
		});

		it(printTitle("node operator", "can use latest delegate contract"), async () => {
			await upgradeNetworkDelegateContract();
			// Get contract
			const minipoolABI = await rp.contracts.abi("rocketMinipool");
			const minipool = new web3.eth.Contract(minipoolABI, stakingMinipool.address);
			// Store original delegate
			const originalDelegate = await minipool.methods.getEffectiveDelegate().call();
			// Call upgrade delegate
			await minipool.methods.setUseLatestDelegate(true).send({ from: node, gas: gasLimit });
			const useLatest = await minipool.methods.getUseLatestDelegate().call();
			assert(useLatest, "Use latest flag was not set");
			// Check delegate settings
			let effectiveDelegate = await minipool.methods.getEffectiveDelegate().call();
			const currentDelegate = await minipool.methods.getDelegate().call();
			assert(effectiveDelegate === newDelegateAddress, "Effective delegate was not updated");
			assert(currentDelegate === originalDelegate, "Current delegate was updated");
			// Upgrade the delegate contract again
			newDelegateAddress = "0x0000000000000000000000000000000000000002";
			await setDaoNodeTrustedBootstrapUpgrade(web3, rp, "upgradeContract", "rocketMinipoolDelegate", [], newDelegateAddress, {
				from: owner,
				gas: gasLimit,
			});
			// Check effective delegate
			effectiveDelegate = await minipool.methods.getEffectiveDelegate().call();
			assert(effectiveDelegate === newDelegateAddress, "Effective delegate was not updated");
		});

		it(printTitle("random", "cannot upgrade, rollback or set use latest delegate contract"), async () => {
			await upgradeNetworkDelegateContract();
			// Get contract
			const minipoolABI = await rp.contracts.abi("rocketMinipool");
			const minipool = new web3.eth.Contract(minipoolABI, stakingMinipool.address);
			// Call upgrade delegate from random
			await shouldRevert(
				minipool.methods.delegateUpgrade().send({ from: random, gas: gasLimit }),
				"Random was able to upgrade delegate",
				"Only the node operator can access this method"
			);
			// Call upgrade delegate from node
			await minipool.methods.delegateUpgrade().send({ from: node, gas: gasLimit });
			// Call upgrade rollback from random
			await shouldRevert(
				minipool.methods.delegateRollback().send({ from: random, gas: gasLimit }),
				"Random was able to rollback delegate",
				"Only the node operator can access this method"
			);
			// Call set use latest from random
			await shouldRevert(
				minipool.methods.setUseLatestDelegate(true).send({ from: random, gas: gasLimit }),
				"Random was able to set use latest delegate",
				"Only the node operator can access this method"
			);
		});
	});
}
