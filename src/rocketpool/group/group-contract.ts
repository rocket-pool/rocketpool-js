// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';


// Group details
export interface GroupDetails {
    owner: string;
    groupFee: number;
    rocketPoolFee: number;
    groupFeeAddress: string;
}


/**
 * RocketGroupContract instance wrapper
 */
class GroupContract {


    // Constructor
    public constructor(private web3: Web3, private contract: Contract) {}


    /**
     * Getters
     */


    // Get all group details
    public getDetails(): Promise<GroupDetails> {
        return Promise.all([
            this.getOwner(),
            this.getGroupFee(),
            this.getRocketPoolFee(),
            this.getGroupFeeAddress(),
        ]).then(([owner, groupFee, rocketPoolFee, groupFeeAddress]: [string, number, number, string]): GroupDetails => {
            return {owner, groupFee, rocketPoolFee, groupFeeAddress};
        });
    }


    // Get the group owner
    public getOwner(): Promise<string> {
        return this.contract.methods.getOwner().call();
    }


    // Get the fee charged to the group's users by the group as a fraction
    public getGroupFee(): Promise<number> {
        return this.contract.methods.getFeePerc().call().then((feePerc: string): number => {
            return parseFloat(this.web3.utils.fromWei(feePerc, 'ether'));
        });
    }


    // Get the fee charged to the group's users by Rocket Pool as a fraction
    public getRocketPoolFee(): Promise<number> {
        return this.contract.methods.getFeePercRocketPool().call().then((feePerc: string): number => {
            return parseFloat(this.web3.utils.fromWei(feePerc, 'ether'));
        });
    }


    // Get the address group fees are sent to
    public getGroupFeeAddress(): Promise<string> {
        return this.contract.methods.getFeeAddress().call();
    }


}


// Exports
export default GroupContract;
