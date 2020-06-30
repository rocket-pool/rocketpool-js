// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core/types';
import { Contract, SendOptions } from 'web3-eth-contract/types';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';
import MinipoolContract from './minipool-contract';


/**
 * Rocket Pool minipool manager
 */
class Minipool {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketMinipoolManager(): Promise<Contract> {
        return this.contracts.get('rocketMinipoolManager');
    }
    private get rocketMinipoolQueue(): Promise<Contract> {
        return this.contracts.get('rocketMinipoolQueue');
    }
    private get rocketMinipoolStatus(): Promise<Contract> {
        return this.contracts.get('rocketMinipoolStatus');
    }


    /**
     * Getters
     */


    // Get the total minipool count
    public getMinipoolCount(): Promise<number> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
            return rocketMinipoolManager.methods.getMinipoolCount.call();
        }).then((value: string): number => parseInt(value));
    }


    // Get a minipool address by index
    public getMinipoolAt(index: number): Promise<string> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
            return rocketMinipoolManager.methods.getMinipoolAt(index).call();
        });
    }


    // Get a node's total minipool count
    public getNodeMinipoolCount(nodeAddress: string): Promise<number> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
            return rocketMinipoolManager.methods.getNodeMinipoolCount(nodeAddress).call();
        }).then((value: string): number => parseInt(value));
    }


    // Get a node's minipool address by index
    public getNodeMinipoolAt(nodeAddress: string, index: number): Promise<string> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
            return rocketMinipoolManager.methods.getNodeMinipoolAt(nodeAddress, index).call();
        });
    }


    // Get a minipool address by validator pubkey
    public getMinipoolByPubkey(validatorPubkey: Buffer): Promise<string> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
            return rocketMinipoolManager.methods.getMinipoolByPubkey(validatorPubkey).call();
        });
    }


    // Check whether a minipool exists
    public getMinipoolExists(minipoolAddress: string): Promise<boolean> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<boolean> => {
            return rocketMinipoolManager.methods.getMinipoolExists(minipoolAddress).call();
        });
    }


    // Get a minipool's validator pubkey
    public getMinipoolPubkey(minipoolAddress: string): Promise<string> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
            return rocketMinipoolManager.methods.getMinipoolPubkey(minipoolAddress).call();
        });
    }


    // Get a minipool's total balance at withdrawal in wei
    public getMinipoolWithdrawalTotalBalance(minipoolAddress: string): Promise<string> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
            return rocketMinipoolManager.methods.getMinipoolWithdrawalTotalBalance(minipoolAddress).call();
        });
    }


    // Get a minipool's node balance at withdrawal in wei
    public getMinipoolWithdrawalNodeBalance(minipoolAddress: string): Promise<string> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
            return rocketMinipoolManager.methods.getMinipoolWithdrawalNodeBalance(minipoolAddress).call();
        });
    }


    // Check whether a minipool is withdrawable
    public getMinipoolWithdrawable(minipoolAddress: string): Promise<boolean> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<boolean> => {
            return rocketMinipoolManager.methods.getMinipoolWithdrawable(minipoolAddress).call();
        });
    }


    // Check whether a minipool's validator withdrawal has been processed
    public getMinipoolWithdrawalProcessed(minipoolAddress: string): Promise<boolean> {
        return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<boolean> => {
            return rocketMinipoolManager.methods.getMinipoolWithdrawalProcessed(minipoolAddress).call();
        });
    }


    // Get the total minipool queue length
    public getQueueTotalLength(): Promise<number> {
        return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<string> => {
            return rocketMinipoolQueue.methods.getTotalLength.call();
        }).then((value: string): number => parseInt(value));
    }


    // Get the total capacity of queued minipools in wei
    public getQueueTotalCapacity(): Promise<string> {
        return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<string> => {
            return rocketMinipoolQueue.methods.getTotalCapacity.call();
        });
    }


    // Get the effective capacity of queued minipools in wei (used in node demand calculations)
    public getQueueEffectiveCapacity(): Promise<string> {
        return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<string> => {
            return rocketMinipoolQueue.methods.getEffectiveCapacity.call();
        });
    }


    // Get the capacity of the next available minipool in wei
    public getQueueNextCapacity(): Promise<string> {
        return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<string> => {
            return rocketMinipoolQueue.methods.getNextCapacity.call();
        });
    }


    // Get a MinipoolContract instance
    public getMinipoolContract(address: string): Promise<MinipoolContract> {
        return this.contracts.make('rocketMinipool', address).then((rocketMinipool: Contract): MinipoolContract => {
            return new MinipoolContract(this.web3, rocketMinipool);
        });
    }


    /**
     * Mutators - Restricted to trusted nodes
     */


    // Submit a minipool exited event
    public submitMinipoolExited(minipoolAddress: string, epoch: number, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketMinipoolStatus.then((rocketMinipoolStatus: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketMinipoolStatus.methods.submitMinipoolExited(minipoolAddress, epoch).send(options),
                onConfirmation
            );
        });
    }


    // Submit a minipool withdrawable event
    public submitMinipoolWithdrawable(minipoolAddress: string, withdrawalBalance: string, epoch: number, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketMinipoolStatus.then((rocketMinipoolStatus: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketMinipoolStatus.methods.submitMinipoolWithdrawable(minipoolAddress, withdrawalBalance, epoch).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default Minipool;
