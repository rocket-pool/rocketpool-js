// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';


// Register node
export async function registerNode(web3: Web3, rp: RocketPool, {owner}: {owner: string}): Promise<[string, string]> {

    // Node owner and contract addresses
    let nodeOwner: string = '';
    let nodeContract: string = '';

    // Generate, seed and unlock node owner account
    nodeOwner = await web3.eth.personal.newAccount('');
    await web3.eth.sendTransaction({from: owner, to: nodeOwner, value: web3.utils.toWei('10', 'ether')});
    await web3.eth.personal.unlockAccount(nodeOwner, '', 0);

    // Add node
    let result = await rp.node.add('foo/bar', {from: nodeOwner, gas: 8000000});
    assert.nestedProperty(result, 'events.NodeAdd.returnValues.contractAddress', 'Node was not registered successfully');
    if (result.events !== undefined) nodeContract = result.events.NodeAdd.returnValues.contractAddress;

    // Return node owner and contract addresses
    return [nodeOwner, nodeContract];

}

