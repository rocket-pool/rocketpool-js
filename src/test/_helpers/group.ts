// Imports
import RocketPool from '../../rocketpool/rocketpool';


// Register a group
export async function registerGroup(rp: RocketPool, {groupOwner}: {groupOwner: string}): Promise<[string, string]> {
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
    let result = await rp.group.add(groupName, 0.05, {from: groupOwner, gas: 8000000, value: newGroupFee});
    if (result.events !== undefined) groupId = result.events.GroupAdd.returnValues.ID;

    // Return group name and ID
    return [groupName, groupId];

}


// Create a group accessor
export async function createGroupAccessor(rp: RocketPool, {groupId, groupOwner}: {groupId: string, groupOwner: string}): Promise<string> {

    // Create accessor
    let result = await rp.group.createDefaultAccessor(groupId, {from: groupOwner, gas: 8000000});

    // Get accessor address
    let groupAccessorAddress: string = '';
    if (result.events !== undefined) groupAccessorAddress = result.events.GroupCreateDefaultAccessor.returnValues.accessorAddress;

    // Add accessor to group
    let groupContract = await rp.group.getContract(groupId);
    await groupContract.addDepositor(groupAccessorAddress, {from: groupOwner, gas: 8000000});
    await groupContract.addWithdrawer(groupAccessorAddress, {from: groupOwner, gas: 8000000});

    // Return accessor address
    return groupAccessorAddress;

}

