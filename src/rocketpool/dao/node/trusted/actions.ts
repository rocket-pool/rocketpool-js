// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Contracts from '../../../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../../../utils/transaction';


/**
 * Rocket Pool DAO Trusted Node Actions
 */
class DAONodeTrustedActions {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDAONodeTrustedActions(): Promise<Contract> {
        return this.contracts.get('rocketDAONodeTrustedActions');
    }


    /**
     * Getters
     */



    /**
     * Mutators - Public
     */

    // Join the DAO
    public actionJoin(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDAONodeTrustedActions.then((rocketDAONodeTrustedActions: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDAONodeTrustedActions.methods.actionJoin().send(options),
                onConfirmation
            );
        });
    }

    // Leave the DAO
    public actionLeave(refundAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDAONodeTrustedActions.then((rocketDAONodeTrustedActions: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDAONodeTrustedActions.methods.actionLeave(refundAddress).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default DAONodeTrustedActions;
