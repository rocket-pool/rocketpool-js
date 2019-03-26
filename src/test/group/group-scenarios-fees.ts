// Imports
import { assert } from 'chai';
import RocketPool from '../../rocketpool/rocketpool';
import GroupContract from '../../rocketpool/group/group-contract';


// Set the Rocket Pool fee
export async function setRocketPoolFee(rp: RocketPool, {groupId, feeFraction, from}: {groupId: string, feeFraction: number, from: string}) {
    await rp.group.setRocketPoolFee(groupId, feeFraction, {from, gas: 8000000});
    let groupContract = await rp.group.getContract(groupId);
    let rpFeeTest = await groupContract.getRocketPoolFee();
    assert.equal(rpFeeTest, feeFraction, 'Rocket Pool fee was not updated successfully');
}


// Set the group fee
export async function setGroupFee(groupContract: GroupContract, {feeFraction, from}: {feeFraction: number, from: string}) {
    await groupContract.setGroupFee(feeFraction, {from, gas: 8000000});
    let groupFeeTest = await groupContract.getGroupFee();
    assert.equal(groupFeeTest, feeFraction, 'Group fee was not updated successfully');
}


// Set the group fee address
export async function setGroupFeeAddress(groupContract: GroupContract, {feeAddress, from}: {feeAddress: string, from: string}) {
    await groupContract.setGroupFeeAddress(feeAddress, {from, gas: 8000000});
    let groupFeeAddressTest = await groupContract.getGroupFeeAddress();
    assert.equal(groupFeeAddressTest, feeAddress, 'Group fee address was not updated successfully');
}

