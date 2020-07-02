// Dependencies
const fs = require('fs');
import Web3 from 'web3';
import RocketPool from '../rocketpool/rocketpool';

// Tests
import runContractsTests from './contracts/contracts-tests';
import runDepositTests from './deposit/deposit-tests';
import runMinipoolTests from './minipool/minipool-tests';
import runSettingsTests from './settings/settings-tests';

// Initialise web3
const web3: Web3 = new Web3('http://localhost:8545');

// Initialise RocketStorage contract
const RocketStorage = JSON.parse(fs.readFileSync(__dirname + '/../contracts/RocketStorage.json'));

// Initialise RocketPool
const rp: RocketPool = new RocketPool(web3, RocketStorage);

// Run tests
runContractsTests(web3, rp);
runDepositTests(web3, rp);
runMinipoolTests(web3, rp);
runSettingsTests(web3, rp);
