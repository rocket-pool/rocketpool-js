// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool group settings manager
 */
class GroupSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketGroupSettings(): Promise<Contract> {
        return this.contracts.get('rocketGroupSettings');
    }


    /**
     * Getters
     */


}


// Exports
export default GroupSettings;
