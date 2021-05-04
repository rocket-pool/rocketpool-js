// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import {SendOptions} from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Set a node's withdrawal address
export async function setWithdrawalAddress(web3: Web3, rp: RocketPool, nodeAddress: string, withdrawalAddress: string, confirm: boolean, options: SendOptions) {

    // Load contracts
    const rocketNodeManager = await rp.contracts.get('rocketNodeManager');

    // Set withdrawal address
    await rocketNodeManager.methods.setWithdrawalAddress(nodeAddress, withdrawalAddress, confirm).send(options);

    // Get withdrawal address
    let nodeWithdrawalAddress = await rocketNodeManager.methods.getNodeWithdrawalAddress(nodeAddress).call();
    let nodePendingWithdrawalAddress = await rocketNodeManager.methods.getNodePendingWithdrawalAddress(nodeAddress).call()

    // Check
    if (confirm) {
        assert.equal(nodeWithdrawalAddress, withdrawalAddress, 'Incorrect updated withdrawal address');
    } else {
        assert.equal(nodePendingWithdrawalAddress, withdrawalAddress, 'Incorrect updated pending withdrawal address');
    }


}

export async function confirmWithdrawalAddress(web3: Web3, rp: RocketPool, nodeAddress: string, options: SendOptions) {

    // Load contracts
    const rocketNodeManager = await rp.contracts.get('rocketNodeManager');

    // Confirm withdrawal address
    await rocketNodeManager.methods.confirmWithdrawalAddress(nodeAddress).send(options);

    // Get current & pending withdrawal addresses
    let nodeWithdrawalAddress = await rocketNodeManager.methods.getNodeWithdrawalAddress(nodeAddress).call();
    let nodePendingWithdrawalAddress = await rocketNodeManager.methods.getNodePendingWithdrawalAddress(nodeAddress).call();

    // Check
    assert.equal(nodeWithdrawalAddress, web3.utils.toChecksumAddress(options.from), 'Incorrect updated withdrawal address');
    assert.equal(nodePendingWithdrawalAddress, '0x0000000000000000000000000000000000000000', 'Incorrect pending withdrawal address');
}
