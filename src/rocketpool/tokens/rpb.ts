// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { Tx } from 'web3/eth/types';
import { TransactionReceipt } from 'web3/types';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';
import ERC20 from './ERC20';


/**
 * Rocket Pool RPB token manager
 */
class RPB extends ERC20 {


    // Constructor
    public constructor(web3: Web3, contracts: Contracts) {
        super(web3, contracts, 'rocketBETHToken');
    }


    /**
     * Mutators - Public
     */


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
