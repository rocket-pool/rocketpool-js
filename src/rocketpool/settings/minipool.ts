// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
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


    // Get the total deposit amount required to launch a minipool in wei
    public getMinipoolLaunchAmount(): Promise<string> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getMinipoolLaunchAmount().call();
        });
    }


    // Get whether new minipools can currently be created
    public getMinipoolCanBeCreated(): Promise<boolean> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<boolean> => {
            return rocketMinipoolSettings.methods.getMinipoolCanBeCreated().call();
        });
    }


    // Get whether new minipool creation is currently allowed
    public getMinipoolNewEnabled(): Promise<boolean> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<boolean> => {
            return rocketMinipoolSettings.methods.getMinipoolNewEnabled().call();
        });
    }


    // Get whether minipool closure is currently allowed
    public getMinipoolClosingEnabled(): Promise<boolean> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<boolean> => {
            return rocketMinipoolSettings.methods.getMinipoolClosingEnabled().call();
        });
    }


    // Get the maximum number of active minipools
    public getMinipoolMax(): Promise<number> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getMinipoolMax().call();
        }).then((minipoolMax: string): number => {
            return parseInt(minipoolMax);
        });
    }


    // Get the minipool withdrawal fee payment address
    public getMinipoolWithdrawalFeeDepositAddress(): Promise<string> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getMinipoolWithdrawalFeeDepositAddress().call();
        });
    }


    // Get the minipool timeout duration in seconds
    public getMinipoolTimeout(): Promise<number> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getMinipoolTimeout().call();
        }).then((minipoolTimeout: string): number => {
            return parseInt(minipoolTimeout);
        });
    }


    // Get the maximum size of the active minipool set
    public getMinipoolActiveSetSize(): Promise<number> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getMinipoolActiveSetSize().call();
        }).then((activeSetSize: string): number => {
            return parseInt(activeSetSize);
        });
    }


    // Get the minipool staking duration by ID in blocks
    public getMinipoolStakingDuration(durationId: string): Promise<number> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getMinipoolStakingDuration(durationId).call();
        }).then((stakingDuration: string): number => {
            return parseInt(stakingDuration);
        });
    }


}


// Exports
export default MinipoolSettings;
