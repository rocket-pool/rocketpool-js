// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


/**
 * Rocket Pool network manager
 */
class Network {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketNetworkBalances(): Promise<Contract> {
        return this.contracts.get('rocketNetworkBalances');
    }

    private get rocketNetworkFees(): Promise<Contract> {
        return this.contracts.get('rocketNetworkFees');
    }

    private get rocketNetworkPrices(): Promise<Contract> {
        return this.contracts.get('rocketNetworkPrices');
    }


    /**
     * Getters
     */
    // Get the block that current network balances are set for
    public getBalancesBlock(): Promise<number> {
        return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<string> => {
            return rocketNetworkBalances.methods.getBalancesBlock().call();
        }).then((value: string): number => parseInt(value));
    }


    // Get the current network total ETH balance in wei
    public getTotalETHBalance(): Promise<string> {
        return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<string> => {
            return rocketNetworkBalances.methods.getTotalETHBalance().call();
        });
    }


    // Get the current network staking ETH balance in wei
    public getStakingETHBalance(): Promise<string> {
        return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<string> => {
            return rocketNetworkBalances.methods.getStakingETHBalance().call();
        });
    }


    // Get the current network total rETH supply in wei
    public getTotalRETHSupply(): Promise<string> {
        return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<string> => {
            return rocketNetworkBalances.methods.getTotalRETHSupply().call();
        });
    }


    // Get the current network ETH utilization rate
    public getETHUtilizationRate(): Promise<number> {
        return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<string> => {
            return rocketNetworkBalances.methods.getETHUtilizationRate().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Get the current network node demand in wei
    public getNodeDemand(): Promise<string> {
        return this.rocketNetworkFees.then((rocketNetworkFees: Contract): Promise<string> => {
            return rocketNetworkFees.methods.getNodeDemand().call();
        });
    }


    // Get the current network node commission rate
    public getNodeFee(): Promise<number> {
        return this.rocketNetworkFees.then((rocketNetworkFees: Contract): Promise<number> => {
            return rocketNetworkFees.methods.getNodeFee().call();
        });
    }


    // Get the network node commission rate by demand value
    public getNodeFeeByDemand(demand: string): Promise<number> {
        return this.rocketNetworkFees.then((rocketNetworkFees: Contract): Promise<number> => {
            return rocketNetworkFees.methods.getNodeFeeByDemand(demand).call();
        });
    }


    // Get the network RPL Price
    public getRPLPrice(): Promise<number> {
        return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<number> => {
            return rocketNetworkPrices.methods.getRPLPrice().call();
        });
    }


    public getPricesBlock(): Promise<number> {
        return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<number> => {
            return rocketNetworkPrices.methods.getPricesBlock().call();
        });
    }


    /**
     * Mutators - Restricted to trusted nodes
     */
    // Submit network balances
    public submitBalances(block: number, totalEth: string, stakingEth: string, rethSupply: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNetworkBalances.methods.submitBalances(block, totalEth, stakingEth, rethSupply).send(options),
                onConfirmation
            );
        });
    }


    // Submit network prices
    public submitPrices(block: number, rplPrice: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNetworkPrices.methods.submitPrices(block, rplPrice).send(options),
                onConfirmation
            );
        });
    }


    // Execute update prices
    public executeUpdatePrices(block: number, rplPrice: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNetworkPrices.methods.executeUpdatePrices(block, rplPrice).send(options),
                onConfirmation
            );
        });
    }


    // Execute update balances
    public executeUpdateBalances(block: number, totalEth: string, stakingEth: string, rethSupply: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketNetworkBalances.methods.executeUpdateBalances(block, totalEth, stakingEth, rethSupply).send(options),
                onConfirmation
            );
        });
    }


}


// Exports
export default Network;
