// Dependencies
import Web3 from 'web3';
import RocketPool from '../rocketpool/rocketpool';

// Tests
import runContractsTests from './contracts/contracts-tests';
import runDepositTests from './deposit/deposit-tests';
import runGroupTests from './group/group-tests';
import runNodeTests from './node/node-tests';
import runTokensTests from './tokens/tokens-tests';

// Initialise web3
const web3: Web3 = new Web3('http://localhost:8545');

// Initialise RocketPool
const rp: RocketPool = new RocketPool(web3);

// Run tests
runContractsTests(web3, rp);
runDepositTests(web3, rp);
runGroupTests(web3, rp);
runNodeTests(web3, rp);
runTokensTests(web3, rp);
