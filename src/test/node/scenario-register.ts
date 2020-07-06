// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';

// Register a node
export async function register(web3: Web3, rp: RocketPool, timezoneLocation: string, options: SendOptions) {

    // Register
    await rp.node.registerNode(timezoneLocation, options);

    // Check node exists status
    let exists = await rp.node.getNodeExists(options.from);
    assert.isTrue(exists, 'Node was not registered successfully');

}

