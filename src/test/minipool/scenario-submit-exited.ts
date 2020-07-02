// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Submit a minipool exited event
export async function submitExited(web3: Web3, rp: RocketPool, minipool: MinipoolContract, epoch: number, options: SendOptions) {

    // Submit event
    await rp.minipool.submitMinipoolExited(minipool.address, epoch, options);

    // Check status
    let status = await minipool.getStatus();
    assert.equal(status, 3, 'Incorrect minipool status');

}

