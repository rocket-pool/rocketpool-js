// Imports
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { takeSnapshot, revertSnapshot, mineBlocks, getCurrentTime, increaseTime } from "../_utils/evm";
import { setNodeTrusted } from "../_helpers/node";
import { printTitle } from "../_utils/formatting";
import { shouldRevert } from "../_utils/testing";
import { executeUpdateBalances, submitBalances } from "./scenario-submit-balances";
import { setDAOProtocolBootstrapSetting } from "../dao/scenario-dao-protocol-bootstrap";
import { daoNodeTrustedExecute, daoNodeTrustedMemberLeave, daoNodeTrustedPropose, daoNodeTrustedVote } from "../dao/scenario-dao-node-trusted";
import { getDAOProposalEndBlock, getDAOProposalEndTime, getDAOProposalStartBlock } from "../dao/scenario-dao-proposal";
import { setDAONodeTrustedBootstrapSetting } from "../dao/scenario-dao-node-trusted-bootstrap";

// Tests
export default function runNetworkBalancesTests(web3: Web3, rp: RocketPool) {
  describe("Network Balances", () => {
    // settings
    const gasLimit: number = 8000000;

    // Accounts
    let owner: string;
    let node: string;
    let trustedNode1: string;
    let trustedNode2: string;
    let trustedNode3: string;
    let trustedNode4: string;
    let random: string;

    // Constants
    let proposalCooldown = 10;
    let proposalVoteBlocks = 10;
    let proposalVoteDelayBlocks = 4;

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

    before(async () => {
      // Get accounts
      [owner, node, trustedNode1, trustedNode2, trustedNode3, trustedNode4, random] = await web3.eth.getAccounts();

      // Register node
      await rp.node.registerNode("Australia/Brisbane", {
        from: node,
        gas: gasLimit,
      });

      // Register trusted nodes
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
      await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsProposals", "proposal.cooldown", proposalCooldown, {
        from: owner,
        gas: gasLimit,
      });
      await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsProposals", "proposal.vote.blocks", proposalVoteBlocks, {
        from: owner,
        gas: gasLimit,
      });
      // Set a small vote delay
      await setDAONodeTrustedBootstrapSetting(web3, rp, "rocketDAONodeTrustedSettingsProposals", "proposal.vote.delay.blocks", proposalVoteDelayBlocks, {
        from: owner,
        gas: gasLimit,
      });
    });

    async function trustedNode4JoinDao() {
      await rp.node.registerNode("Australia/Brisbane", {
        from: trustedNode4,
        gas: gasLimit,
      });
      await setNodeTrusted(web3, rp, trustedNode4, "saas_4", "node@home.com", owner);
    }

    async function trustedNode4LeaveDao() {
      // Wait enough time to do a new proposal
      await mineBlocks(web3, proposalCooldown);
      // Encode the calldata for the proposal
      let proposalCallData = web3.eth.abi.encodeFunctionCall(
        {
          name: "proposalLeave",
          type: "function",
          inputs: [{ type: "address", name: "_nodeAddress" }],
        },
        [trustedNode4]
      );

      // Add the proposal
      let proposalId = await daoNodeTrustedPropose(web3, rp, "hey guys, can I please leave the DAO?", proposalCallData, {
        from: trustedNode4,
        gas: gasLimit,
      });
      // Current block
      let timeCurrent = await getCurrentTime(web3);
      // Now mine blocks until the proposal is 'active' and can be voted on
      await increaseTime(web3, (await getDAOProposalStartBlock(web3, rp, proposalId)) - timeCurrent + 2);
      // Now lets vote
      await daoNodeTrustedVote(web3, rp, proposalId, true, {
        from: trustedNode1,
        gas: gasLimit,
      });
      await daoNodeTrustedVote(web3, rp, proposalId, true, {
        from: trustedNode2,
        gas: gasLimit,
      });
      await daoNodeTrustedVote(web3, rp, proposalId, true, {
        from: trustedNode3,
        gas: gasLimit,
      });
      // Fast forward to this voting period finishing
      timeCurrent = await getCurrentTime(web3);
      await increaseTime(web3, (await getDAOProposalEndTime(web3, rp, proposalId)) - timeCurrent + 2);
      // Proposal should be successful, lets execute it
      await daoNodeTrustedExecute(web3, rp, proposalId, {
        from: trustedNode1,
        gas: gasLimit,
      });
      // Member can now leave and collect any RPL bond
      await daoNodeTrustedMemberLeave(web3, rp, trustedNode4, {
        from: trustedNode4,
        gas: gasLimit,
      });
    }

    it(printTitle("trusted nodes", "can submit network balances"), async () => {
      // Set parameters
      let block = 1;
      let totalBalance = web3.utils.toWei("10", "ether");
      let stakingBalance = web3.utils.toWei("9", "ether");
      let rethSupply = web3.utils.toWei("8", "ether");

      // Submit different balances
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, web3.utils.toWei("7", "ether"), {
        from: trustedNode1,
        gas: gasLimit,
      });
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, web3.utils.toWei("6", "ether"), {
        from: trustedNode2,
        gas: gasLimit,
      });
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, web3.utils.toWei("5", "ether"), {
        from: trustedNode3,
        gas: gasLimit,
      });

      // Set parameters
      block = 2;

      // Submit identical balances to trigger update
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
        from: trustedNode1,
        gas: gasLimit,
      });
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
        from: trustedNode2,
        gas: gasLimit,
      });
    });

    it(printTitle("trusted nodes", "cannot submit network balances while balance submissions are disabled"), async () => {
      // Set parameters
      let block = 1;
      let totalBalance = web3.utils.toWei("10", "ether");
      let stakingBalance = web3.utils.toWei("9", "ether");
      let rethSupply = web3.utils.toWei("8", "ether");

      // Disable submissions
      await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.submit.balances.enabled", false, { from: owner });

      // Attempt to submit balances
      await shouldRevert(
        submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
          from: trustedNode1,
          gas: gasLimit,
        }),
        "Submitted balances while balance submissions were disabled",
        "Submitting balances is currently disabled"
      );
    });

    it(printTitle("trusted nodes", "cannot submit network balances for a future block"), async () => {
      // Get current block
      let blockCurrent = await web3.eth.getBlockNumber();

      // Set parameters
      let block = blockCurrent + 1;
      let totalBalance = web3.utils.toWei("10", "ether");
      let stakingBalance = web3.utils.toWei("9", "ether");
      let rethSupply = web3.utils.toWei("8", "ether");

      // Attempt to submit balances for future block
      await shouldRevert(
        submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
          from: trustedNode1,
          gas: gasLimit,
        }),
        "Submitted balances for a future block",
        "Balances can not be submitted for a future block"
      );
    });

    it(printTitle("trusted nodes", "cannot submit network balances for the current block or lower"), async () => {
      // Set parameters
      let block = 2;
      let totalBalance = web3.utils.toWei("10", "ether");
      let stakingBalance = web3.utils.toWei("9", "ether");
      let rethSupply = web3.utils.toWei("8", "ether");

      // Submit balances for block to trigger update
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
        from: trustedNode1,
        gas: gasLimit,
      });
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
        from: trustedNode2,
        gas: gasLimit,
      });

      // Attempt to submit balances for current block
      await shouldRevert(
        submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
          from: trustedNode3,
          gas: gasLimit,
        }),
        "Submitted balances for the current block",
        "Network balances for an equal or higher block are set"
      );

      // Attempt to submit balances for lower block
      await shouldRevert(
        submitBalances(web3, rp, block - 1, totalBalance, stakingBalance, rethSupply, {
          from: trustedNode3,
          gas: gasLimit,
        }),
        "Submitted balances for a lower block",
        "Network balances for an equal or higher block are set"
      );
    });

    it(printTitle("trusted nodes", "cannot submit invalid network balances"), async () => {
      // Set parameters
      let block = 1;
      let totalBalance = web3.utils.toWei("9", "ether");
      let stakingBalance = web3.utils.toWei("10", "ether");
      let rethSupply = web3.utils.toWei("8", "ether");

      // Submit balances for block
      await shouldRevert(
        submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
          from: trustedNode1,
          gas: gasLimit,
        }),
        "Submitted invalid balances",
        "Invalid network balances"
      );
    });

    it(printTitle("trusted nodes", "cannot submit the same network balances twice"), async () => {
      // Set parameters
      let block = 1;
      let totalBalance = web3.utils.toWei("10", "ether");
      let stakingBalance = web3.utils.toWei("9", "ether");
      let rethSupply = web3.utils.toWei("8", "ether");

      // Submit balances for block
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
        from: trustedNode1,
        gas: gasLimit,
      });

      // Attempt to submit balances for block again
      await shouldRevert(
        submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
          from: trustedNode1,
          gas: gasLimit,
        }),
        "Submitted the same network balances twice",
        "Duplicate submission from node"
      );
    });

    it(printTitle("regular nodes", "cannot submit network balances"), async () => {
      // Set parameters
      let block = 1;
      let totalBalance = web3.utils.toWei("10", "ether");
      let stakingBalance = web3.utils.toWei("9", "ether");
      let rethSupply = web3.utils.toWei("8", "ether");

      // Attempt to submit balances
      await shouldRevert(
        submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
          from: node,
          gas: gasLimit,
        }),
        "Regular node submitted network balances",
        "Invalid trusted node"
      );
    });

    it(printTitle("random", "can execute balances update when consensus is reached after member count changes"), async () => {
      // Setup
      await trustedNode4JoinDao();
      // Set parameters
      let block = 1;
      let totalBalance = web3.utils.toWei("10", "ether");
      let stakingBalance = web3.utils.toWei("9", "ether");
      let rethSupply = web3.utils.toWei("8", "ether");
      // Submit same parameters from 2 nodes (not enough for 4 member consensus but enough for 3)
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
        from: trustedNode1,
        gas: gasLimit,
      });
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
        from: trustedNode2,
        gas: gasLimit,
      });
      // trustedNode4 leaves the DAO
      await trustedNode4LeaveDao();
      // There is now consensus with the remaining 3 trusted nodes about the balances, try to execute the update
      await executeUpdateBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
        from: random,
        gas: gasLimit,
      });
    });

    it(printTitle("random", "cannot execute balances update without consensus"), async () => {
      // Setup
      await trustedNode4JoinDao();
      // Set parameters
      let block = 1;
      let totalBalance = web3.utils.toWei("10", "ether");
      let stakingBalance = web3.utils.toWei("9", "ether");
      let rethSupply = web3.utils.toWei("8", "ether");
      // Submit same price from 2 nodes (not enough for 4 member consensus)
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
        from: trustedNode1,
        gas: gasLimit,
      });
      await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
        from: trustedNode2,
        gas: gasLimit,
      });
      // There is no consensus so execute should fail
      await shouldRevert(
        executeUpdateBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
          from: random,
          gas: gasLimit,
        }),
        "Random account could execute update balances without consensus",
        "Consensus has not been reached"
      );
    });
  });
}
