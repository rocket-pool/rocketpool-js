// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


// Node details
export interface NodeDetails {
    address: string;
    exists: boolean;
    timezoneLocation: string;
}


/**
 * Rocket Pool node manager
 */
class Node {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketNodeDeposit(): Promise<Contract> {
        return this.contracts.get('rocketNodeDeposit');
    }


    private get rocketNodeManager(): Promise<Contract> {
        return this.contracts.get('rocketNodeManager');
    }


    private get rocketNodeStaking(): Promise<Contract> {
        return this.contracts.get('rocketNodeStaking');
    }

    private get rocketStorage(): Promise<Contract> {
        return this.contracts.get("rocketStorage");
    }


    /**
     * Getters
     */
    // Get all node details
    public getNodes(): Promise<NodeDetails[]> {
        return this.getNodeAddresses().then((addresses: string[]): Promise<NodeDetails[]> => {
            return Promise.all(addresses.map((address: string): Promise<NodeDetails> => {
                return this.getNodeDetails(address);
            }));
        });
    }


    // Get all node addresses
    public getNodeAddresses(): Promise<string[]> {
        return this.getNodeCount().then((count: number): Promise<string[]> => {
            return Promise.all([...Array(count).keys()].map((index: number): Promise<string> => {
                return this.getNodeAt(index);
            }));
        });
    }


    // Get a node's details
    public getNodeDetails(address: string): Promise<NodeDetails> {
        return Promise.all([
            this.getNodeExists(address),
            this.getNodeTimezoneLocation(address),
        ]).then(
            ([exists, timezoneLocation]: [boolean, string]): NodeDetails =>
            ({address, exists, timezoneLocation})
        );
    }


    // Get the total node count
    public getNodeCount(): Promise<number> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
            return rocketNodeManager.methods.getNodeCount().call();
        }).then((value: string): number => parseInt(value));
    }


    // Get a node address by index
    public getNodeAt(index: number): Promise<string> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
            return rocketNodeManager.methods.getNodeAt(index).call();
        });
    }


    // Check whether a node exists
    public getNodeExists(address: string): Promise<boolean> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<boolean> => {
            return rocketNodeManager.methods.getNodeExists(address).call();
        });
    }


    // Get a node's timezone location
    public getNodeTimezoneLocation(address: string): Promise<string> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
            return rocketNodeManager.methods.getNodeTimezoneLocation(address).call();
        });
    }


    // Check whether a node exists
    public getNodeWithdrawalAddress(address: string): Promise<string> {
        return this.rocketStorage.then((rocketStorage: Contract): Promise<string> => {
            return rocketStorage.methods.getNodeWithdrawalAddress(address).call();
        });
    }


    // Get Node RPL Stake
    public getNodeRPLStake(address: string): Promise<string> {
        return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
            return rocketNodeStaking.methods.getNodeRPLStake(address).call();
        });
    }


    // Get Node Effective RPL Stake
    public getNodeEffectiveRPLStake(address: string): Promise<string> {
        return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
            return rocketNodeStaking.methods.getNodeEffectiveRPLStake(address).call();
        });
    }


    // Get Node Minipool Limit
    public getNodeMinipoolLimit(address: string): Promise<string> {
        return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
            return rocketNodeStaking.methods.getNodeMinipoolLimit(address).call();
        });
    }


    // Get Node Total Effective RPL Stake
    public getNodeTotalEffectiveRPLStake(): Promise<string> {
        return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
            return rocketNodeStaking.methods.getTotalEffectiveRPLStake().call();
        });
    }


    // Get Node Minimum RPL Stake
    public getNodeMinimumRPLStake(address: string): Promise<string> {
        return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
            return rocketNodeStaking.methods.getNodeMinimumRPLStake(address).call();
        });
    }


    // Get Node Pending Withdrawal Address
    public getNodePendingWithdrawalAddress(address: string): Promise<string> {
        return this.rocketStorage.then((rocketStorage: Contract): Promise<string> => {
            return rocketStorage.methods.getNodePendingWithdrawalAddress(address).call();
        });
    }


    // Get Total Effective RPL Stake
    public getTotalEffectiveRPLStake(): Promise<string> {
        return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
            return rocketNodeStaking.methods.getTotalEffectiveRPLStake().call();
        });
    }


    // Get Total RPL Stake
    public getTotalRPLStake(): Promise<string> {
        return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
            return rocketNodeStaking.methods.getTotalRPLStake().call();
        });
    }


    // Get Total Effective RPL Stake
    public calculateTotalEffectiveRPLStake(offset: Number, limit: Number, rplPrice: string): Promise<string> {
        return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
            return rocketNodeStaking.methods.calculateTotalEffectiveRPLStake(offset, limit, rplPrice).call();
        });
    }

    // Get a breakdown of the number of nodes per timezone
    public getNodeCountPerTimezone(offset: number, limit: number): Promise<object> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<object> => {
            return rocketNodeManager.methods.getNodeCountPerTimezone(offset, limit).call();
        });
    }


    /**
     * Mutators - Public
     */


    // Register a node
    public registerNode(timezoneLocation: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeManager.methods.registerNode(timezoneLocation).send(options),
                onConfirmation
            );
        });
    }


    public setWithdrawalAddress(nodeAddress: string, withdrawalAddress:string, confirm: boolean, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketStorage.then((rocketStorage: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketStorage.methods.setWithdrawalAddress(nodeAddress, withdrawalAddress, confirm).send(options),
                onConfirmation
            );
        });
    }


    public stakeRPL(amount: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeStaking.methods.stakeRPL(amount).send(options),
                onConfirmation
            );
        });
    }


    public confirmWithdrawalAddress(nodeAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketStorage.then((rocketStorage: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketStorage.methods.confirmWithdrawalAddress(nodeAddress).send(options),
                onConfirmation
            );
        });
    }

    public withdrawRPL(amount: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeStaking.methods.withdrawRPL(amount).send(options),
                onConfirmation
            );
        });
    }


    /**
     * Mutators - Restricted to registered nodes
     */


    // Set the node's timezone location
    public setTimezoneLocation(timezoneLocation: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeManager.methods.setTimezoneLocation(timezoneLocation).send(options),
                onConfirmation
            );
        });
    }


    // Make a node deposit
    public deposit(minimumNodeFee: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeDeposit.then((rocketNodeDeposit: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeDeposit.methods.deposit(minimumNodeFee).send(options),
                onConfirmation
            );
        });
    }


    /**
     * Mutators - Restricted to super users
     */


}


// Exports
export default Node;
