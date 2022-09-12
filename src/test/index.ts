// Dependencies
import runMinipoolScrubTests from "./minipool/minipool-scrub-tests";

const fs = require("fs");
import Web3 from "web3";
import RocketPool from "../rocketpool/rocketpool";

import { setDAOProtocolBootstrapSetting } from "./dao/scenario-dao-protocol-bootstrap";
import { takeSnapshot, revertSnapshot } from "./_utils/evm";

// Tests
import runContractsTests from "./contracts/contracts-tests";
import runDOAProtocolTests from "./dao/dao-protocol-tests";
import runDAONodeTrustedTests from "./dao/dao-node-trusted-tests";
import runAuctionTests from "./auction/auction-tests";
import runDepositTests from "./deposit/deposit-tests";
import runMinipoolTests from "./minipool/minipool-tests";
import runMinipoolStatusTests from "./minipool/minipool-status-tests";
import runMinipoolWithdrawalTests from "./minipool/minipool-withdrawal-tests";
import runNetworkBalancesTests from "./network/network-balances-tests";
import runNetworkFeesTests from "./network/network-fees-test";
import runNetworkPricesTests from "./network/network-prices-tests";
import runNetworkStakingTests from "./network/network-staking-tests";
import runNodeDistributorTests from "./node/node-distributor-tests";
import runNodeDepositTests from "./node/node-deposit-tests";
import runNodeManagerTests from "./node/node-manager-tests";
import runNodeStakingTests from "./node/node-staking-tests";
import runRethTests from "./tokens/reth-tests";
import runRPLTests from "./tokens/rpl-tests";
import runSettingsTests from "./settings/settings-tests";
import runRewardsTests from "./rewards/rewards-tests";

// Initialise web3
const web3: Web3 = new Web3("http://localhost:8545");

// Initialise RocketStorage contract
const RocketStorage = JSON.parse(fs.readFileSync(__dirname + "/../contracts/RocketStorage.json"));

// Initialise RocketPool
const rp: RocketPool = new RocketPool(web3, RocketStorage);
const gasLimit = 8000000;

// Header
const header = `
  /**
   *       .
   *      / \\
   *     |.'.|
   *     |'.'|
   *   ,'|   |'.
   *  |,-'-|-'-.|
   *   __|_| |         _        _      _____           _
   *  | ___ \\|        | |      | |    | ___ \\         | |
   *  | |_/ /|__   ___| | _____| |_   | |_/ /__   ___ | |
   *  |    // _ \\ / __| |/ / _ \\ __|  |  __/ _ \\ / _ \\| |
   *  | |\\ \\ (_) | (__|   <  __/ |_   | | | (_) | (_) | |
   *  \\_| \\_\\___/ \\___|_|\\_\\___|\\__|  \\_|  \\___/ \\___/|_|
   * +---------------------------------------------------+
   * |    DECENTRALISED STAKING PROTOCOL FOR ETHEREUM    |
   * +---------------------------------------------------+
   *
   *  Rocket Pool is a first-of-its-kind Ethereum staking pool protocol, designed to
   *  be community-owned, decentralised, and trustless.
   *
   *  For more information about Rocket Pool, visit https://rocketpool.net
   *
   *  Authors: David Rugendyke, Jake Pospischil, Kane Wallmann, Darren Langley, Joe Clapis, Nick Doherty
   *
   */
 `;
console.log(header);

let suiteSnapshotId: string;
beforeEach(async () => {
	suiteSnapshotId = await takeSnapshot(web3);
});
afterEach(async () => {
	await revertSnapshot(web3, suiteSnapshotId);
});

before(async function () {
	const [guardian] = await web3.eth.getAccounts();
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsDeposit", "deposit.enabled", true, { from: guardian, gas: gasLimit });
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsDeposit", "deposit.assign.enabled", true, { from: guardian, gas: gasLimit });
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsDeposit", "deposit.pool.maximum", web3.utils.toWei("1000", "ether"), {
		from: guardian,
		gas: gasLimit,
	});
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNode", "node.registration.enabled", true, { from: guardian, gas: gasLimit });
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNode", "node.deposit.enabled", true, { from: guardian, gas: gasLimit });
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsMinipool", "minipool.submit.withdrawable.enabled", true, {
		from: guardian,
		gas: gasLimit,
	});
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.node.fee.minimum", web3.utils.toWei("0.05", "ether"), {
		from: guardian,
		gas: gasLimit,
	});
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.node.fee.target", web3.utils.toWei("0.1", "ether"), {
		from: guardian,
		gas: gasLimit,
	});
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.node.fee.maximum", web3.utils.toWei("0.2", "ether"), {
		from: guardian,
		gas: gasLimit,
	});
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsNetwork", "network.node.demand.range", web3.utils.toWei("1000", "ether"), {
		from: guardian,
		gas: gasLimit,
	});
	await setDAOProtocolBootstrapSetting(
		web3,
		rp,
		"rocketDAOProtocolSettingsInflation",
		"rpl.inflation.interval.start",
		Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 14,
		{ from: guardian, gas: gasLimit }
	);
});

// Run tests
// runContractsTests(web3, rp);
// runAuctionTests(web3, rp); // matching
// runDepositTests(web3, rp); // matching
// runMinipoolScrubTests(web3, rp); // matching
// runMinipoolTests(web3, rp); // matching
// runMinipoolStatusTests(web3, rp); // matching
// runMinipoolWithdrawalTests(web3, rp); // matching
// runNetworkBalancesTests(web3, rp); // matching
// runNetworkFeesTests(web3, rp); // matching
runNetworkPenalties(web3, rp); // new
// runNetworkPricesTests(web3, rp); // matching
// runNetworkStakingTests(web3, rp); // matching
// runNodeDepositTests(web3, rp); // matching
// runNodeManagerTests(web3, rp); // doesn't match
// runNodeStakingTests(web3, rp); // matching
// runNodeDistributorTests(web3, rp); // new
// runRethTests(web3, rp);
// runRPLTests(web3, rp);
// runSettingsTests(web3, rp);
// runRewardsTests(web3, rp); // 17 in repo, 23 here, rename rewardPool
// runDOAProtocolTests(web3, rp); //matching
// runDAONodeTrustedTests(web3, rp); matching
