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
    private get rocketMinipoolSettings(): Promise<Contract> {
        return this.contracts.get('rocketMinipoolSettings');
    }


    /**
     * Getters
     */


    // Balance required to launch minipool in wei
    public getLaunchBalance(): Promise<string> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getLaunchBalance().call();
        });
    }


    // Required node deposit amounts in wei
    public getFullDepositNodeAmount(): Promise<string> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getFullDepositNodeAmount().call();
        });
    }
    public getHalfDepositNodeAmount(): Promise<string> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getHalfDepositNodeAmount().call();
        });
    }
    public getEmptyDepositNodeAmount(): Promise<string> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getEmptyDepositNodeAmount().call();
        });
    }


    // Required user deposit amounts in wei
    public getFullDepositUserAmount(): Promise<string> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getFullDepositUserAmount().call();
        });
    }
    public getHalfDepositUserAmount(): Promise<string> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getHalfDepositUserAmount().call();
        });
    }
    public getEmptyDepositUserAmount(): Promise<string> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getEmptyDepositUserAmount().call();
        });
    }


    // Minipool exited event submissions are currently enabled
    public getSubmitExitedEnabled(): Promise<boolean> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<boolean> => {
            return rocketMinipoolSettings.methods.getSubmitExitedEnabled().call();
        });
    }


    // Minipool withdrawable event submissions are currently enabled
    public getSubmitWithdrawableEnabled(): Promise<boolean> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<boolean> => {
            return rocketMinipoolSettings.methods.getSubmitWithdrawableEnabled().call();
        });
    }


    // Timeout period in blocks for prelaunch minipools to launch
    public getLaunchTimeout(): Promise<number> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getLaunchTimeout().call();
        }).then((value: string): number => parseInt(value));
    }


    // Withdrawal delay in blocks before withdrawable minipools can be closed
    public getWithdrawalDelay(): Promise<number> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getWithdrawalDelay().call();
        }).then((value: string): number => parseInt(value));
    }


}


// Exports
export default MinipoolSettings;
