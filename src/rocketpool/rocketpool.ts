// Imports
import Web3 from 'web3';
import Contracts from './contracts/contracts';
import Deposits from './deposits/deposits';


/**
 * Main Rocket Pool library class
 */
class RocketPool {


    // Services
    public readonly contracts: Contracts;
    public readonly deposits: Deposits;


    // Constructor
    public constructor(public readonly web3: Web3) {

        // Initialise services
        this.contracts = new Contracts(web3);
        this.deposits = new Deposits(web3, this.contracts);

    }


}


// Exports
export default RocketPool;
