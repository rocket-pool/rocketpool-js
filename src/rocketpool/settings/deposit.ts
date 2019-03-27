// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
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


    // Get whether deposits are currently allowed
    public getDepositAllowed(): Promise<boolean> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<boolean> => {
            return rocketDepositSettings.methods.getDepositAllowed().call();
        });
    }


    // Get the deposit chunk size in wei
    public getDepositChunkSize(): Promise<string> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<string> => {
            return rocketDepositSettings.methods.getDepositChunkSize().call();
        });
    }


    // Get the minimum deposit amount in wei
    public getDepositMin(): Promise<string> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<string> => {
            return rocketDepositSettings.methods.getDepositMin().call();
        });
    }


    // Get the maximum deposit amount in wei
    public getDepositMax(): Promise<string> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<string> => {
            return rocketDepositSettings.methods.getDepositMax().call();
        });
    }


    // Get the maximum number of chunks assigned at once
    public getChunkAssignMax(): Promise<number> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<string> => {
            return rocketDepositSettings.methods.getChunkAssignMax().call();
        }).then((chunkAssignMax: string): number => {
            return parseInt(chunkAssignMax);
        });
    }


    // Get the maximum deposit queue size in wei
    public getDepositQueueSizeMax(): Promise<string> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<string> => {
            return rocketDepositSettings.methods.getDepositQueueSizeMax().call();
        });
    }


    // Get whether deposit refunds are currently allowed
    public getRefundDepositAllowed(): Promise<boolean> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<boolean> => {
            return rocketDepositSettings.methods.getRefundDepositAllowed().call();
        });
    }


    // Get whether withdrawals are currently allowed
    public getWithdrawalAllowed(): Promise<boolean> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<boolean> => {
            return rocketDepositSettings.methods.getWithdrawalAllowed().call();
        });
    }


    // Get the minimum withdrawal amount in wei
    public getWithdrawalMin(): Promise<string> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<string> => {
            return rocketDepositSettings.methods.getWithdrawalMin().call();
        });
    }


    // Get the maximum withdrawal amount in wei
    public getWithdrawalMax(): Promise<string> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<string> => {
            return rocketDepositSettings.methods.getWithdrawalMax().call();
        });
    }


    // Get the fee for withdrawing from the minipool while staking, as a fraction
    public getStakingWithdrawalFeePerc(): Promise<number> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<string> => {
            return rocketDepositSettings.methods.getStakingWithdrawalFeePerc().call();
        }).then((withdrawalFeePerc: string): number => {
            return parseFloat(this.web3.utils.fromWei(withdrawalFeePerc, 'ether'));
        });
    }


    // Get the current maximum deposit amount in wei
    public getCurrentDepositMax(durationId: string): Promise<string> {
        return this.rocketDepositSettings.then((rocketDepositSettings): Promise<string> => {
            return rocketDepositSettings.methods.getCurrentDepositMax(durationId).call();
        });
    }


}


// Exports
export default DepositSettings;
