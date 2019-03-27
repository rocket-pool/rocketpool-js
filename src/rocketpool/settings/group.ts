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


     // Get the default fee charged to the group's users by Rocket Pool as a fraction
    public getDefaultFee(): Promise<number> {
        return this.rocketGroupSettings.then((rocketGroupSettings: Contract): Promise<string> => {
            return rocketGroupSettings.methods.getDefaultFee().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Get the maximum fee charged to the group's users by Rocket Pool as a fraction
    public getMaxFee(): Promise<number> {
        return this.rocketGroupSettings.then((rocketGroupSettings: Contract): Promise<string> => {
            return rocketGroupSettings.methods.getMaxFee().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Get whether new group registration is currently allowed
    public getNewAllowed(): Promise<boolean> {
        return this.rocketGroupSettings.then((rocketGroupSettings: Contract): Promise<boolean> => {
            return rocketGroupSettings.methods.getNewAllowed().call();
        });
    }


    // Get the group registration fee in wei
    public getNewFee(): Promise<string> {
        return this.rocketGroupSettings.then((rocketGroupSettings: Contract): Promise<string> => {
            return rocketGroupSettings.methods.getNewFee().call();
        });
    }


    // Get the group registration fee payment address
    public getNewFeeAddress(): Promise<string> {
        return this.rocketGroupSettings.then((rocketGroupSettings: Contract): Promise<string> => {
            return rocketGroupSettings.methods.getNewFeeAddress().call();
        });
    }


}


// Exports
export default GroupSettings;
