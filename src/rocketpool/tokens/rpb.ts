// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { Tx } from 'web3/eth/types';
import { TransactionReceipt } from 'web3/types';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


/**
 * Rocket Pool RPB token manager
 */
class RPB {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessor
    protected get tokenContract(): Promise<Contract> {
        return this.contracts.get('rocketBETHToken');
    }


    /**
     * Getters
     */


    // Get the token balance of an account
    public balanceOf(account: string): Promise<string> {
        return this.tokenContract.then((tokenContract: Contract): Promise<string> => {
            return tokenContract.methods.balanceOf(account).call();
        });
    }


    // Get the allowance of a spender for an account
    public allowance(account: string, spender: string): Promise<string> {
        return this.tokenContract.then((tokenContract: Contract): Promise<string> => {
            return tokenContract.methods.allowance(account, spender).call();
        });
    }


    /**
     * Mutators - Public
     */


    // Transfer tokens to a recipient
    public transfer(to: string, amountWei: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.tokenContract.then((tokenContract: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                tokenContract.methods.transfer(to, amountWei).send(options),
                onConfirmation
            );
        });
    }


    // Approve an allowance for a spender
    public approve(spender: string, amountWei: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.tokenContract.then((tokenContract: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                tokenContract.methods.approve(spender, amountWei).send(options),
                onConfirmation
            );
        });
    }


    // Transfer tokens from an account to a recipient if approved
    public transferFrom(from: string, to: string, amountWei: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.tokenContract.then((tokenContract: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                tokenContract.methods.transferFrom(from, to, amountWei).send(options),
                onConfirmation
            );
        });
    }


    // Burn RPB for ETH
    public burnForEth(amountWei: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.tokenContract.then((tokenContract: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                tokenContract.methods.burnTokensForEther(amountWei).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default RPB;
