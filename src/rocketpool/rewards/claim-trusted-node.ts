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
class Rewards {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketClaimTrustedNode(): Promise<Contract> {
        return this.contracts.get('rocketClaimTrustedNode');
    }


    /**
     * Getters
     */
    // Get claim rewards amount
    public getClaimRewardsAmount(address: string): Promise<string> {
        return this.rocketClaimTrustedNode.then((rocketClaimTrustedNode: Contract): Promise<string> => {
            return rocketClaimTrustedNode.methods.getClaimRewardsAmount(address).call();
        });
    }


    /**
     * Mutators - Public
     */
    // Claim from a trusted node
    public claim(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketClaimTrustedNode.then((rocketClaimTrustedNode: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketClaimTrustedNode.methods.claim().send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default Rewards;
