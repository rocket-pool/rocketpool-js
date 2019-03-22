// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { Tx } from 'web3/eth/types';
import { TransactionReceipt } from 'web3/types';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


/**
 * Rocket Pool node manager
 */
class Node {


    // Contracts
    private rocketNodeAPI: Promise<Contract>;


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {
        this.rocketNodeAPI = this.contracts.get('rocketNodeAPI');
    }


    // Register a node
    public add(timezone: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeAPI.then((rocketNodeAPI: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeAPI.methods.add(timezone).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default Node;
