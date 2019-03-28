// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { Tx } from 'web3/eth/types';
import { TransactionReceipt } from 'web3/types';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';
import NodeContract from './node-contract';


/**
 * Rocket Pool node manager
 */
class Node {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketNodeAPI(): Promise<Contract> {
        return this.contracts.get('rocketNodeAPI');
    }
    private get rocketNode(): Promise<Contract> {
        return this.contracts.get('rocketNode');
    }


    /**
     * Getters
     */


    // Get the current number of nodes with minipools available for assignment by staking duration ID
    public getAvailableCount(stakingDurationId: string): Promise<number> {
        return this.rocketNode.then((rocketNode: Contract): Promise<string> => {
            return rocketNode.methods.getAvailableNodeCount(stakingDurationId).call();
        }).then((value: string): number => parseInt(value));
    }


    // Get the current RPL ratio by staking duration ID
    public getRPLRatio(stakingDurationId: string): Promise<number> {
        return this.rocketNodeAPI.then((rocketNodeAPI: Contract): Promise<string> => {
            return rocketNodeAPI.methods.getRPLRatio(stakingDurationId).call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Get the current RPL requirement for an ether amount by staking duration ID
    public getRPLRequired(weiAmount: string, stakingDurationId: string): Promise<[string, number]> {
        return this.rocketNodeAPI.then((rocketNodeAPI: Contract): Promise<{0: string, 1: string}> => {
            return rocketNodeAPI.methods.getRPLRequired(weiAmount, stakingDurationId).call();
        }).then((ret: {0: string, 1: string}): [string, number] => [ret[0], parseFloat(this.web3.utils.fromWei(ret[1], 'ether'))]);
    }


    // Get the timezone location of a node
    public getTimezoneLocation(nodeOwner: string): Promise<string> {
        return this.rocketNodeAPI.then((rocketNodeAPI: Contract): Promise<string> => {
            return rocketNodeAPI.methods.getTimezoneLocation(nodeOwner).call();
        });
    }


    // Get a node's contract address by owner address
    public getContractAddress(nodeOwner: string): Promise<string> {
        return this.rocketNodeAPI.then((rocketNodeAPI: Contract): Promise<string> => {
            return rocketNodeAPI.methods.getContract(nodeOwner).call();
        });
    }


    // Get a NodeContract instance
    public getContract(address: string): Promise<NodeContract> {
        return this.contracts.make('rocketNodeContract', address).then((rocketNodeContract: Contract): NodeContract => {
            return new NodeContract(this.web3, rocketNodeContract);
        });
    }


    /**
     * Mutators - Public
     */


    // Register a node
    public add(timezone: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeAPI.then((rocketNodeAPI: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeAPI.methods.add(timezone).send(options),
                onConfirmation
            );
        });
    }


    /**
     * Mutators - Restricted to the node owner address
     */


    // Set a node's timezone location
    public setTimezoneLocation(timezone: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNodeAPI.then((rocketNodeAPI: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNodeAPI.methods.setTimezoneLocation(timezone).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default Node;
