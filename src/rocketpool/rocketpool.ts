// Imports
import Web3 from 'web3';
import Contracts from './contracts/contracts';
import Deposit from './deposit/deposit';


/**
 * Main Rocket Pool library class
 */
class RocketPool {


    // Services
    public readonly contracts: Contracts;
    public readonly deposit: Deposit;


    // Constructor
    constructor(public readonly web3: Web3) {

        // Initialise services
        this.contracts = new Contracts(web3);
        this.deposit = new Deposit(web3, this.contracts);

    }


}


// Exports
export default RocketPool;
