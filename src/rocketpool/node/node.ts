// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core/types';
import { Contract, SendOptions } from 'web3-eth-contract/types';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


// Node details
export interface NodeDetails {
    address: string;
    exists: boolean;
    trusted: boolean;
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


    /**
     * Getters
     */


    // Get all node addresses
    public getNodeAddresses(): Promise<string[]> {
        return this.getNodeCount().then((count: number): Promise<string[]> => {
            return Promise.all([...Array(count).keys()].map((index: number): Promise<string> => {
                return this.getNodeAt(index);
            }));
        });
    }


    // Get all node details
    public getNodes(): Promise<NodeDetails[]> {
        return this.getNodeAddresses().then((addresses: string[]): Promise<NodeDetails[]> => {
            return Promise.all(addresses.map((address: string): Promise<NodeDetails> => {
                return this.getNodeDetails(address);
            }));
        });
    }


    // Get all trusted node addresses
    public getTrustedNodeAddresses(): Promise<string[]> {
        return this.getTrustedNodeCount().then((count: number): Promise<string[]> => {
            return Promise.all([...Array(count).keys()].map((index: number): Promise<string> => {
                return this.getTrustedNodeAt(index);
            }));
        });
    }


    // Get all trusted node details
    public getTrustedNodes(): Promise<NodeDetails[]> {
        return this.getTrustedNodeAddresses().then((addresses: string[]): Promise<NodeDetails[]> => {
            return Promise.all(addresses.map((address: string): Promise<NodeDetails> => {
                return this.getNodeDetails(address);
            }));
        });
    }


    // Get a node's details
    public getNodeDetails(address: string): Promise<NodeDetails> {
        return Promise.all([
            this.getNodeExists(address),
            this.getNodeTrusted(address),
            this.getNodeTimezoneLocation(address),
        ]).then(
            ([exists, trusted, timezoneLocation]: [boolean, boolean, string]): NodeDetails =>
            ({address, exists, trusted, timezoneLocation})
        );
    }


    // Get the total node count
    public getNodeCount(): Promise<number> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
            return rocketNodeManager.methods.getNodeCount.call();
        }).then((value: string): number => parseInt(value));
    }


    // Get a node address by index
    public getNodeAt(index: number): Promise<string> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
            return rocketNodeManager.methods.getNodeAt(index).call();
        });
    }


    // Get the total trusted node count
    public getTrustedNodeCount(): Promise<number> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
            return rocketNodeManager.methods.getTrustedNodeCount.call();
        }).then((value: string): number => parseInt(value));
    }


    // Get a trusted node address by index
    public getTrustedNodeAt(index: number): Promise<string> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
            return rocketNodeManager.methods.getTrustedNodeAt(index).call();
        });
    }


    // Check whether a node exists
    public getNodeExists(address: string): Promise<boolean> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<boolean> => {
            return rocketNodeManager.methods.getNodeExists(address).call();
        });
    }


    // Check whether a node is trusted
    public getNodeTrusted(address: string): Promise<boolean> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<boolean> => {
            return rocketNodeManager.methods.getNodeTrusted(address).call();
        });
    }


    // Get a node's timezone location
    public getNodeTimezoneLocation(address: string): Promise<string> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
            return rocketNodeManager.methods.getNodeTimezoneLocation(address).call();
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
    public deposit(minimumNodeFee: number, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeDeposit.then((rocketNodeDeposit: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeDeposit.methods.deposit(this.web3.utils.toWei(minimumNodeFee.toString(), 'ether')).send(options),
                onConfirmation
            );
        });
    }


    /**
     * Mutators - Restricted to super users
     */


    // Set a node's trusted status
    public setNodeTrusted(address: string, trusted: boolean, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeManager.methods.setNodeTrusted(address, trusted).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default Node;
