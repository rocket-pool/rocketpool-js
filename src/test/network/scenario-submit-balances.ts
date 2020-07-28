// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Submit network ETH balances
export async function submitBalances(web3: Web3, rp: RocketPool, block: number, totalEthWei: string, stakingEthWei: string, rethSupplyWei: string, options: SendOptions) {

    // Submit balances
    await rp.network.submitBalances(block, totalEthWei, stakingEthWei, rethSupplyWei, options);

    // Get & check ETH balance
    let totalEthBalance = await rp.network.getTotalETHBalance();
    assert(web3.utils.toBN(totalEthBalance).eq(web3.utils.toBN(totalEthWei)), 'Balances were not updated successfully');

}

