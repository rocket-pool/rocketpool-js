// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Contracts from '../../../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../../../utils/transaction';


/**
 * Rocket Pool DAO Trusted Node
 */
class DAONodeTrusted {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDAONodeTrusted(): Promise<Contract> {
        return this.contracts.get('rocketDAONodeTrusted');
    }


    /**
     * Getters
     */

    // Get the number of DAO Members
    public getMemberCount(): Promise<number> {
        return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<number> => {
            return rocketDAONodeTrusted.methods.getMemberCount().call();
        });
    }



    /**
     * Mutators - Public
     */



}


// Exports
export default DAONodeTrusted;
