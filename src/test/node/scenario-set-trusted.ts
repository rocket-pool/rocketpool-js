// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';

// Set a node's trusted status
export async function setNodeTrusted(web3: Web3, rp: RocketPool, nodeAddress: string, trusted: boolean, options: SendOptions) {

    // Set trusted status
    await rp.node.setNodeTrusted(nodeAddress, trusted, options);

    // Check node's trusted status
    let nodeTrusted = await rp.node.getNodeTrusted(nodeAddress);
    assert.equal(nodeTrusted, trusted, 'Node trusted status was not set successfully');

}

