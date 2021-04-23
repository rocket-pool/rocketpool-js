// Dependencies
const fs = require('fs');
import Web3 from 'web3';
import RocketPool from '../rocketpool/rocketpool';

// Tests
import runContractsTests from './contracts/contracts-tests';
import runDOAProtocolTests from './dao/dao-protocol-tests';
import runDAONodeTrustedTests from './dao/dao-node-trusted-tests';
import runAuctionTests from './auction/auction-tests';
import runDepositTests from './deposit/deposit-tests';
import runMinipoolTests from './minipool/minipool-tests';
import runMinipoolStatusTests from './minipool/minipool-status-tests';
import runNetworkBalancesTests from './network/network-balances-tests';
import runNetworkFeesTests from './network/network-fees-test';
import runNetworkPricesTests from './network/network-prices-tests';
import runNetworkTests from './network/network-tests';
import runNodeDepositTests from './node/node-deposit-tests';
import runNodeManagerTests from './node/node-manager-tests';
import runNodeStakingTests from './node/node-staking-tests';
import runNethTests from './tokens/neth-tests';
import runRethTests from './tokens/reth-tests';
import runRPLTests from './tokens/rpl-tests';
import runSettingsTests from './settings/settings-tests';
import runTokensTests from './tokens/tokens-tests';
import runRewardsTests from './rewards/rewards-tests';


// Initialise web3
const web3: Web3 = new Web3('http://localhost:8545');

// Initialise RocketStorage contract
const RocketStorage = JSON.parse(fs.readFileSync(__dirname + '/../contracts/RocketStorage.json'));

// Initialise RocketPool
const rp: RocketPool = new RocketPool(web3, RocketStorage);


// Header
console.log('\n');
console.log('______           _        _    ______           _ ');
console.log('| ___ \\         | |      | |   | ___ \\         | |');
console.log('| |_/ /___   ___| | _____| |_  | |_/ /__   ___ | |');
console.log('|    // _ \\ / __| |/ / _ \\ __| |  __/ _ \\ / _ \\| |');
console.log('| |\\ \\ (_) | (__|   <  __/ |_  | | | (_) | (_) | |');
console.log('\\_| \\_\\___/ \\___|_|\\_\\___|\\__| \\_|  \\___/ \\___/|_|');

// Run tests
//runContractsTests(web3, rp);
//runDOAProtocolTests(web3, rp);
//runDAONodeTrustedTests(web3, rp);
//runAuctionTests(web3, rp);
//runDepositTests(web3, rp);
//runMinipoolTests(web3, rp);
// TO DO runMinipoolStatusTests(web3, rp);
// TO DO runNetworkBalancesTests(web3, rp);
// TO DO runNetworkPricesTests(web3, rp);
// TO DO runNodeDepositTests(web3, rp);
//runNodeManagerTests(web3, rp);
//runNodeStakingTests(web3, rp);
//runNethTests(web3, rp);
//runRethTests(web3, rp);
//runRPLTests(web3, rp);
//runSettingsTests(web3, rp);
runRewardsTests(web3, rp);
// runTokensTests(web3, rp);
