// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool deposit settings manager
 */
class DepositSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDepositSettings(): Promise<Contract> {
        return this.contracts.get('rocketDepositSettings');
    }


    /**
     * Getters
     */


}


// Exports
export default DepositSettings;
