// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';


// Minipool node details
export interface NodeDetails {
    owner: string;
    contract: string;
    depositEth: string;
    depositRpl: string;
    trusted: boolean;
    depositExists: boolean;
    balance: string;
}


// Minipool deposit details
export interface DepositDetails {
    exists: boolean;
    userId: string;
    groupId: string;
    balance: string;
    stakingTokensWithdrawn: string;
}


// Minipool status details
export interface StatusDetails {
    status: number;
    statusChangedTime: Date;
    statusChangedBlock: number;
    stakingDurationId: string;
    stakingDuration: number;
    validatorPubkey: string;
    validatorSignature: string;
    userDepositCapacity: string;
    userDepositTotal: string;
    stakingUserDepositsWithdrawn: string;
}


/**
 * RocketMinipool contract instance wrapper
 */
class MinipoolContract {


    // Constructor
    public constructor(private web3: Web3, private contract: Contract) {}


    /**
     * Getters - Node
     */


    // Get all node details
    public getNodeDetails(): Promise<NodeDetails> {
        return Promise.all([
            this.getNodeOwner(),
            this.getNodeContract(),
            this.getNodeDepositEth(),
            this.getNodeDepositRpl(),
            this.getNodeTrusted(),
            this.getNodeDepositExists(),
            this.getNodeBalance(),
        ]).then(([owner, contract, depositEth, depositRpl, trusted, depositExists, balance]: [string, string, string, string, boolean, boolean, string]): NodeDetails => {
            return {owner, contract, depositEth, depositRpl, trusted, depositExists, balance};
        });
    }


    // Get the node owner's address
    public getNodeOwner(): Promise<string> {
        return this.contract.methods.getNodeOwner().call();
    }


    // Get the node contract address
    public getNodeContract(): Promise<string> {
        return this.contract.methods.getNodeContract().call();
    }


    // Get the amount of ETH to be deposited by the node owner in wei
    public getNodeDepositEth(): Promise<string> {
        return this.contract.methods.getNodeDepositEther().call();
    }


    // Get the amount of RPL to be deposited by the node owner in wei
    public getNodeDepositRpl(): Promise<string> {
        return this.contract.methods.getNodeDepositRPL().call();
    }


    // Get whether the node was trusted when the minipool was created
    public getNodeTrusted(): Promise<boolean> {
        return this.contract.methods.getNodeTrusted().call();
    }


    // Get whether the node owner's deposit currently exists
    public getNodeDepositExists(): Promise<boolean> {
        return this.contract.methods.getNodeDepositExists().call();
    }


    // Get the node owner's deposited ETH balance in wei
    public getNodeBalance(): Promise<string> {
        return this.contract.methods.getNodeBalance().call();
    }


    /**
     * Getters - Deposits
     */


    // Get the number of deposits in the minipool
    public getDepositCount(): Promise<number> {
        return this.contract.methods.getDepositCount().call().then((value: string): number => parseInt(value));
    }


    // Get all deposit details
    public getDepositDetails(depositId: string): Promise<DepositDetails> {
        return Promise.all([
            this.getDepositExists(depositId),
            this.getDepositUserID(depositId),
            this.getDepositGroupID(depositId),
            this.getDepositBalance(depositId),
            this.getDepositStakingTokensWithdrawn(depositId),
        ]).then(([exists, userId, groupId, balance, stakingTokensWithdrawn]: [boolean, string, string, string, string]): DepositDetails => {
            return {exists, userId, groupId, balance, stakingTokensWithdrawn};
        });
    }


    // Get whether a deposit exists in the minipool
    public getDepositExists(depositId: string): Promise<boolean> {
        return this.contract.methods.getDepositExists(depositId).call();
    }


    // Get the user ID of a deposit
    public getDepositUserID(depositId: string): Promise<string> {
        return this.contract.methods.getDepositUserID(depositId).call();
    }


    // Get the group ID of a deposit
    public getDepositGroupID(depositId: string): Promise<string> {
        return this.contract.methods.getDepositGroupID(depositId).call();
    }


    // Get the current balance of a deposit
    public getDepositBalance(depositId: string): Promise<string> {
        return this.contract.methods.getDepositBalance(depositId).call();
    }


    // Get the amount of RETH tokens withdrawn from a deposit while staking in wei
    public getDepositStakingTokensWithdrawn(depositId: string): Promise<string> {
        return this.contract.methods.getDepositStakingTokensWithdrawn(depositId).call();
    }


    /**
     * Getters - Status
     */


    // Get all status details
    public getStatusDetails(): Promise<StatusDetails> {
        return Promise.all([
            this.getStatus(),
            this.getStatusChangedTime(),
            this.getStatusChangedBlock(),
            this.getStakingDurationId(),
            this.getStakingDuration(),
            this.getValidatorPubkey(),
            this.getValidatorSignature(),
            this.getUserDepositCapacity(),
            this.getUserDepositTotal(),
            this.getStakingUserDepositsWithdrawn(),
        ]).then(([
            status, statusChangedTime, statusChangedBlock, stakingDurationId, stakingDuration,
            validatorPubkey, validatorSignature, userDepositCapacity, userDepositTotal, stakingUserDepositsWithdrawn
        ]: [number, Date, number, string, number, string, string, string, string, string]): StatusDetails => {
            return {
                status, statusChangedTime, statusChangedBlock, stakingDurationId, stakingDuration,
                validatorPubkey, validatorSignature, userDepositCapacity, userDepositTotal, stakingUserDepositsWithdrawn
            };
        });
    }


    // Get the current minipool status
    public getStatus(): Promise<number> {
        return this.contract.methods.getStatus().call();
    }


    // Get the time the status was last updated
    public getStatusChangedTime(): Promise<Date> {
        return this.contract.methods.getStatusChangedTime().call().then((value: string): Date => new Date(parseInt(value) * 1000));
    }


    // Get the block the status was last updated at
    public getStatusChangedBlock(): Promise<number> {
        return this.contract.methods.getStatusChangedBlock().call().then((value: string): number => parseInt(value));
    }


    // Get the minipool's staking duration ID
    public getStakingDurationId(): Promise<string> {
        return this.contract.methods.getStakingDurationID().call();
    }


    // Get the minipool's staking duration in blocks
    public getStakingDuration(): Promise<number> {
        return this.contract.methods.getStakingDuration().call().then((value: string): number => parseInt(value));
    }


    // Get the minipool's validator pubkey for submission to Casper
    public getValidatorPubkey(): Promise<string> {
        return this.contract.methods.getValidatorPubkey().call();
    }


    // Get the minipool's validator pubkey for submission to Casper
    public getValidatorSignature(): Promise<string> {
        return this.contract.methods.getValidatorSignature().call();
    }


    // Get the minipool's total capacity for user deposits in wei
    public getUserDepositCapacity(): Promise<string> {
        return this.contract.methods.getUserDepositCapacity().call();
    }


    // Get the total value of user deposits to the minipool in wei
    public getUserDepositTotal(): Promise<string> {
        return this.contract.methods.getUserDepositTotal().call();
    }


    // Get the total value of user deposits withdrawn while staking in wei
    public getStakingUserDepositsWithdrawn(): Promise<string> {
        return this.contract.methods.getStakingUserDepositsWithdrawn().call();
    }


}


// Exports
export default MinipoolContract;
