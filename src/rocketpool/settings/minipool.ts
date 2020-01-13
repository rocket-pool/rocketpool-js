// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


// Staking duration details
export interface StakingDurationDetails {
    id: string;
    exists: boolean;
    epochs: number;
    enabled: boolean;
}


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
        }).then((value: string): number => parseInt(value));
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
        }).then((value: string): number => parseInt(value));
    }


    // Get the maximum size of the active minipool set
    public getMinipoolActiveSetSize(): Promise<number> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getMinipoolActiveSetSize().call();
        }).then((value: string): number => parseInt(value));
    }


    // Get the minipool staking durations
    public getMinipoolStakingDurations(): Promise<StakingDurationDetails[]> {
        return this.getMinipoolStakingDurationCount().then((count: number): Promise<string[]> => {
            return Promise.all([...Array(count).keys()].map((di: number): Promise<string> => {
                return this.getMinipoolStakingDurationAt(di);
            }));
        }).then((durationIds: string[]): Promise<StakingDurationDetails[]> => {
            return Promise.all(durationIds.map((durationId: string): Promise<StakingDurationDetails> => this.getMinipoolStakingDuration(durationId)));
        });
    }


    // Get the details for a minipool staking duration
    public getMinipoolStakingDuration(id: string): Promise<StakingDurationDetails> {
        return Promise.all([
            this.getMinipoolStakingDurationExists(id),
            this.getMinipoolStakingDurationEpochs(id),
            this.getMinipoolStakingDurationEnabled(id),
        ]).then(([exists, epochs, enabled]: [boolean, number, boolean]): StakingDurationDetails => {
            return {id, exists, epochs, enabled};
        });
    }


    // Get the minipool staking duration count
    public getMinipoolStakingDurationCount(): Promise<number> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getMinipoolStakingDurationCount().call();
        }).then((value: string): number => parseInt(value));
    }


    // Get the minipool staking duration ID by index
    public getMinipoolStakingDurationAt(index: number): Promise<string> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getMinipoolStakingDurationAt(index).call();
        });
    }


    // Get whether a minipool staking duration exists
    public getMinipoolStakingDurationExists(id: string): Promise<boolean> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<boolean> => {
            return rocketMinipoolSettings.methods.getMinipoolStakingDurationExists(id).call();
        });
    }


    // Get the number of epochs for a minipool staking duration
    public getMinipoolStakingDurationEpochs(id: string): Promise<number> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<string> => {
            return rocketMinipoolSettings.methods.getMinipoolStakingDurationEpochs(id).call();
        }).then((value: string): number => parseInt(value));
    }


    // Get whether a minipool staking duration is enabled
    public getMinipoolStakingDurationEnabled(id: string): Promise<boolean> {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings: Contract): Promise<boolean> => {
            return rocketMinipoolSettings.methods.getMinipoolStakingDurationEnabled(id).call();
        });
    }


}


// Exports
export default MinipoolSettings;
