// Imports
import { assert } from 'chai';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';


// Deposit
export async function deposit(groupAccessorContract: GroupAccessorContract, {durationId, from, value}: {durationId: string, from: string, value: string}) {
	await groupAccessorContract.deposit(durationId, {from, value, gas: 8000000});
}

