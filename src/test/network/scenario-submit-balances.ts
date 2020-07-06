// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Submit network ETH balances
export async function submitETHBalances(web3: Web3, rp: RocketPool, epoch: number, totalWei: string, stakingWei: string, options: SendOptions) {

    // Submit balances
    await rp.network.submitETHBalances(epoch, totalWei, stakingWei, options);

    // Get & check balance
    let totalBalance = await rp.network.getTotalETHBalance();
    assert(web3.utils.toBN(totalBalance).eq(web3.utils.toBN(totalWei)), 'Balances were not updated successfully');

}

