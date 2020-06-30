// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core/types';
import { Contract, SendOptions } from 'web3-eth-contract/types';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


/**
 * RocketMinipool contract instance wrapper
 */
class MinipoolContract {


    // Constructor
    public constructor(private web3: Web3, private contract: Contract) {}


    /**
     * Getters
     */


    // Status details
    public getStatus(): Promise<number> {
        return this.contract.methods.getStatus.call();
    }
    public getStatusBlock(): Promise<number> {
        return this.contract.methods.getStatusBlock.call().then((value: string): number => parseInt(value));
    }
    public getStatusTime(): Promise<Date> {
        return this.contract.methods.getStatusTime.call().then((value: string): Date => new Date(parseInt(value) * 1000));
    }


    // Deposit type
    public getDepositType(): Promise<number> {
        return this.contract.methods.getDepositType.call();
    }


    // Node details
    public getNodeAddress(): Promise<string> {
        return this.contract.methods.getNodeAddress.call();
    }
    public getNodeFee(): Promise<number> {
        return this.contract.methods.getNodeFee.call().then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    public getNodeDepositBalance(): Promise<string> {
        return this.contract.methods.getNodeDepositBalance.call();
    }
    public getNodeRefundBalance(): Promise<string> {
        return this.contract.methods.getNodeRefundBalance.call();
    }
    public getNodeDepositAssigned(): Promise<boolean> {
        return this.contract.methods.getNodeDepositAssigned.call();
    }


    // User deposit details
    public getUserDepositBalance(): Promise<string> {
        return this.contract.methods.getUserDepositBalance.call();
    }
    public getUserDepositAssigned(): Promise<boolean> {
        return this.contract.methods.getUserDepositAssigned.call();
    }


    // Staking details
    public getStakingStartBalance(): Promise<string> {
        return this.contract.methods.getStakingStartBalance.call();
    }
    public getStakingEndBalance(): Promise<string> {
        return this.contract.methods.getStakingEndBalance.call();
    }
    public getStakingStartBlock(): Promise<number> {
        return this.contract.methods.getStakingStartBlock.call().then((value: string): number => parseInt(value));
    }
    public getStakingUserStartBlock(): Promise<number> {
        return this.contract.methods.getStakingUserStartBlock.call().then((value: string): number => parseInt(value));
    }
    public getStakingEndBlock(): Promise<number> {
        return this.contract.methods.getStakingEndBlock.call().then((value: string): number => parseInt(value));
    }


    /**
     * Mutators - Public
     */


    // Dissolve the minipool
    public dissolve(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.dissolve.send(options),
            onConfirmation
        );
    }


    /**
     * Mutators - Restricted to minipool owner
     */


    // Refund node ETH refinanced from user deposited ETH
    public refund(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.refund.send(options),
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


    // Withdraw node balances & rewards from the minipool and close it
    public withdraw(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.withdraw.send(options),
            onConfirmation
        );
    }


    // Withdraw node balances from the minipool and close it
    public close(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.close.send(options),
            onConfirmation
        );
    }


}


// Exports
export default MinipoolContract;
