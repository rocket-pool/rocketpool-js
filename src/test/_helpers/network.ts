// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { SendOptions } from 'web3-eth-contract';

// Get the network total ETH balance
export async function getTotalETHBalance(web3: Web3, rp: RocketPool) {
    const rocketNetworkBalances = await rp.contracts.get('rocketNetworkBalances');
    let balance = await rocketNetworkBalances.methods.getTotalETHBalance().call();
    return balance;
}


// Get the network staking ETH balance
export async function getStakingETHBalance(web3: Web3, rp: RocketPool) {
    const rocketNetworkBalances = await rp.contracts.get('rocketNetworkBalances');
    let balance = await rocketNetworkBalances.methods.getStakingETHBalance().call();
    return balance;
}


// Get the network ETH utilization rate
export async function getETHUtilizationRate(web3: Web3, rp: RocketPool) {
    const rocketNetworkBalances = await rp.contracts.get('rocketNetworkBalances');
    let utilizationRate = await rocketNetworkBalances.methods.getETHUtilizationRate().call();
    return utilizationRate;
}


// Submit network balances
export async function submitBalances(web3: Web3, rp: RocketPool, block: string, totalEth: string, stakingEth: string, rethSupply: string, options: SendOptions) {
    const rocketNetworkBalances = await rp.contracts.get('rocketNetworkBalances');
    await rocketNetworkBalances.methods.submitBalances(block, totalEth, stakingEth, rethSupply).send(options);
}


// Submit network token prices
export async function submitPrices(web3: Web3, rp: RocketPool, block: number, rplPrice: string, options: SendOptions) {
    const rocketNetworkPrices = await rp.contracts.get('rocketNetworkPrices');
    await rocketNetworkPrices.methods.submitPrices(block, rplPrice).send(options);
}


// Get the network node demand
export async function getNodeDemand(web3: Web3, rp: RocketPool) {
    const rocketNetworkFees = await rp.contracts.get('rocketNetworkFees');
    let nodeDemand = await rocketNetworkFees.methods.getNodeDemand().call();
    return nodeDemand;
}


// Get the current network node fee
export async function getNodeFee(web3: Web3, rp: RocketPool) {
    const rocketNetworkFees = await rp.contracts.get('rocketNetworkFees');
    let nodeFee = await rocketNetworkFees.methods.getNodeFee().call();
    return nodeFee;
}


// Get the network node fee for a node demand value
export async function getNodeFeeByDemand(web3: Web3, rp: RocketPool, nodeDemand: string) {
    const rocketNetworkFees = await rp.contracts.get('rocketNetworkFees');
    let nodeFee = await rocketNetworkFees.methods.getNodeFeeByDemand(nodeDemand).call();
    return nodeFee;
}
