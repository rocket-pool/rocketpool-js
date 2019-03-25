// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';


// Register node
export async function registerNode(web3: Web3, rp: RocketPool, timezone: string, {owner}: {owner: string}): Promise<[string, string]> {

    // Node owner and contract addresses
    let nodeOwner: string = '';
    let nodeContract: string = '';

    // Generate, seed and unlock node owner account
    nodeOwner = await web3.eth.personal.newAccount('');
    await web3.eth.sendTransaction({from: owner, to: nodeOwner, value: web3.utils.toWei('10', 'ether')});
    await web3.eth.personal.unlockAccount(nodeOwner, '', 0);

    // Add node
    let result = await rp.node.add(timezone, {from: nodeOwner, gas: 8000000});
    assert.nestedProperty(result, 'events.NodeAdd.returnValues.contractAddress', 'Node was not registered successfully');
    if (result.events !== undefined) nodeContract = result.events.NodeAdd.returnValues.contractAddress;

    // Return node owner and contract addresses
    return [nodeOwner, nodeContract];

}


// Set the node's timezone location
export async function setNodeTimezone(rp: RocketPool, timezone: string, {from}: {from: string}) {
    await rp.node.setTimezoneLocation(timezone, {from, gas: 8000000});
    let timezoneLocationTest = await rp.node.getTimezoneLocation(from);
    assert.equal(timezoneLocationTest, timezone, 'Node timezone was not updated successfully');
}

