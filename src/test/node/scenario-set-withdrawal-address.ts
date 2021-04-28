// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import {SendOptions} from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Set a node's withdrawal address
export async function setWithdrawalAddress(web3: Web3, rp: RocketPool, withdrawalAddress: string, options: SendOptions) {

    // Load contracts
    const rocketNodeManager = await rp.contracts.get('rocketNodeManager');

    // Set withdrawal address
    await rocketNodeManager.methods.setWithdrawalAddress(withdrawalAddress).send(options);

    // Get withdrawal address
    let nodeWithdrawalAddress = await rocketNodeManager.methods.getNodeWithdrawalAddress(options.from).call();

    // Check
    assert.equal(nodeWithdrawalAddress, withdrawalAddress, 'Incorrect updated withdrawal address');

}

