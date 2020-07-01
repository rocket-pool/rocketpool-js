// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core/types';
import { Contract, SendOptions } from 'web3-eth-contract/types';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';
import ERC20 from './erc20';


/**
 * Rocket Pool RETH token manager
 */
class RETH extends ERC20 {


    // Constructor
    public constructor(web3: Web3, contracts: Contracts) {
        super(web3, contracts, 'RocketETHToken');
    }


    /**
     * Getters
     */


    // Get the current ETH : rETH exchange rate
    // Returns the amount of ETH backing 1 rETH
    public getExchangeRate(): Promise<number> {
        return this.tokenContract.then((tokenContract: Contract): Promise<string> => {
            return tokenContract.methods.getExchangeRate().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Get the current ETH collateral rate
    // Returns the portion of rETH backed by ETH in the contract as a fraction
    public getCollateralRate(): Promise<number> {
        return this.tokenContract.then((tokenContract: Contract): Promise<string> => {
            return tokenContract.methods.getCollateralRate().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    /**
     * Mutators - Public
     */


    // Burn rETH for ETH
    public burn(amountWei: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.tokenContract.then((tokenContract: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                tokenContract.methods.burn(amountWei).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default RETH;
