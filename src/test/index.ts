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
import runNetworkTests from './network/network-tests';
import runNodeTests from './node/node-tests';
import runSettingsTests from './settings/settings-tests';
import runTokensTests from './tokens/tokens-tests';

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
runMinipoolTests(web3, rp);
// runNetworkTests(web3, rp);
// runNodeTests(web3, rp);
// runSettingsTests(web3, rp);
// runTokensTests(web3, rp);
