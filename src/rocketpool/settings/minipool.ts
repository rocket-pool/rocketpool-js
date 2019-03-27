// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool minipool settings manager
 */
class MinipoolSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketMinipoolSettings(): Promise<Contract> {
        return this.contracts.get('rocketMinipoolSettings');
    }


    /**
     * Getters
     */


}


// Exports
export default MinipoolSettings;
