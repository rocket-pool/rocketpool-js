// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { Tx } from 'web3/eth/types';
import { TransactionReceipt } from 'web3/types';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


/**
 * RocketNodeContract instance wrapper
 */
class NodeContract {


    // Constructor
    public constructor(private web3: Web3, private contract: Contract) {}


    /**
     * Getters
     */


    /**
     * Mutators - Restricted (to the node owner address)
     */


}


// Exports
export default NodeContract;
