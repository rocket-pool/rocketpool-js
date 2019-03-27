// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool node settings manager
 */
class NodeSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketNodeSettings(): Promise<Contract> {
        return this.contracts.get('rocketNodeSettings');
    }


    /**
     * Getters
     */


}


// Exports
export default NodeSettings;
