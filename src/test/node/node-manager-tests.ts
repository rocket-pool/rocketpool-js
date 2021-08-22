// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { takeSnapshot, revertSnapshot } from "../_utils/evm";
import { printTitle } from "../_utils/formatting";
import { shouldRevert } from "../_utils/testing";
import { setDAOProtocolBootstrapSetting } from "../dao/scenario-dao-protocol-bootstrap";
import { register } from "./scenario-register";
import { confirmWithdrawalAddress, setWithdrawalAddress } from "./scenario-set-withdrawal-address";
import { setTimezoneLocation } from "./scenario-set-timezone";

// Tests
export default function runNodeManagerTests(web3: Web3, rp: RocketPool) {
  describe("Node Manager", () => {
    // settings
    const gasLimit: number = 8000000;

    // Accounts
    let owner: string;
    let node: string;
    let registeredNode1: string;
    let registeredNode2: string;
    let withdrawalAddress1: string;
    let withdrawalAddress2: string;
    let random: string;
    let random2: string;
    let random3: string;

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
      [owner, node, registeredNode1, registeredNode2, withdrawalAddress1, withdrawalAddress2, random, random2, random3] = await web3.eth.getAccounts();

      // Register node
      await rp.node.registerNode("Australia/Brisbane", {
        from: registeredNode1,
        gas: gasLimit,
      });
      await rp.node.registerNode("Australia/Brisbane", {
        from: registeredNode2,
        gas: gasLimit,
      });
    });

    //
    // Registration
    //
    it(printTitle("node operator", "can register a node"), async () => {
      // Register node
      await register(web3, rp, "Australia/Brisbane", {
        from: node,
        gas: gasLimit,
      });
    });

    it(printTitle("node operator", "cannot register a node while registrations are disabled"), async () => {
      // Disable registrations
      await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNode", "node.registration.enabled", false, { from: owner });

      // Attempt registration
      await shouldRevert(
        register(web3, rp, "Australia/Brisbane", {
          from: node,
          gas: gasLimit,
        }),
        "Registered a node while registrations were disabled",
        "Rocket Pool node registrations are currently disabled"
      );
    });

    it(printTitle("node operator", "cannot register a node with an invalid timezone location"), async () => {
      // Attempt to register node
      await shouldRevert(
        register(web3, rp, "a", {
          from: node,
          gas: gasLimit,
        }),
        "Registered a node with an invalid timezone location",
        "The timezone location is invalid"
      );
    });

    it(printTitle("node operator", "cannot register a node which is already registered"), async () => {
      // Register
      await register(web3, rp, "Australia/Brisbane", {
        from: node,
        gas: gasLimit,
      });

      // Attempt second registration
      await shouldRevert(
        register(web3, rp, "Australia/Brisbane", {
          from: node,
          gas: gasLimit,
        }),
        "Registered a node which is already registered",
        "Item already exists in set"
      );
    });

    //
    // Withdrawal address
    //
    it(printTitle("node operator", "can set their withdrawal address immediately"), async () => {
      // Set withdrawal address
      await setWithdrawalAddress(web3, rp, registeredNode1, withdrawalAddress1, true, {
        from: registeredNode1,
        gas: gasLimit,
      });

      // Set withdrawal address again
      await setWithdrawalAddress(web3, rp, registeredNode1, withdrawalAddress2, true, {
        from: withdrawalAddress1,
        gas: gasLimit,
      });
    });

    it(printTitle("node operator", "can set their withdrawal address to the same value as another node operator"), async () => {
      // Set withdrawal addresses
      await setWithdrawalAddress(web3, rp, registeredNode1, withdrawalAddress1, true, {
        from: registeredNode1,
        gas: gasLimit,
      });

      await setWithdrawalAddress(web3, rp, registeredNode2, withdrawalAddress1, true, {
        from: registeredNode2,
        gas: gasLimit,
      });

      // Set withdrawal addresses again
      await setWithdrawalAddress(web3, rp, registeredNode1, withdrawalAddress2, true, {
        from: withdrawalAddress1,
        gas: gasLimit,
      });

      await setWithdrawalAddress(web3, rp, registeredNode2, withdrawalAddress2, true, {
        from: withdrawalAddress1,
        gas: gasLimit,
      });
    });

    it(printTitle("node operator", "cannot set their withdrawal address to an invalid address"), async () => {
      // Attempt to set withdrawal address
      await shouldRevert(
        setWithdrawalAddress(web3, rp, registeredNode1, "0x0000000000000000000000000000000000000000", true, {
          from: registeredNode1,
          gas: gasLimit,
        }),
        "Set a withdrawal address to an invalid address",
        "Invalid withdrawal address"
      );
    });

    it(printTitle("random address", "cannot set a withdrawal address"), async () => {
      // Attempt to set withdrawal address
      await shouldRevert(
        setWithdrawalAddress(web3, rp, registeredNode1, withdrawalAddress1, true, {
          from: random,
          gas: gasLimit,
        }),
        "Random address set a withdrawal address",
        "Only a tx from a node's withdrawal address can update it"
      );
    });

    it(printTitle("node operator", "can set and confirm their withdrawal address"), async () => {
      // Set & confirm withdrawal address
      await setWithdrawalAddress(web3, rp, registeredNode1, withdrawalAddress1, false, {
        from: registeredNode1,
        gas: gasLimit,
      });
      await confirmWithdrawalAddress(web3, rp, registeredNode1, {
        from: withdrawalAddress1,
        gas: gasLimit,
      });

      // Set & confirm withdrawal address again
      await setWithdrawalAddress(web3, rp, registeredNode1, withdrawalAddress2, false, {
        from: withdrawalAddress1,
        gas: gasLimit,
      });
      await confirmWithdrawalAddress(web3, rp, registeredNode1, {
        from: withdrawalAddress2,
        gas: gasLimit,
      });
    });

    it(printTitle("random address", "cannot confirm itself as a withdrawal address"), async () => {
      // Attempt to confirm a withdrawal address
      await shouldRevert(
        confirmWithdrawalAddress(web3, rp, registeredNode1, {
          from: random,
          gas: gasLimit,
        }),
        "Random address confirmed itself as a withdrawal address",
        "Confirmation must come from the pending withdrawal address"
      );
    });

    //
    // Timezone location
    //
    it(printTitle("node operator", "can set their timezone location"), async () => {
      // Set timezone location
      await setTimezoneLocation(web3, rp, "Australia/Sydney", {
        from: registeredNode1,
        gas: gasLimit,
      });
    });

    it(printTitle("node operator", "cannot set their timezone location to an invalid value"), async () => {
      // Attempt to set timezone location
      await shouldRevert(
        setTimezoneLocation(web3, rp, "a", {
          from: registeredNode1,
          gas: gasLimit,
        }),
        "Set a timezone location to an invalid value",
        "The timezone location is invalid"
      );
    });

    it(printTitle("random address", "cannot set a timezone location"), async () => {
      // Attempt to set timezone location
      await shouldRevert(
        setTimezoneLocation(web3, rp, "Australia/Brisbane", {
          from: random,
          gas: gasLimit,
        }),
        "Random address set a timezone location",
        "Invalid node"
      );
    });

    it(printTitle("random", "can query timezone counts"), async () => {
      await rp.node.registerNode("Australia/Sydney", {
        from: random2,
        gas: gasLimit,
      });
      await rp.node.registerNode("Australia/Perth", {
        from: random3,
        gas: gasLimit,
      });

      const timezones = await rp.node.getNodeCountPerTimezone(0, 0);

      const expects = {
        "Australia/Brisbane": 2,
        "Australia/Sydney": 1,
        "Australia/Perth": 1,
      };
      for (const expectTimezone in expects) {
        // @ts-ignore (suppressed cause find is es6)
        const actual = timezones.find((tz) => tz.timezone === expectTimezone);
        // @ts-ignore (suppressed cause TS wants a clean obj
        // @ts-ignore
        assert(
          actual && Number(actual.count) === expects[expectTimezone],
          "Timezone count was incorrect for " + expectTimezone + ", expected " + expects[expectTimezone] + " but got " + actual
        );
      }
    });
  });
}
