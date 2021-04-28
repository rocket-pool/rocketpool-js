// Imports
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';

// Get the current rewards claim period in blocks
export async function rewardsClaimIntervalBlocksGet(web3: Web3, rp: RocketPool, options: SendOptions) {
    // Load contracts
    const rocketDAOProtocolSettingsRewards = await rp.contracts.get('rocketDAOProtocolSettingsRewards');
    return await rocketDAOProtocolSettingsRewards.methods.getClaimIntervalBlocks().call();
};


// Get the current rewards claimers total
export async function rewardsClaimersPercTotalGet(web3: Web3, rp: RocketPool, options: SendOptions) {
    // Load contracts
    const rocketDAOProtocolSettingsRewards = await rp.contracts.get('rocketDAOProtocolSettingsRewards');
    return await rocketDAOProtocolSettingsRewards.methods.getRewardsClaimersPercTotal().call();
};


// Get how many blocks needed until the next claim interval
export async function rewardsClaimIntervalsPassedGet(web3: Web3, rp: RocketPool, options: SendOptions) {
    // Load contracts
    const rocketRewardsPool = await rp.contracts.get('rocketRewardsPool');
    return await rocketRewardsPool.methods.getClaimIntervalsPassed().call();
};
