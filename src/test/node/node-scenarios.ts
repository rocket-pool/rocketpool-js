// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import NodeContract from '../../rocketpool/node/node-contract';


// Register node
export async function registerNode(web3: Web3, rp: RocketPool, {timezone, owner}: {timezone: string, owner: string}): Promise<[string, string]> {
    const rocketPoolToken = await rp.contracts.get('rocketPoolToken');

    // Node owner and contract addresses
    let nodeOwner: string = '';
    let nodeContract: string = '';

    // Generate, seed and unlock node owner account
    nodeOwner = await web3.eth.personal.newAccount('');
    await web3.eth.sendTransaction({from: owner, to: nodeOwner, value: web3.utils.toWei('20', 'ether')});
    await web3.eth.personal.unlockAccount(nodeOwner, '', 0);

    // Add node
    let result = await rp.node.add(timezone, {from: nodeOwner, gas: 8000000});
    assert.nestedProperty(result, 'events.NodeAdd.returnValues.contractAddress', 'Node was not registered successfully');
    if (result.events !== undefined) nodeContract = result.events.NodeAdd.returnValues.contractAddress;

    // Seed node contract
    await rocketPoolToken.methods.mint(nodeContract, web3.utils.toWei('1000', 'ether')).send({from: owner, gas: 8000000});

    // Check node contract address
    let nodeContractTest = await rp.node.getContractAddress(nodeOwner);
    assert.equal(nodeContractTest.toLowerCase(), nodeContract.toLowerCase(), 'Registered node contract address does not match');

    // Return node owner and contract addresses
    return [nodeOwner, nodeContract];

}


// Set the node's timezone location
export async function setNodeTimezone(rp: RocketPool, {timezone, from}: {timezone: string, from: string}) {
    await rp.node.setTimezoneLocation(timezone, {from, gas: 8000000});
    let timezoneLocationTest = await rp.node.getTimezoneLocation(from);
    assert.equal(timezoneLocationTest, timezone, 'Node timezone was not updated successfully');
}


// Set the node's rewards address
export async function setNodeRewardsAddress(nodeContract: NodeContract, {rewardsAddress, from}: {rewardsAddress: string, from: string}) {
    await nodeContract.setRewardsAddress(rewardsAddress, {from, gas: 8000000});
    let rewardsAddressTest = await nodeContract.getRewardsAddress();
    assert.equal(rewardsAddressTest.toLowerCase(), rewardsAddress.toLowerCase(), 'Rewards address was not updated successfully');
}


// Make a deposit reservation
export async function reserveNodeDeposit(nodeContract: NodeContract, {durationId, depositInput, from}: {durationId: string, depositInput: Buffer, from: string}) {
    await nodeContract.reserveDeposit(durationId, depositInput, {from, gas: 8000000});
    let details = await nodeContract.getDepositReservation();
    assert.equal(details.durationId, durationId, 'Deposit reservation duration ID does not match');
    assert.equal(details.depositInput, '0x' + depositInput.toString('hex'), 'Deposit reservation DepositInput data does not match');
}


// Cancel a deposit reservation
export async function cancelNodeDepositReservation(nodeContract: NodeContract, {from}: {from: string}) {
    await nodeContract.cancelDepositReservation({from, gas: 8000000});
    let hasDepositReservation = await nodeContract.getHasDepositReservation();
    assert.isFalse(hasDepositReservation, 'Deposit reservation was not cancelled successfully');
}


// Complete a deposit
export async function completeNodeDeposit(nodeContract: NodeContract, {from, value}: {from: string, value: string}) {
    let result = await nodeContract.completeDeposit({from, value, gas: 8000000});
    assert.nestedProperty(result, 'events.NodeDepositMinipool', 'Node deposit was not completed successfully');
}

