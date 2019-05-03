// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


// Queued deposis details
export interface QueuedDeposit {
    id: string;
    queuedAmount: string;
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


    // Get a user's queued deposits
    public getQueuedDeposits(groupId: string, userId: string, durationId: string): Promise<QueuedDeposit[]> {
        return this.getQueuedDepositCount(groupId, userId, durationId).then((count: number): Promise<string[]> => {
            return Promise.all([...Array(count).keys()].map((di: number): Promise<string> => {
                return this.getQueuedDepositAt(groupId, userId, durationId, di);
            }));
        }).then((depositIds: string[]): Promise<[string, string][]> => {
            return Promise.all([...Array(depositIds.length).keys()].map((di: number): Promise<[string, string]> => {
                return Promise.all([
                    depositIds[di],
                    this.getDepositQueuedAmount(depositIds[di]),
                ]);
            }));
        }).then((deposits: [string, string][]): QueuedDeposit[] => {
            return deposits.map(([id, queuedAmount]: [string, string]): QueuedDeposit => ({id, queuedAmount}));
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


    // Get the queued amount of a user deposit
    public getDepositQueuedAmount(depositId: string): Promise<string> {
        return this.rocketDepositIndex.then((rocketDepositIndex: Contract): Promise<string> => {
            return rocketDepositIndex.methods.getUserDepositQueuedAmount(depositId).call();
        });
    }


}


// Exports
export default Deposit;
