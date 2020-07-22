// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Submit a minipool withdrawable event
export async function submitWithdrawable(web3: Web3, rp: RocketPool, minipool: MinipoolContract, withdrawalBalance: string, startEpoch: number, endEpoch: number, userStartEpoch: number, options: SendOptions) {

    // Submit event
    await rp.minipool.submitMinipoolWithdrawable(minipool.address, withdrawalBalance, startEpoch, endEpoch, userStartEpoch, options);

    // Check status
    let status = await minipool.getStatus();
    assert.equal(status, 3, 'Incorrect minipool status');

}

