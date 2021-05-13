// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';
import {NodeDetails} from "../node/node";


/**
 * Rocket Pool Vault
 */
class Vault {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketVault(): Promise<Contract> {
        return this.contracts.get('rocketVault');
    }


    /**
     * Getters
     */


    // Get contract address
    public getAddress(): Promise<string> {
        return this.rocketVault.then((rocketVault: Contract): string => {
            return rocketVault.options.address;
        });
    }

    // Get the claim intervals that have passed
    public balanceOfToken(contractAddress:string, tokenAddress: string): Promise<string> {
        return this.rocketVault.then((rocketVault: Contract): Promise<string> => {
            return rocketVault.methods.balanceOfToken(contractAddress, tokenAddress).call();
        });
    }



    /**
     * Mutators - Public
     */



}


// Exports
export default Vault;
