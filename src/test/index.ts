// Dependencies
import Web3 from 'web3';
import RocketPool from '../rocketpool/rocketpool';

// Tests
import runContractTests from './contract/contract-tests';

// Initialise web3
const web3: Web3 = new Web3('http://localhost:8545');

// Initialise RocketPool
const rp: RocketPool = new RocketPool(web3);

// Run tests
runContractTests(web3, rp);
