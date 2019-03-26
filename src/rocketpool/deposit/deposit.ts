// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


// Queued deposis details
export interface QueuedDeposit {
    id: string;
    balance: string;
}


/**
 * Rocket Pool deposit manager
 */
class Deposit {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDepositAPI(): Promise<Contract> {
        return this.contracts.get('rocketDepositAPI');
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
                    this.getQueuedDepositBalance(depositIds[di]),
                ]);
            }));
        }).then((deposits: [string, string][]): QueuedDeposit[] => {
            return deposits.map(([id, balance]: [string, string]): QueuedDeposit => ({id, balance}));
        });
    }


    // Get a user's queued deposit count
    public getQueuedDepositCount(groupId: string, userId: string, durationId: string): Promise<number> {
        return this.rocketDepositAPI.then((rocketDepositAPI: Contract): Promise<string> => {
            return rocketDepositAPI.methods.getUserQueuedDepositCount(groupId, userId, durationId).call();
        }).then((depositCount: string): number => {
            return parseInt(depositCount);
        });
    }


    // Get a user's queued deposit ID by index
    public getQueuedDepositAt(groupId: string, userId: string, durationId: string, index: number): Promise<string> {
        return this.rocketDepositAPI.then((rocketDepositAPI: Contract): Promise<string> => {
            return rocketDepositAPI.methods.getUserQueuedDepositAt(groupId, userId, durationId, index).call();
        });
    }


    // Get the balance of a user's queued deposit by ID
    public getQueuedDepositBalance(depositId: string): Promise<string> {
        return this.rocketDepositAPI.then((rocketDepositAPI: Contract): Promise<string> => {
            return rocketDepositAPI.methods.getUserQueuedDepositBalance(depositId).call();
        });
    }


}


// Exports
export default Deposit;
