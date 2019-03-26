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


}


// Exports
export default GroupAccessorContract;
