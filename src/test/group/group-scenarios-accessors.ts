// Imports
import { assert } from 'chai';
import RocketPool from '../../rocketpool/rocketpool';
import GroupContract from '../../rocketpool/group/group-contract';


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
export async function addDepositor(groupContract: GroupContract, {depositorAddress, from}: {depositorAddress: string, from: string}) {
    let result = await groupContract.addDepositor(depositorAddress, {from, gas: 8000000});
    assert.nestedProperty(result, 'events.DepositorAdd', 'Depositor was not added successfully');
}


// Remove depositor
export async function removeDepositor(groupContract: GroupContract, {depositorAddress, from}: {depositorAddress: string, from: string}) {
    let result = await groupContract.removeDepositor(depositorAddress, {from, gas: 8000000});
    assert.nestedProperty(result, 'events.DepositorRemove', 'Depositor was not removed successfully');
}


// Add withdrawer
export async function addWithdrawer(groupContract: GroupContract, {withdrawerAddress, from}: {withdrawerAddress: string, from: string}) {
    let result = await groupContract.addWithdrawer(withdrawerAddress, {from, gas: 8000000});
    assert.nestedProperty(result, 'events.WithdrawerAdd', 'Withdrawer was not added successfully');
}


// Remove withdrawer
export async function removeWithdrawer(groupContract: GroupContract, {withdrawerAddress, from}: {withdrawerAddress: string, from: string}) {
    let result = await groupContract.removeWithdrawer(withdrawerAddress, {from, gas: 8000000});
    assert.nestedProperty(result, 'events.WithdrawerRemove', 'Withdrawer was not removed successfully');
}

