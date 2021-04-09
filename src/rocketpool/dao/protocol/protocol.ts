// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Contracts from '../../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../../utils/transaction';


/**
 * Rocket Pool deposit pool manager
 */
class DAOProtocol {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDAOProtocol(): Promise<Contract> {
        return this.contracts.get('rocketDAOProtocol');
    }


    /**
     * Getters
     */

    // Returns true if bootstrap mode is disabled
    public getBoostrapModeDisabled(): Promise<string> {
        return this.rocketDAOProtocol.then((rocketDAOProtocol: Contract): Promise<string> => {
            return rocketDAOProtocol.methods.getBootstrapModeDisabled().call();
        });
    }


    /**
     * Mutators - Public
     */

    // Bootstrap mode - Uint Setting
    public bootstrapUint(settingPath: string, value: number, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDAOProtocol.then((rocketDAOProtocol: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDAOProtocol.methods.bootstrapSettingUint(settingPath, value).send(options),
                onConfirmation
            );
        });
    }

    // Bootstrap mode - Bool Setting
    public bootstrapBool(settingPath: string, value: boolean, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDAOProtocol.then((rocketDAOProtocol: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDAOProtocol.methods.bootstrapSettingBool(settingPath, value).send(options),
                onConfirmation
            );
        });
    }

    // Bootstrap mode - Address Setting
    public bootstrapAddress(settingPath: string, value: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketDAOProtocol.then((rocketDAOProtocol: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketDAOProtocol.methods.bootstrapAddress(settingPath, value).send(options),
                onConfirmation
            );
        });
    }

}


// Exports
export default DAOProtocol;
