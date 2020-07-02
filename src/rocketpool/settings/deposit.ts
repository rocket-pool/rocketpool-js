// Imports
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool deposit settings manager
 */
class DepositSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDepositSettings(): Promise<Contract> {
        return this.contracts.get('rocketDepositSettings');
    }


    /**
     * Getters
     */


    // Deposits are currently enabled
    public getDepositEnabled(): Promise<boolean> {
        return this.rocketDepositSettings.then((rocketDepositSettings: Contract): Promise<boolean> => {
            return rocketDepositSettings.methods.getDepositEnabled().call();
        });
    }


    // Deposit assignments are currently enabled
    public getAssignDepositsEnabled(): Promise<boolean> {
        return this.rocketDepositSettings.then((rocketDepositSettings: Contract): Promise<boolean> => {
            return rocketDepositSettings.methods.getAssignDepositsEnabled().call();
        });
    }


    // Minimum deposit amount in wei
    public getMinimumDeposit(): Promise<string> {
        return this.rocketDepositSettings.then((rocketDepositSettings: Contract): Promise<string> => {
            return rocketDepositSettings.methods.getMinimumDeposit().call();
        });
    }


    // Maximum deposit pool size in wei
    public getMaximumDepositPoolSize(): Promise<string> {
        return this.rocketDepositSettings.then((rocketDepositSettings: Contract): Promise<string> => {
            return rocketDepositSettings.methods.getMaximumDepositPoolSize().call();
        });
    }


    // Maximum number of deposit assignments to perform at once
    public getMaximumDepositAssignments(): Promise<number> {
        return this.rocketDepositSettings.then((rocketDepositSettings: Contract): Promise<string> => {
            return rocketDepositSettings.methods.getMaximumDepositAssignments().call();
        }).then((value: string): number => parseInt(value));
    }


}


// Exports
export default DepositSettings;
