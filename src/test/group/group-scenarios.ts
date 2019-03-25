// Imports
import { assert } from 'chai';
import RocketPool from '../../rocketpool/rocketpool';
import GroupContract from '../../rocketpool/group/group-contract';


// Register group
export async function registerGroup(rp: RocketPool, {from}: {from: string}): Promise<[string, string]> {
    const rocketGroupSettings = await rp.contracts.get('rocketGroupSettings');
    const rocketGroupAPI = await rp.contracts.get('rocketGroupAPI');

    // Group name and ID
    let groupName: string = '';
    let groupId: string = '';

    // Get group registration fee
    // :TODO: use utility module once implemented
    let newGroupFee = await rocketGroupSettings.methods.getNewFee().call();

    // Get new group name
    let groupAddEvents = await rocketGroupAPI.getPastEvents('GroupAdd', {fromBlock: 0});
    groupName = ('Group ' + groupAddEvents.length);

    // Register group
    let result = await rp.group.add(groupName, 0.05, {from, gas: 8000000, value: newGroupFee});
    assert.nestedProperty(result, 'events.GroupAdd.returnValues.ID', 'Group was not registered successfully');
    if (result.events !== undefined) groupId = result.events.GroupAdd.returnValues.ID;

    // Check group name
    let groupNameTest = await rp.group.getName(groupId);
    assert.equal(groupNameTest.toLowerCase(), groupName.toLowerCase(), 'Registered group name does not match');

    // Check group owner
    let groupContract = await rp.group.getContract(groupId);
    let groupOwnerTest = await groupContract.getOwner();
    assert.equal(groupOwnerTest.toLowerCase(), from.toLowerCase(), 'Registered group owner does not match');

    // Return group name and ID
    return [groupName, groupId];

}


// Create default accessor
export async function createAccessor(rp: RocketPool, {groupId, from}: {groupId: string, from: string}): Promise<string> {

    // Create accessor
    let result = await rp.group.createDefaultAccessor(groupId, {from, gas: 8000000});
    assert.nestedProperty(result, 'events.GroupCreateDefaultAccessor.returnValues.accessorAddress', 'Accessor was not created successfully');

    // Return accessor address
    if (result.events !== undefined) return result.events.GroupCreateDefaultAccessor.returnValues.accessorAddress;
    return '';

}


// Add depositor
export async function addDepositor(groupContract: GroupContract, depositorAddress: string, {from}: {from: string}) {
    let result = await groupContract.addDepositor(depositorAddress, {from, gas: 8000000});
    assert.nestedProperty(result, 'events.DepositorAdd', 'Depositor was not added successfully');
}


// Remove depositor
export async function removeDepositor(groupContract: GroupContract, depositorAddress: string, {from}: {from: string}) {
    let result = await groupContract.removeDepositor(depositorAddress, {from, gas: 8000000});
    assert.nestedProperty(result, 'events.DepositorRemove', 'Depositor was not removed successfully');
}


// Add withdrawer
export async function addWithdrawer(groupContract: GroupContract, withdrawerAddress: string, {from}: {from: string}) {
    let result = await groupContract.addWithdrawer(withdrawerAddress, {from, gas: 8000000});
    assert.nestedProperty(result, 'events.WithdrawerAdd', 'Withdrawer was not added successfully');
}


// Remove withdrawer
export async function removeWithdrawer(groupContract: GroupContract, withdrawerAddress: string, {from}: {from: string}) {
    let result = await groupContract.removeWithdrawer(withdrawerAddress, {from, gas: 8000000});
    assert.nestedProperty(result, 'events.WithdrawerRemove', 'Withdrawer was not removed successfully');
}


// Set the Rocket Pool fee
export async function setRocketPoolFee(rp: RocketPool, groupId: string, feeFraction: number, {from}: {from: string}) {
    await rp.group.setRocketPoolFee(groupId, feeFraction, {from, gas: 8000000});
    let groupContract = await rp.group.getContract(groupId);
    let rpFeeTest = await groupContract.getRocketPoolFee();
    assert.equal(rpFeeTest, feeFraction, 'Rocket Pool fee was not updated successfully');
}


// Set the group fee
export async function setGroupFee(groupContract: GroupContract, feeFraction: number, {from}: {from: string}) {
    await groupContract.setGroupFee(feeFraction, {from, gas: 8000000});
    let groupFeeTest = await groupContract.getGroupFee();
    assert.equal(groupFeeTest, feeFraction, 'Group fee was not updated successfully');
}


// Set the group fee address
export async function setGroupFeeAddress(groupContract: GroupContract, feeAddress: string, {from}: {from: string}) {
    await groupContract.setGroupFeeAddress(feeAddress, {from, gas: 8000000});
    let groupFeeAddressTest = await groupContract.getGroupFeeAddress();
    assert.equal(groupFeeAddressTest, feeAddress, 'Group fee address was not updated successfully');
}

