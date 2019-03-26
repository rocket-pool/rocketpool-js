// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import { Tx } from 'web3/eth/types';
import { TransactionReceipt } from 'web3/types';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';
import GroupContract from './group-contract';
import GroupAccessorContract from './group-accessor-contract';


/**
 * Rocket Pool groups manager
 */
class Group {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketGroupAPI(): Promise<Contract> {
        return this.contracts.get('rocketGroupAPI');
    }


    /**
     * Getters
     */


    // Get the name of a group by ID
    public getName(groupId: string): Promise<string> {
        return this.rocketGroupAPI.then((rocketGroupAPI: Contract): Promise<string> => {
            return rocketGroupAPI.methods.getGroupName(groupId).call();
        });
    }


    // Get a GroupContract instance
    public getContract(address: string): Promise<GroupContract> {
        return this.contracts.make('rocketGroupContract', address).then((rocketGroupContract: Contract): GroupContract => {
            return new GroupContract(this.web3, rocketGroupContract);
        });
    }


    // Get a GroupAccessorContract instance
    public getAccessorContract(address: string): Promise<GroupAccessorContract> {
        return this.contracts.make('rocketGroupAccessorContract', address).then((rocketGroupAccessorContract: Contract): GroupAccessorContract => {
            return new GroupAccessorContract(this.web3, rocketGroupAccessorContract);
        });
    }


    /**
     * Mutators - Public
     */


    // Register a group
    public add(name: string, stakingFeeFraction: number, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketGroupAPI.then((rocketGroupAPI: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketGroupAPI.methods.add(name, this.web3.utils.toWei(stakingFeeFraction.toString(), 'ether')).send(options),
                onConfirmation
            );
        });
    }


    // Create a default accessor contract for a group
    public createDefaultAccessor(groupId: string, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketGroupAPI.then((rocketGroupAPI: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketGroupAPI.methods.createDefaultAccessor(groupId).send(options),
                onConfirmation
            );
        });
    }


    /**
     * Mutators - Restricted (to Rocket Pool super user addresses)
     */


    // Set the fee charged to a group's users by Rocket Pool
    public setRocketPoolFee(groupId: string, feeFraction: number, options?: Tx, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketGroupAPI.then((rocketGroupAPI: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketGroupAPI.methods.setGroupRocketPoolFeePercent(groupId, this.web3.utils.toWei(feeFraction.toString(), 'ether')).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default Group;
