// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {SendOptions} from 'web3-eth-contract';

// Get the network total ETH balance
export async function getTotalETHBalance(web3: Web3, rp: RocketPool) {
    await rp.network.getTotalETHBalance();
}


// Get the network staking ETH balance
export async function getStakingETHBalance(web3: Web3, rp: RocketPool) {
    await rp.network.getStakingETHBalance();
}


// Get the network ETH utilization rate
export async function getETHUtilizationRate(web3: Web3, rp: RocketPool) {
    await rp.network.getETHUtilizationRate();
}


// Submit network balances
export async function submitBalances(web3: Web3, rp: RocketPool, block: number, totalEth: string, stakingEth: string, rethSupply: string, options: SendOptions) {
    await rp.network.submitBalances(block, totalEth, stakingEth, rethSupply, options);
}


// Submit network token prices
export async function submitPrices(web3: Web3, rp: RocketPool, block: number, rplPrice: string, options: SendOptions) {
    await rp.network.submitPrices(block, rplPrice, options);
}


// Get the network node demand
export async function getNodeDemand(web3: Web3, rp: RocketPool) {
    await rp.network.getNodeDemand();
}


// Get the current network node fee
export async function getNodeFee(web3: Web3, rp: RocketPool) {
    await rp.network.getNodeFee();
}


// Get the network node fee for a node demand value
export async function getNodeFeeByDemand(web3: Web3, rp: RocketPool, nodeDemand: string) {
    await rp.network.getNodeFeeByDemand(nodeDemand);
}
