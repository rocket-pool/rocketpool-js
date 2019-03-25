// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { Tx } from 'web3/eth/types';
import { TransactionReceipt } from 'web3/types';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


// Node details
export interface NodeDetails {
    owner: string;
    rewardsAddress: string;
    ethBalance: string;
    rplBalance: string;
    hasDepositReservation: boolean;
}


// Node deposit reservation details
export interface NodeDepositReservation {
    created: Date;
    etherRequired: string;
    rplRequired: string;
    durationId: string;
    depositInput: Buffer;
}


/**
 * RocketNodeContract instance wrapper
 */
class NodeContract {


    // Constructor
    public constructor(private web3: Web3, private contract: Contract) {}


    /**
     * Getters
     */


    // Get all node details
    public getDetails(): Promise<NodeDetails> {
        return Promise.all([
            this.getOwner(),
            this.getRewardsAddress(),
            this.getEthBalance(),
            this.getRplBalance(),
            this.getHasDepositReservation(),
        ]).then(([owner, rewardsAddress, ethBalance, rplBalance, hasDepositReservation]: [string, string, string, string, boolean]): NodeDetails => {
            return {owner, rewardsAddress, ethBalance, rplBalance, hasDepositReservation};
        });
    }


    // Get all node deposit reservation details
    public getDepositReservation(): Promise<NodeDepositReservation> {
        return Promise.all([
            this.getDepositReservationCreated(),
            this.getDepositReservationEthRequired(),
            this.getDepositReservationRplRequired(),
            this.getDepositReservationDurationId(),
            this.getDepositReservationDepositInput(),
        ]).then(([created, etherRequired, rplRequired, durationId, depositInput]: [Date, string, string, string, Buffer]): NodeDepositReservation => {
            return {created, etherRequired, rplRequired, durationId, depositInput};
        });
    }


    // Get the node owner
    public getOwner(): Promise<string> {
        return this.contract.methods.getOwner().call();
    }


    // Get the node's rewards address
    public getRewardsAddress(): Promise<string> {
        return this.contract.methods.getRewardsAddress().call();
    }


    // Get the node's current ETH balance in wei
    public getEthBalance(): Promise<string> {
        return this.contract.methods.getBalanceETH().call();
    }


    // Get the node's current RPL balance in wei
    public getRplBalance(): Promise<string> {
        return this.contract.methods.getBalanceRPL().call();
    }


    // Check whether the node has an existing deposit reservation
    public getHasDepositReservation(): Promise<boolean> {
        return this.contract.methods.getHasDepositReservation().call();
    }


    // Get the deposit reservation created time
    public getDepositReservationCreated(): Promise<Date> {
        return this.contract.methods.getDepositReservedTime().call().then((created: string): Date => {
            return new Date(parseInt(created) * 1000);
        });
    }


    // Get the deposit reservation ETH requirement in wei
    public getDepositReservationEthRequired(): Promise<string> {
        return this.contract.methods.getDepositReserveEtherRequired().call();
    }


    // Get the deposit reservation RPL requirement in wei
    public getDepositReservationRplRequired(): Promise<string> {
        return this.contract.methods.getDepositReserveRPLRequired().call();
    }


    // Get the deposit reservation duration ID
    public getDepositReservationDurationId(): Promise<string> {
        return this.contract.methods.getDepositReserveDurationID().call();
    }


    // Get the deposit reservation DepositInput data
    public getDepositReservationDepositInput(): Promise<Buffer> {
        return this.contract.methods.getDepositReserveDepositInput().call();
    }


    /**
     * Mutators - Restricted (to the node owner address)
     */


}


// Exports
export default NodeContract;
