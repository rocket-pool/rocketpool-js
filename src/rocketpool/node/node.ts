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


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketNodeAPI(): Promise<Contract> {
        return this.contracts.get('rocketNodeAPI');
    }


    /**
     * Getters
     */


    // Get the timezone location of a node
    public getTimezoneLocation(nodeOwner: string): Promise<string> {
        return this.rocketNodeAPI.then((rocketNodeAPI: Contract): Promise<string> => {
            return rocketNodeAPI.methods.getTimezoneLocation(nodeOwner).call();
        });
    }


    /**
     * Mutators - Public
     */


    // Register a node
    public add(timezone: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeAPI.then((rocketNodeAPI: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeAPI.methods.add(timezone).send(options),
                onConfirmation
            );
        });
    }


    /**
     * Mutators - Restricted (to the node owner address)
     */


    // Set a node's timezone location
    public setTimezoneLocation(timezone: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeAPI.then((rocketNodeAPI: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeAPI.methods.setTimezoneLocation(timezone).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default Node;
