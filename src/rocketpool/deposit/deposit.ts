// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


// Deposit details
export interface DepositDetails {
    id: string;
    totalAmount: string;
    queuedAmount: string;
    stakingAmount: string;
    refundedAmount: string;
    withdrawnAmount: string;
    pools: DepositPoolDetails[];
}


// Deposit staking minipool details
export interface DepositPoolDetails {
    address: string;
    stakingAmount: string;
}


/**
 * Rocket Pool deposit manager
 */
class Deposit {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDepositIndex(): Promise<Contract> {
        return this.contracts.get('rocketDepositIndex');
    }


    /**
     * Getters
     */


    // Get a user's deposits
    public getDeposits(groupId: string, userId: string, durationId: string): Promise<DepositDetails[]> {
        return this.getDepositCount(groupId, userId, durationId).then((count: number): Promise<string[]> => {
            return Promise.all([...Array(count).keys()].map((di: number): Promise<string> => {
                return this.getDepositAt(groupId, userId, durationId, di);
            }));
        }).then((depositIds: string[]): Promise<DepositDetails[]> => {
            return Promise.all(depositIds.map((depositId: string): Promise<DepositDetails> => this.getDeposit(depositId)));
        });
    }


    // Get a user's queued deposits
    public getQueuedDeposits(groupId: string, userId: string, durationId: string): Promise<DepositDetails[]> {
        return this.getQueuedDepositCount(groupId, userId, durationId).then((count: number): Promise<string[]> => {
            return Promise.all([...Array(count).keys()].map((di: number): Promise<string> => {
                return this.getQueuedDepositAt(groupId, userId, durationId, di);
            }));
        }).then((depositIds: string[]): Promise<DepositDetails[]> => {
            return Promise.all(depositIds.map((depositId: string): Promise<DepositDetails> => this.getDeposit(depositId)));
        });
    }


    // Get a deposit's details
    public getDeposit(depositId: string): Promise<DepositDetails> {
        return Promise.all([
            this.getDepositTotalAmount(depositId),
            this.getDepositQueuedAmount(depositId),
            this.getDepositStakingAmount(depositId),
            this.getDepositRefundedAmount(depositId),
            this.getDepositWithdrawnAmount(depositId),
            this.getDepositStakingPools(depositId),
        ]).then(([totalAmount, queuedAmount, stakingAmount, refundedAmount, withdrawnAmount, pools]: [string, string, string, string, string, DepositPoolDetails[]]): DepositDetails => {
            return {id: depositId, totalAmount, queuedAmount, stakingAmount, refundedAmount, withdrawnAmount, pools};
        });
    }


    // Get a deposit's staking minipools
    public getDepositStakingPools(depositId: string): Promise<DepositPoolDetails[]> {
        return this.getDepositStakingPoolCount(depositId).then((count: number): Promise<string[]> => {
            return Promise.all([...Array(count).keys()].map((pi: number): Promise<string> => {
                return this.getDepositStakingPoolAt(depositId, pi);
            }));
        }).then((poolAddresses: string[]): Promise<[string, string][]> => {
            return Promise.all(poolAddresses.map((poolAddress: string): Promise<[string, string]> => {
                return Promise.all([poolAddress, this.getDepositStakingPoolAmount(depositId, poolAddress)]);
            }));
        }).then((pools: [string, string][]): DepositPoolDetails[] => {
            return pools.map(([address, stakingAmount]: [string, string]): DepositPoolDetails => ({address, stakingAmount}));
        });
    }


    // Get a user's deposit count
    public getDepositCount(groupId: string, userId: string, durationId: string): Promise<number> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositCount(groupId, userId, durationId).call();
        }).then((value: string): number => parseInt(value));
    }


    // Get a user's deposit ID by index
    public getDepositAt(groupId: string, userId: string, durationId: string, index: number): Promise<string> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositAt(groupId, userId, durationId, index).call();
        });
    }


    // Get a user's queued deposit count
    public getQueuedDepositCount(groupId: string, userId: string, durationId: string): Promise<number> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserQueuedDepositCount(groupId, userId, durationId).call();
        }).then((value: string): number => parseInt(value));
    }


    // Get a user's queued deposit ID by index
    public getQueuedDepositAt(groupId: string, userId: string, durationId: string, index: number): Promise<string> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserQueuedDepositAt(groupId, userId, durationId, index).call();
        });
    }


    // Get the total amount of a user deposit
    public getDepositTotalAmount(depositId: string): Promise<string> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositTotalAmount(depositId).call();
        });
    }


    // Get the queued amount of a user deposit
    public getDepositQueuedAmount(depositId: string): Promise<string> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositQueuedAmount(depositId).call();
        });
    }


    // Get the staking amount of a user deposit
    public getDepositStakingAmount(depositId: string): Promise<string> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositStakingAmount(depositId).call();
        });
    }


    // Get the refunded amount of a user deposit
    public getDepositRefundedAmount(depositId: string): Promise<string> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositRefundedAmount(depositId).call();
        });
    }


    // Get the withdrawn amount of a user deposit
    public getDepositWithdrawnAmount(depositId: string): Promise<string> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositWithdrawnAmount(depositId).call();
        });
    }


    // Get the number of minipools a user deposit is staking under
    public getDepositStakingPoolCount(depositId: string): Promise<number> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositStakingPoolCount(depositId).call();
        }).then((value: string): number => parseInt(value));
    }


    // Get the address of a minipool a user deposit is staking under by index
    public getDepositStakingPoolAt(depositId: string, index: number): Promise<string> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositStakingPoolAt(depositId, index).call();
        });
    }


    // Get the amount of a user deposit staking under a minipool
    public getDepositStakingPoolAmount(depositId: string, minipoolAddress: string): Promise<string> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositStakingPoolAmount(depositId, minipoolAddress).call();
        });
    }


    // Get the backup address for a user deposit
    public getDepositBackupAddress(depositId: string): Promise<string | null> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositBackupAddress(depositId).call();
        }).then((value: string): string | null => (value == '0x0000000000000000000000000000000000000000') ? null : value);
    }


}


// Exports
export default Deposit;
