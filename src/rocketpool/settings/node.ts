// Imports
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract/types';
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


    // Node registrations are currently enabled
    public getRegistrationEnabled(): Promise<boolean> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<boolean> => {
            return rocketNodeSettings.methods.getRegistrationEnabled.call();
        });
    }


    // Node deposits are currently enabled
    public getDepositEnabled(): Promise<boolean> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<boolean> => {
            return rocketNodeSettings.methods.getDepositEnabled.call();
        });
    }


}


// Exports
export default NodeSettings;
