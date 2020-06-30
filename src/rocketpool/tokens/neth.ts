// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core/types';
import { Contract, SendOptions } from 'web3-eth-contract/types';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';
import ERC20 from './erc20';


/**
 * Rocket Pool NETH token manager
 */
class NETH extends ERC20 {


    // Constructor
    public constructor(web3: Web3, contracts: Contracts) {
        super(web3, contracts, 'RocketNodeETHToken');
    }


    /**
     * Mutators - Public
     */


    // Burn nETH for ETH
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
export default NETH;
