// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Dissolve a minipool
export async function dissolve(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {

    // Dissolve
    await minipool.dissolve(options);

    // Check status
    let status = await minipool.getStatus();
    assert.equal(status, 4, 'Incorrect minipool status');

}

