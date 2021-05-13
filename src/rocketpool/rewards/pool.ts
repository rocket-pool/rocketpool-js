// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';
import {NodeDetails} from "../node/node";


/**
 * Rocket Pool Rewards
 */
class Pool {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketRewardsPool(): Promise<Contract> {
        return this.contracts.get('rocketRewardsPool');
    }


    /**
     * Getters
     */


    // Get the claim intervals that have passed
    public getClaimIntervalsPassed(): Promise<string> {
        return this.rocketRewardsPool.then((rocketRewardsPool: Contract): Promise<string> => {
            return rocketRewardsPool.methods.getClaimIntervalsPassed().call();
        });
    }

    // Get the claim intervals block start
    public getClaimIntervalBlockStart(): Promise<string> {
        return this.rocketRewardsPool.then((rocketRewardsPool: Contract): Promise<string> => {
            return rocketRewardsPool.methods.getClaimIntervalBlockStart().call();
        });
    }

    // Get the rpl balance
    public getRPLBalance(): Promise<string> {
        return this.rocketRewardsPool.then((rocketRewardsPool: Contract): Promise<string> => {
            return rocketRewardsPool.methods.getRPLBalance().call();
        });
    }

    // Get the claiming contract percentage
    public getClaimingContractPerc(contract: string): Promise<string> {
        return this.rocketRewardsPool.then((rocketRewardsPool: Contract): Promise<string> => {
            return rocketRewardsPool.methods.getClaimingContractPerc(contract).call();
        });
    }

    // Get the claiming contract allowance
    public getClaimingContractAllowance(contract: string): Promise<number> {
        return this.rocketRewardsPool.then((rocketRewardsPool: Contract): Promise<number> => {
            return rocketRewardsPool.methods.getClaimingContractAllowance(contract).call();
        });
    }

    // Get the claiming contract total claimed
    public getClaimingContractTotalClaimed(contract: string): Promise<string> {
        return this.rocketRewardsPool.then((rocketRewardsPool: Contract): Promise<string> => {
            return rocketRewardsPool.methods.getClaimingContractTotalClaimed(contract).call();
        });
    }

    // Get the claim interval rewards total
    public getClaimIntervalRewardsTotal(): Promise<string> {
        return this.rocketRewardsPool.then((rocketRewardsPool: Contract): Promise<string> => {
            return rocketRewardsPool.methods.getClaimIntervalRewardsTotal().call();
        });
    }

    // Get the claim contract registered block
    public getClaimContractRegisteredBlock(contractAddress: string, trustedNodeAddress: string): Promise<string> {
        return this.rocketRewardsPool.then((rocketRewardsPool: Contract): Promise<string> => {
            return rocketRewardsPool.methods.getClaimContractRegisteredBlock(contractAddress, trustedNodeAddress).call();
        });
    }


    // Get the claim contract registered block
    public getClaimingContractUserTotalCurrent(address: string): Promise<string> {
        return this.rocketRewardsPool.then((rocketRewardsPool: Contract): Promise<string> => {
            return rocketRewardsPool.methods.getClaimingContractUserTotalCurrent(address).call();
        });
    }



    /**
     * Mutators - Public
     */



}


// Exports
export default Pool;
