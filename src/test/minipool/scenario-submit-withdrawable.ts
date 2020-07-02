// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Submit a minipool withdrawable event
export async function submitWithdrawable(web3: Web3, rp: RocketPool, minipool: MinipoolContract, withdrawalBalance: string, epoch: number, options: SendOptions) {

    // Submit event
    await rp.minipool.submitMinipoolWithdrawable(minipool.address, withdrawalBalance, epoch, options);

    // Check status
    let status = await minipool.getStatus();
    assert.equal(status, 4, 'Incorrect minipool status');

}

