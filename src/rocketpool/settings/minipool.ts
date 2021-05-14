// Imports
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool minipool settings manager
 */
class MinipoolSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDAOProtocolSettingsMinipool(): Promise<Contract> {
        return this.contracts.get('rocketDAOProtocolSettingsMinipool');
    }


    /**
     * Getters
     */
    // Balance required to launch minipool in wei
    public getLaunchBalance(): Promise<string> {
        return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsMinipool.methods.getLaunchBalance().call();
        });
    }


    // Required node deposit amounts in wei
    public getFullDepositNodeAmount(): Promise<string> {
        return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsMinipool.methods.getFullDepositNodeAmount().call();
        });
    }


    public getHalfDepositNodeAmount(): Promise<string> {
        return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsMinipool.methods.getHalfDepositNodeAmount().call();
        });
    }


    public getEmptyDepositNodeAmount(): Promise<string> {
        return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsMinipool.methods.getEmptyDepositNodeAmount().call();
        });
    }


    // Required user deposit amounts in wei
    public getFullDepositUserAmount(): Promise<string> {
        return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsMinipool.methods.getFullDepositUserAmount().call();
        });
    }


    public getHalfDepositUserAmount(): Promise<string> {
        return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsMinipool.methods.getHalfDepositUserAmount().call();
        });
    }


    public getEmptyDepositUserAmount(): Promise<string> {
        return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsMinipool.methods.getEmptyDepositUserAmount().call();
        });
    }


    // Minipool withdrawable event submissions are currently enabled
    public getSubmitWithdrawableEnabled(): Promise<boolean> {
        return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<boolean> => {
            return rocketDAOProtocolSettingsMinipool.methods.getSubmitWithdrawableEnabled().call();
        });
    }


    // Timeout period in blocks for prelaunch minipools to launch
    public getLaunchTimeout(): Promise<number> {
        return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsMinipool.methods.getLaunchTimeout().call();
        }).then((value: string): number => parseInt(value));
    }


    // Withdrawal delay in blocks before withdrawable minipools can be closed
    public getWithdrawalDelay(): Promise<number> {
        return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsMinipool.methods.getWithdrawalDelay().call();
        }).then((value: string): number => parseInt(value));
    }


}


// Exports
export default MinipoolSettings;
