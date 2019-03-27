// Imports
import { assert } from 'chai';
import RocketPool from '../../rocketpool/rocketpool';


// Register group
export async function registerGroup(rp: RocketPool, {stakingFeeFraction, from}: {stakingFeeFraction: number, from: string}): Promise<[string, string]> {
    const rocketGroupAPI = await rp.contracts.get('rocketGroupAPI');

    // Group name and ID
    let groupName: string = '';
    let groupId: string = '';

    // Get group registration fee
    let newGroupFee = await rp.settings.group.getNewFee();

    // Get new group name
    let groupAddEvents = await rocketGroupAPI.getPastEvents('GroupAdd', {fromBlock: 0});
    groupName = ('Group ' + groupAddEvents.length);

    // Register group
    let result = await rp.group.add(groupName, stakingFeeFraction, {from, gas: 8000000, value: newGroupFee});
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

