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
    validatorPubkey: string;
    validatorSignature: string;
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
            this.getDepositReservationValidatorPubkey(),
            this.getDepositReservationValidatorSignature(),
        ]).then(([created, etherRequired, rplRequired, durationId, validatorPubkey, validatorSignature]: [Date, string, string, string, string, string]): NodeDepositReservation => {
            return {created, etherRequired, rplRequired, durationId, validatorPubkey, validatorSignature};
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
        return this.contract.methods.getDepositReservedTime().call().then((value: string): Date => new Date(parseInt(value) * 1000));
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


    // Get the deposit reservation validator pubkey
    public getDepositReservationValidatorPubkey(): Promise<string> {
        return this.contract.methods.getDepositReserveValidatorPubkey().call();
    }


    // Get the deposit reservation validator signature
    public getDepositReservationValidatorSignature(): Promise<string> {
        return this.contract.methods.getDepositReserveValidatorSignature().call();
    }


    /**
     * Mutators - Restricted to the node owner address
     */


    // Set the node's rewards address
    public setRewardsAddress(address: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.setRewardsAddress(address).send(options),
            onConfirmation
        );
    }


    // Make a deposit reservation
    public reserveDeposit(durationId: string, validatorPubkey: Buffer, validatorSignature: Buffer, validatorDepositDataRoot: Buffer, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.depositReserve(durationId, validatorPubkey, validatorSignature, validatorDepositDataRoot).send(options),
            onConfirmation
        );
    }


    // Cancel a deposit reservation
    public cancelDepositReservation(options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.depositReserveCancel().send(options),
            onConfirmation
        );
    }


    // Can complete a deposit
    public completeDeposit(options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.deposit().send(options),
            onConfirmation
        );
    }


    // Withdraw a deposit from an initialised, timed out or withdrawn minipool
    public withdrawMinipoolDeposit(minipoolAddress: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.withdrawMinipoolDeposit(minipoolAddress).send(options),
            onConfirmation
        );
    }


    // Withdraw ETH from the node contract
    public withdrawEth(weiAmount: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.withdrawEther(weiAmount).send(options),
            onConfirmation
        );
    }


    // Withdraw RPL from the node contract
    public withdrawRpl(weiAmount: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.withdrawRPL(weiAmount).send(options),
            onConfirmation
        );
    }


}


// Exports
export default NodeContract;
