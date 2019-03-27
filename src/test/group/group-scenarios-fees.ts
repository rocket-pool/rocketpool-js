// Imports
import { assert } from 'chai';
import GroupContract from '../../rocketpool/group/group-contract';


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

