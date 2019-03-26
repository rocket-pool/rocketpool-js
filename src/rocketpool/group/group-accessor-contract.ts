// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { Tx } from 'web3/eth/types';
import { TransactionReceipt } from 'web3/types';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


/**
 * RocketGroupContract instance wrapper
 */
class GroupAccessorContract {


    // Constructor
    public constructor(private web3: Web3, private contract: Contract) {}


    /**
     * Mutators - Public
     */


    // Make a deposit
    public deposit(durationId: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.deposit(durationId).send(options),
            onConfirmation
        );
    }


    // Refund a queued deposit
    public refundQueuedDeposit(durationId: string, depositId: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.refundDepositQueued(durationId, depositId).send(options),
            onConfirmation
        );
    }


    // Refund a deposit from a stalled minipool
    public refundStalledMinipoolDeposit(depositId: string, minipoolAddress: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.refundDepositMinipoolStalled(depositId, minipoolAddress).send(options),
            onConfirmation
        );
    }


    // Withdraw a deposit from a staking minipool
    public withdrawStakingMinipoolDeposit(depositId: string, minipoolAddress: string, weiAmount: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.withdrawDepositMinipoolStaking(depositId, minipoolAddress, weiAmount).send(options),
            onConfirmation
        );
    }


    // Withdraw a deposit from a withdrawn minipool
    public withdrawMinipoolDeposit(depositId: string, minipoolAddress: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return handleConfirmations(
            this.contract.methods.withdrawDepositMinipool(depositId, minipoolAddress).send(options),
            onConfirmation
        );
    }


}


// Exports
export default GroupAccessorContract;
