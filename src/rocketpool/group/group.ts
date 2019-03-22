// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { Tx } from 'web3/eth/types';
import { TransactionReceipt } from 'web3/types';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


/**
 * Rocket Pool groups manager
 */
class Group {


    // Contracts
    private rocketGroupAPI: Promise<Contract>;


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {
        this.rocketGroupAPI = this.contracts.get('rocketGroupAPI');
    }


    // Register a group
    public add(name: string, stakingFeeFraction: number, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketGroupAPI.then((rocketGroupAPI: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketGroupAPI.methods.add(name, this.web3.utils.toWei(stakingFeeFraction.toString(), 'ether')).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default Group;
