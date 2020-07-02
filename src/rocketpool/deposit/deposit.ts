// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


/**
 * Rocket Pool deposit pool manager
 */
class Deposit {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDepositPool(): Promise<Contract> {
        return this.contracts.get('rocketDepositPool');
    }


    /**
     * Getters
     */


    // Get the current deposit pool balance in wei
    public getBalance(): Promise<string> {
        return this.rocketDepositPool.then((rocketDepositPool: Contract): Promise<string> => {
            return rocketDepositPool.methods.getBalance().call();
        });
    }


    /**
     * Mutators - Public
     */


    // Make a deposit
    public deposit(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDepositPool.then((rocketDepositPool: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDepositPool.methods.deposit().send(options),
                onConfirmation
            );
        });
    }


    // Assign deposits
    public assignDeposits(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDepositPool.then((rocketDepositPool: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDepositPool.methods.assignDeposits().send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default Deposit;
