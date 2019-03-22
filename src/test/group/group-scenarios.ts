// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';


// Register group
export async function registerGroup(web3: Web3, rp: RocketPool, {from}: {from: string}): Promise<[string, string]> {
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

    // Return group name and ID
    return [groupName, groupId];

}

