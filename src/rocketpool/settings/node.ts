// Imports
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool node settings manager
 */
class NodeSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDAOProtocolSettingsNode(): Promise<Contract> {
        return this.contracts.get('rocketDAOProtocolSettingsNode');
    }


    /**
     * Getters
     */
    // Node registrations are currently enabled
    public getRegistrationEnabled(): Promise<boolean> {
        return this.rocketDAOProtocolSettingsNode.then((rocketDAOProtocolSettingsNode: Contract): Promise<boolean> => {
            return rocketDAOProtocolSettingsNode.methods.getRegistrationEnabled().call();
        });
    }


    // Node deposits are currently enabled
    public getDepositEnabled(): Promise<boolean> {
        return this.rocketDAOProtocolSettingsNode.then((rocketDAOProtocolSettingsNode: Contract): Promise<boolean> => {
            return rocketDAOProtocolSettingsNode.methods.getDepositEnabled().call();
        });
    }


}


// Exports
export default NodeSettings;
