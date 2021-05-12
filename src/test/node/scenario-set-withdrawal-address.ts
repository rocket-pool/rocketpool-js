// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import {SendOptions} from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Set a node's withdrawal address
export async function setWithdrawalAddress(web3: Web3, rp: RocketPool, nodeAddress: string, withdrawalAddress: string, confirm: boolean, options: SendOptions) {

    // Set withdrawal address
    await rp.node.setWithdrawalAddress(nodeAddress, withdrawalAddress, confirm, options);

    // Get withdrawal address
    let nodeWithdrawalAddress = await rp.node.getNodeWithdrawalAddress(nodeAddress);
    let nodePendingWithdrawalAddress = await rp.node.getNodePendingWithdrawalAddress(nodeAddress);

    // Check
    if (confirm) {
        assert.equal(nodeWithdrawalAddress, withdrawalAddress, 'Incorrect updated withdrawal address');
    } else {
        assert.equal(nodePendingWithdrawalAddress, withdrawalAddress, 'Incorrect updated pending withdrawal address');
    }


}

export async function confirmWithdrawalAddress(web3: Web3, rp: RocketPool, nodeAddress: string, options: SendOptions) {

    // Confirm withdrawal address
    await rp.node.confirmWithdrawalAddress(nodeAddress, options);

    // Get current & pending withdrawal addresses
    let nodeWithdrawalAddress = await rp.node.getNodeWithdrawalAddress(nodeAddress);
    let nodePendingWithdrawalAddress = await rp.node.getNodePendingWithdrawalAddress(nodeAddress);

    // Check
    assert.equal(nodeWithdrawalAddress, web3.utils.toChecksumAddress(options.from), 'Incorrect updated withdrawal address');
    assert.equal(nodePendingWithdrawalAddress, '0x0000000000000000000000000000000000000000', 'Incorrect pending withdrawal address');
}
