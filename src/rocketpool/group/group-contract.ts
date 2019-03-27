// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { Tx } from 'web3/eth/types';
import { TransactionReceipt } from 'web3/types';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


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
        return this.contract.methods.getFeePerc().call().then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Get the fee charged to the group's users by Rocket Pool as a fraction
    public getRocketPoolFee(): Promise<number> {
        return this.contract.methods.getFeePercRocketPool().call().then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Get the address group fees are sent to
    public getGroupFeeAddress(): Promise<string> {
        return this.contract.methods.getFeeAddress().call();
    }


    /**
     * Mutators - Restricted to the group owner address
     */


    // Set the fee charged to the group's users by the group
    public setGroupFee(feeFraction: number, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.setFeePerc(this.web3.utils.toWei(feeFraction.toString(), 'ether')).send(options),
            onConfirmation
        );
    }


    // Set the address group fees are sent to
    public setGroupFeeAddress(address: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.setFeeAddress(address).send(options),
            onConfirmation
        );
    }


    // Add a depositor contract to the group
    public addDepositor(address: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.addDepositor(address).send(options),
            onConfirmation
        );
    }


    // Remove a depositor contract from the group
    public removeDepositor(address: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.removeDepositor(address).send(options),
            onConfirmation
        );
    }


    // Add a withdrawer contract to the group
    public addWithdrawer(address: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.addWithdrawer(address).send(options),
            onConfirmation
        );
    }


    // Remove a withdrawer contract from the group
    public removeWithdrawer(address: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.removeWithdrawer(address).send(options),
            onConfirmation
        );
    }


}


// Exports
export default GroupContract;
