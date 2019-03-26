// Imports
import { assert } from 'chai';
import RocketPool from '../../rocketpool/rocketpool';
import NodeContract from '../../rocketpool/node/node-contract';


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

