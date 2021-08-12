// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


// Detail types
export interface StatusDetails {
    status: number;
    block: number;
    time: Date;
}


export interface NodeDetails {
    address: string;
    fee: number;
    depositBalance: string;
    refundBalance: string;
    depositAssigned: boolean;
}


export interface UserDetails {
    depositBalance: string;
    depositAssigned: boolean;
    depositAssignedTime: Date;
}


export interface StakingDetails {
    startBalance: string;
    endBalance: string;
}


/**
 * RocketMinipool contract instance wrapper
 */
class MinipoolContract {


    // Constructor
    public constructor(private web3: Web3, public readonly address: string, public readonly contract: Contract) {}


    /**
     * Getters
     */


    // Status details
    public getStatusDetails(): Promise<StatusDetails> {
        return Promise.all([
            this.getStatus(),
            this.getStatusBlock(),
            this.getStatusTime(),
        ]).then(
            ([status, block, time]: [number, number, Date]): StatusDetails =>
            ({status, block, time})
        );
    }


    public getStatus(): Promise<number> {
        return this.contract.methods.getStatus().call();
    }


    public getStatusBlock(): Promise<number> {
        return this.contract.methods.getStatusBlock().call().then((value: string): number => parseInt(value));
    }


    public getStatusTime(): Promise<Date> {
        return this.contract.methods.getStatusTime().call().then((value: string): Date => new Date(parseInt(value) * 1000));
    }


    // Deposit type
    public getDepositType(): Promise<number> {
        return this.contract.methods.getDepositType().call();
    }


    // Node details
    public getNodeDetails(): Promise<NodeDetails> {
        return Promise.all([
            this.getNodeAddress(),
            this.getNodeFee(),
            this.getNodeDepositBalance(),
            this.getNodeRefundBalance(),
            this.getNodeDepositAssigned(),
        ]).then(
            ([address, fee, depositBalance, refundBalance, depositAssigned]: [string, number, string, string, boolean]): NodeDetails =>
            ({address, fee, depositBalance, refundBalance, depositAssigned})
        );
    }


    public getNodeAddress(): Promise<string> {
        return this.contract.methods.getNodeAddress().call();
    }


    public getNodeFee(): Promise<number> {
        return this.contract.methods.getNodeFee().call().then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    public getNodeDepositBalance(): Promise<string> {
        return this.contract.methods.getNodeDepositBalance().call();
    }


    public getNodeRefundBalance(): Promise<string> {
        return this.contract.methods.getNodeRefundBalance().call();
    }


    public getNodeDepositAssigned(): Promise<boolean> {
        return this.contract.methods.getNodeDepositAssigned().call();
    }


    // User deposit details
    public getUserDetails(): Promise<UserDetails> {
        return Promise.all([
            this.getUserDepositBalance(),
            this.getUserDepositAssigned(),
            this.getUserDepositAssignedTime(),
        ]).then(
            ([depositBalance, depositAssigned, depositAssignedTime]: [string, boolean, Date]): UserDetails =>
            ({depositBalance, depositAssigned, depositAssignedTime})
        );
    }


    public getUserDepositBalance(): Promise<string> {
        return this.contract.methods.getUserDepositBalance().call();
    }


    public getUserDepositAssigned(): Promise<boolean> {
        return this.contract.methods.getUserDepositAssigned().call();
    }


    public getUserDepositAssignedTime(): Promise<Date> {
        return this.contract.methods.getUserDepositAssignedTime().call().then((value: string): Date => new Date(parseInt(value) * 1000));
    }


    // Staking details
    public getStakingDetails(): Promise<StakingDetails> {
        return Promise.all([
            this.getStakingStartBalance(),
            this.getStakingEndBalance(),
        ]).then(
            ([startBalance, endBalance]: [string, string]): StakingDetails =>
            ({startBalance, endBalance})
        );
    }


    public getStakingStartBalance(): Promise<string> {
        return this.contract.methods.getStakingStartBalance().call();
    }


    public getStakingEndBalance(): Promise<string> {
        return this.contract.methods.getStakingEndBalance().call();
    }


    public getWithdrawalCredentials(): Promise<any> {
        return this.contract.methods.getWithdrawalCredentials().call();
    }


    public getNodeWithdrawn(): Promise<any> {
        return this.contract.methods.getNodeWithdrawn().call();
    }


    /**
     * Mutators - Public
     */
    // Dissolve the minipool
    public dissolve(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.dissolve().send(options),
            onConfirmation
        );
    }


    // Slash the minipool
    public slash(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.slash().send(options),
            onConfirmation
        );
    }


    /**
     * Mutators - Restricted to minipool owner
     */
    // Refund node ETH refinanced from user deposited ETH
    public refund(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.refund().send(options),
            onConfirmation
        );
    }


    // Progress the minipool to staking
    public stake(validatorPubkey: Buffer, validatorSignature: Buffer, depositDataRoot: Buffer, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.stake(validatorPubkey, validatorSignature, depositDataRoot).send(options),
            onConfirmation
        );
    }


    // Finalise and unlock their RPL stake
    public finalise(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.finalise().send(options),
            onConfirmation
        );
    }


    // Withdraw node balances & rewards from the minipool and close it
    public withdraw(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.withdraw().send(options),
            onConfirmation
        );
    }


    // Processes a withdrawal and then destroys in a single transaction
    public distributeBalanceAndFinalise(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.distributeBalanceAndFinalise().send(options),
            onConfirmation
        );
    }


    // Processes a withdrawal
    public distributeBalance(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.distributeBalance().send(options),
            onConfirmation
        );
    }



    // Withdraw node balances from the minipool and close it
    public close(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.close().send(options),
            onConfirmation
        );
    }


}


// Exports
export default MinipoolContract;
