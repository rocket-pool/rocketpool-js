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

    // Get member id given an address
    public getMemberID(address: string): Promise<string> {
        return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<string> => {
            return rocketDAONodeTrusted.methods.getMemberID(address).call();
        });
    }


    // Get the number of DAO Members
    public getMemberCount(): Promise<number> {
        return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<number> => {
            return rocketDAONodeTrusted.methods.getMemberCount().call();
        });
    }


    // Check if Bootstrap Mode is enabled
    public getBootstrapModeDisabled(): Promise<boolean> {
        return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<boolean> => {
            return rocketDAONodeTrusted.methods.getBootstrapModeDisabled().call();
        });
    }



    /**
     * Mutators - Public
     */
    // Bootstrap a DAO Member
    public bootstrapMember(id: string, email: string, nodeAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDAONodeTrusted.methods.bootstrapMember(id, email, nodeAddress).send(options),
                onConfirmation
            );
        });
    }


    // Bootstrap a Boolean Setting
    public bootstrapSettingBool(settingContractInstance: string, settingPath: string, value: boolean, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDAONodeTrusted.methods.bootstrapSettingBool(settingContractInstance, settingPath, value).send(options),
                onConfirmation
            );
        });
    }


    // Bootstrap disable
    public bootstrapDisable(value: boolean, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDAONodeTrusted.methods.bootstrapDisable(value).send(options),
                onConfirmation
            );
        });
    }


    // Bootstrap disable
    public memberJoinRequired(id: string, email: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDAONodeTrusted.methods.memberJoinRequired(id, email).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default DAONodeTrusted;
