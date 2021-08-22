// Imports
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { takeSnapshot, revertSnapshot, getCurrentTime, mineBlocks } from "../_utils/evm";
import { createMinipool, getNodeStakingMinipoolCount, stakeMinipool, submitMinipoolWithdrawable } from "../_helpers/minipool";
import { approveRPL, mintRPL } from "../_helpers/tokens";
import { printTitle } from "../_utils/formatting";
import { shouldRevert } from "../_utils/testing";
import {
  setDAONetworkBootstrapRewardsClaimer,
  setDAOProtocolBootstrapSetting,
  setRewardsClaimIntervalTime,
  setRPLInflationIntervalRate,
  setRPLInflationStartTime,
} from "../dao/scenario-dao-protocol-bootstrap";
import { assert } from "chai";
import { Contract } from "web3-eth-contract";
import { setDAONodeTrustedBootstrapSetting } from "../dao/scenario-dao-node-trusted-bootstrap";
import {
  getCalculatedTotalEffectiveRPLStake,
  getNodeEffectiveRPLStake,
  getNodeRPLStake,
  getTotalEffectiveRPLStake,
  nodeDeposit,
  nodeStakeRPL,
  nodeWithdrawRPL,
  setNodeTrusted,
  setNodeWithdrawalAddress,
} from "../_helpers/node";
import { getRPLPrice, submitPrices } from "../_helpers/network";
import BN from "bn.js";
import { userDeposit } from "../_helpers/deposit";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { dissolve } from "../minipool/scenario-dissolve";
import { close } from "../minipool/scenario-close";

// Tests
export default function runNetworkStakingTests(web3: Web3, rp: RocketPool) {
  describe("Network Staking", () => {
    // settings
    const gasLimit: number = 8000000;

    // One day in seconds
    const ONE_DAY = 24 * 60 * 60;
    const maxStakePerMinipool = "1.5";

    // Accounts
    let owner: string;
    let userOne: string;
    let registeredNode1: string;
    let registeredNode2: string;
    let registeredNode3: string;
    let registeredNodeTrusted1: string;
    let registeredNodeTrusted2: string;
    let registeredNodeTrusted3: string;
    let node1WithdrawalAddress: string;
    let trustedNode: string;
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
    const claimIntervalTime = ONE_DAY * 28;

    // Set some RPL inflation scenes
    let rplInflationSetup = async function () {
      // Current time
      let currentTime = await getCurrentTime(web3);
      // Starting block for when inflation will begin
      let timeStart = currentTime + ONE_DAY;
      // Yearly inflation target
      let yearlyInflationTarget = 0.05;

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

      // Return the starting time for inflation when it will be available
      return timeStart + ONE_DAY;
    };

    // Set a rewards claiming contract
    let rewardsContractSetup = async function (_claimContract: string, _claimAmountPerc: number) {
      // Set the amount this contract can claim
      await setDAONetworkBootstrapRewardsClaimer(web3, rp, _claimContract, web3.utils.toWei(_claimAmountPerc.toString(), "ether"), {
        from: owner,
        gas: gasLimit,
      });
      // Set the claim interval blocks
      await setRewardsClaimIntervalTime(web3, rp, claimIntervalTime, {
        from: owner,
        gas: gasLimit,
      });
    };

    // Setup
    before(async () => {
      // Get accounts
      [
        owner,
        userOne,
        registeredNode1,
        registeredNode2,
        registeredNode3,
        registeredNodeTrusted1,
        registeredNodeTrusted2,
        registeredNodeTrusted3,
        node1WithdrawalAddress,
        trustedNode,
        daoInvoiceRecipient,
      ] = await web3.eth.getAccounts();

      // Register node
      await rp.node.registerNode("Australia/Brisbane", {
        from: registeredNode1,
        gas: gasLimit,
      });
      await rp.node.registerNode("Australia/Brisbane", {
        from: registeredNode2,
        gas: gasLimit,
      });
      await rp.node.registerNode("Australia/Brisbane", {
        from: registeredNode3,
        gas: gasLimit,
      });
      await rp.node.registerNode("Australia/Brisbane", {
        from: registeredNodeTrusted1,
        gas: gasLimit,
      });
      await rp.node.registerNode("Australia/Brisbane", {
        from: registeredNodeTrusted2,
        gas: gasLimit,
      });
      await rp.node.registerNode("Australia/Brisbane", {
        from: registeredNodeTrusted3,
        gas: gasLimit,
      });
      await rp.node.registerNode("Australia/Brisbane", {
        from: trustedNode,
        gas: gasLimit,
      });

      // Register trusted node
      await setNodeTrusted(web3, rp, trustedNode, "rocketpool_1", "node@home.com", owner);

      // Set node 1 withdrawal address
      await setNodeWithdrawalAddress(web3, rp, registeredNode1, node1WithdrawalAddress, {
        from: registeredNode1,
        gas: gasLimit,
      });

      // Set nodes as trusted
      await setNodeTrusted(web3, rp, registeredNodeTrusted1, "saas_1", "node@home.com", owner);
      await setNodeTrusted(web3, rp, registeredNodeTrusted2, "saas_2", "node@home.com", owner);

      // Set max per-minipool stake to 100% and RPL price to 1 ether
      await setDAOProtocolBootstrapSetting(
        web3,
        rp,
        "rocketDAOProtocolSettingsNode",
        "node.per.minipool.stake.maximum",
        web3.utils.toWei(maxStakePerMinipool, "ether"),
        {
          from: owner,
          gas: gasLimit,
        }
      );
      let block = await web3.eth.getBlockNumber();
      await submitPrices(web3, rp, block, web3.utils.toWei("1", "ether"), "0", {
        from: registeredNodeTrusted1,
        gas: gasLimit,
      });
      await submitPrices(web3, rp, block, web3.utils.toWei("1", "ether"), "0", {
        from: registeredNodeTrusted2,
        gas: gasLimit,
      });

      // Mint a tonne of RPL for testing
      await mintRPL(web3, rp, owner, registeredNode1, web3.utils.toWei("10000", "ether"));
      await mintRPL(web3, rp, owner, registeredNode2, web3.utils.toWei("10000", "ether"));
      await mintRPL(web3, rp, owner, registeredNode3, web3.utils.toWei("10000", "ether"));
    });

    async function testEffectiveStakeValues() {
      let nodes = [registeredNode1, registeredNode2, registeredNode3];

      let totalStake = web3.utils.toBN("0");
      let rplPrice = await getRPLPrice(web3, rp).then((value: any) => web3.utils.toBN(value));

      for (const node of nodes) {
        let nodeStakedRpl = await getNodeRPLStake(web3, rp, node).then((value: any) => web3.utils.toBN(value));
        let minipoolCount = await getNodeStakingMinipoolCount(web3, rp, node);
        let maxStake = web3.utils
          .toBN(minipoolCount)
          .mul(web3.utils.toBN(web3.utils.toWei(maxStakePerMinipool, "ether")))
          .mul(web3.utils.toBN(web3.utils.toWei("16", "ether")))
          .div(rplPrice);
        let expectedEffectiveStake = BN.min(maxStake, nodeStakedRpl);
        let effectiveStake = await getNodeEffectiveRPLStake(web3, rp, node).then((value: any) => web3.utils.toBN(value));

        // console.log("Expected / actual / stake / minipool count: ", web3.utils.fromWei(expectedEffectiveStake), web3.utils.fromWei(effectiveStake), web3.utils.fromWei(nodeStakedRpl), minipoolCount.toString());
        assert(effectiveStake.eq(expectedEffectiveStake), "Incorrect effective stake");

        totalStake = totalStake.add(expectedEffectiveStake);
      }

      let actualTotalStake = await getTotalEffectiveRPLStake(web3, rp).then((value: any) => web3.utils.toBN(value));
      let calculatedTotalStake = await getCalculatedTotalEffectiveRPLStake(web3, rp, rplPrice.toString()).then((value: any) => web3.utils.toBN(value));
      // console.log("Expected / actual / calculated: ", web3.utils.fromWei(totalStake), web3.utils.fromWei(actualTotalStake), web3.utils.fromWei(calculatedTotalStake));
      assert(totalStake.eq(actualTotalStake), "Incorrect total effective stake");
      assert(totalStake.eq(calculatedTotalStake), "Incorrect calculated total effective stake");
    }

    async function setPrice(price: string) {
      await mineBlocks(web3, 1);
      let blockNumber = await web3.eth.getBlockNumber();
      let calculatedTotalEffectiveStake = await getCalculatedTotalEffectiveRPLStake(web3, rp, price);
      await submitPrices(web3, rp, blockNumber, price, calculatedTotalEffectiveStake, {
        from: registeredNodeTrusted1,
        gas: gasLimit,
      });
      await submitPrices(web3, rp, blockNumber, price, calculatedTotalEffectiveStake, {
        from: registeredNodeTrusted2,
        gas: gasLimit,
      });
    }

    /*** Regular Nodes *************************/

    it(printTitle("node1+2", "effective stake is correct after prices change"), async () => {
      // Stake RPL against nodes and create minipools to set effective stakes
      await nodeStakeRPL(web3, rp, web3.utils.toWei("32", "ether"), {
        from: registeredNode1,
        gas: gasLimit,
      });
      await nodeStakeRPL(web3, rp, web3.utils.toWei("32", "ether"), {
        from: registeredNode2,
        gas: gasLimit,
      });
      await nodeDeposit(web3, rp, {
        from: registeredNode1,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      await nodeDeposit(web3, rp, {
        from: registeredNode2,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      await nodeDeposit(web3, rp, {
        from: registeredNode2,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      await testEffectiveStakeValues();

      // Double the price of RPL and test
      await setPrice(web3.utils.toWei("2", "ether"));
      await testEffectiveStakeValues();

      // Quarter the price of RPL and test
      await setPrice(web3.utils.toWei("0.5", "ether"));
      await testEffectiveStakeValues();
    });

    it(printTitle("node1+2", "effective stake is correct after various events occur"), async () => {
      // Stake RPL against nodes and create minipools to set effective stakes
      await nodeStakeRPL(web3, rp, web3.utils.toWei("32", "ether"), {
        from: registeredNode1,
        gas: gasLimit,
      });
      await nodeStakeRPL(web3, rp, web3.utils.toWei("32", "ether"), {
        from: registeredNode2,
        gas: gasLimit,
      });
      await nodeDeposit(web3, rp, {
        from: registeredNode1,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      await nodeDeposit(web3, rp, {
        from: registeredNode2,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      let initializedMinipool = (await createMinipool(web3, rp, {
        from: registeredNode2,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      })) as MinipoolContract;
      await testEffectiveStakeValues();

      // Increase the price of RPL and create some more minipools
      await setPrice(web3.utils.toWei("2", "ether"));
      await nodeDeposit(web3, rp, {
        from: registeredNode2,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      await testEffectiveStakeValues();

      // Stake some more RPL
      await nodeStakeRPL(web3, rp, web3.utils.toWei("32", "ether"), {
        from: registeredNode2,
        gas: gasLimit,
      });
      await testEffectiveStakeValues();

      // Decrease the price of RPL and destroy some minipools
      await setPrice(web3.utils.toWei("0.75", "ether"));
      await dissolve(web3, rp, initializedMinipool, {
        from: registeredNode2,
        gas: gasLimit,
      });
      await close(web3, rp, initializedMinipool, {
        from: registeredNode2,
        gas: gasLimit,
      });
      await testEffectiveStakeValues();
    });

    it(printTitle("node1+2+3", "effective stake is correct"), async () => {
      // Stake RPL against nodes and create minipools to set effective stakes
      await nodeStakeRPL(web3, rp, web3.utils.toWei("1.6", "ether"), {
        from: registeredNode1,
        gas: gasLimit,
      });
      await nodeStakeRPL(web3, rp, web3.utils.toWei("50", "ether"), {
        from: registeredNode2,
        gas: gasLimit,
      });
      await nodeStakeRPL(web3, rp, web3.utils.toWei("50", "ether"), {
        from: registeredNode3,
        gas: gasLimit,
      });
      await nodeDeposit(web3, rp, {
        from: registeredNode1,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      await nodeDeposit(web3, rp, {
        from: registeredNode2,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      await nodeDeposit(web3, rp, {
        from: registeredNode3,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      await testEffectiveStakeValues();
    });

    it(printTitle("node1", "cannot stake RPL while network is not in consensus"), async () => {
      const priceFrequency = 50;
      // Set price frequency to a low value so we can mine fewer blocks
      await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.submit.prices.frequency", priceFrequency, {
        from: owner,
        gas: gasLimit,
      });
      // Set withdrawal cooldown to 0
      await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsRewards", "rpl.rewards.claim.period.time", 0, {
        from: owner,
        gas: gasLimit,
      });
      // Set price at current block
      await setPrice(web3.utils.toWei("1", "ether"));
      // Should be able to stake at current time as price is in consensus
      await nodeStakeRPL(web3, rp, web3.utils.toWei("1.6", "ether"), {
        from: registeredNode1,
        gas: gasLimit,
      });
      // Create a minipool to increase our max RPL stake
      await userDeposit(web3, rp, {
        from: userOne,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      let minipool = (await createMinipool(web3, rp, {
        from: registeredNode1,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      })) as MinipoolContract;
      await stakeMinipool(web3, rp, minipool, null, {
        from: registeredNode1,
        gas: gasLimit,
      });
      // Mine blocks until next price window
      await mineBlocks(web3, priceFrequency);
      // Staking should fail now because oracles have not submitted price for this window
      await shouldRevert(
        nodeStakeRPL(web3, rp, web3.utils.toWei("1.6", "ether"), {
          from: registeredNode1,
          gas: gasLimit,
        }),
        "Was able to stake when network was not in consensus about price",
        "Network is not in consensus"
      );
      // Test effective stake values
      await testEffectiveStakeValues();
    });

    /*** Trusted Nodes *************************/
    it(printTitle("trusted nodes", "cannot set price on a block older than when effective stake was updated last"), async () => {
      // Set price
      let blockNumber = await web3.eth.getBlockNumber();
      let price = web3.utils.toWei("1", "ether");
      let calculatedTotalEffectiveStake = await getCalculatedTotalEffectiveRPLStake(web3, rp, price);
      await submitPrices(web3, rp, blockNumber, price, calculatedTotalEffectiveStake, {
        from: registeredNodeTrusted1,
        gas: gasLimit,
      });
      await submitPrices(web3, rp, blockNumber, price, calculatedTotalEffectiveStake, {
        from: registeredNodeTrusted2,
        gas: gasLimit,
      });
      // Stake and setup a minipool so that effective rpl stake is updated
      await mineBlocks(web3, 1);
      let oldBlockNumber = await web3.eth.getBlockNumber();
      await mineBlocks(web3, 1);
      await nodeStakeRPL(web3, rp, web3.utils.toWei("10", "ether"), {
        from: registeredNode1,
        gas: gasLimit,
      });
      let minipool = (await createMinipool(web3, rp, {
        from: registeredNode1,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      })) as MinipoolContract;
      await userDeposit(web3, rp, {
        from: userOne,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      await stakeMinipool(web3, rp, minipool, null, {
        from: registeredNode1,
        gas: gasLimit,
      });
      // Should not be able to submit a price change at oldBlockNumber as effective stake changed after it
      await submitPrices(web3, rp, oldBlockNumber, price, calculatedTotalEffectiveStake, {
        from: registeredNodeTrusted1,
        gas: gasLimit,
      });
      await shouldRevert(
        submitPrices(web3, rp, oldBlockNumber, price, calculatedTotalEffectiveStake, {
          from: registeredNodeTrusted2,
          gas: gasLimit,
        }),
        "Was able to update prices at block older than when effective stake was updated last",
        "Cannot update effective RPL stake based on block lower than when it was last updated on chain"
      );
    });

    it(printTitle("node1", "cannot mark a minipool as withdrawable while network is not in consensus"), async () => {
      const priceFrequency = 50;
      // Set price frequency to a low value so we can mine fewer blocks
      await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.submit.prices.frequency", priceFrequency, {
        from: owner,
        gas: gasLimit,
      });
      // Set withdrawal cooldown to 0
      await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsRewards", "rpl.rewards.claim.period.time", 0, {
        from: owner,
        gas: gasLimit,
      });
      // Set price at current block
      await setPrice(web3.utils.toWei("1", "ether"));
      // Should be able to stake at current time as price is in consensus
      await nodeStakeRPL(web3, rp, web3.utils.toWei("1.6", "ether"), {
        from: registeredNode1,
        gas: gasLimit,
      });
      // Create a minipool to increase our max RPL stake
      await userDeposit(web3, rp, {
        from: userOne,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      });
      let minipool = (await createMinipool(web3, rp, {
        from: registeredNode1,
        value: web3.utils.toWei("16", "ether"),
        gas: gasLimit,
      })) as MinipoolContract;
      await stakeMinipool(web3, rp, minipool, null, {
        from: registeredNode1,
        gas: gasLimit,
      });
      // Mine blocks until next price window
      await mineBlocks(web3, priceFrequency);
      // Mark it as withdrawable
      await submitMinipoolWithdrawable(web3, rp, minipool.address, {
        from: registeredNodeTrusted1,
        gas: gasLimit,
      });
      // This one where consensus is reached should fail while not in network consensus about prices
      await shouldRevert(
        submitMinipoolWithdrawable(web3, rp, minipool.address, {
          from: registeredNodeTrusted2,
          gas: gasLimit,
        }),
        "Was able to mark minipool as withdrawable when network was not in consensus about price",
        "Network is not in consensus"
      );
      // Test effective stake values
      await testEffectiveStakeValues();
      // Set price at current block to bring the network back into consensus about prices
      await setPrice(web3.utils.toWei("1", "ether"));
      // Should be able to set withdrawable now
      await submitMinipoolWithdrawable(web3, rp, minipool.address, {
        from: registeredNodeTrusted2,
        gas: gasLimit,
      });
      // Test effective stake values again
      await testEffectiveStakeValues();
    });
  });
}
