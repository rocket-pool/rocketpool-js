// Imports
import Web3 from 'web3';
import ContractManager from './contracts/contracts';


/**
 * Main Rocket Pool library class
 */
class RocketPool {


    // Services
    public readonly contracts: ContractManager;


    // Constructor
    constructor(public readonly web3: Web3) {

        // Initialise services
        this.contracts = new ContractManager(web3);

    }


}


// Exports
export default RocketPool;
