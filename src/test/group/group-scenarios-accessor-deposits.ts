// Imports
import { assert } from 'chai';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';


// Make a deposit
export async function deposit(groupAccessorContract: GroupAccessorContract, {durationId, from, value}: {durationId: string, from: string, value: string}) {
    // :TODO: add assertions
    await groupAccessorContract.deposit(durationId, {from, value, gas: 8000000});
}


// Refund a queued deposit
export async function refundQueuedDeposit(groupAccessorContract: GroupAccessorContract, {durationId, depositId, from}: {durationId: string, depositId: string, from: string}) {
	// :TODO: add assertions
	await groupAccessorContract.refundQueuedDeposit(durationId, depositId, {from, gas: 8000000});
}


// Refund a deposit from a stalled minipool
export async function refundStalledMinipoolDeposit(groupAccessorContract: GroupAccessorContract, {depositId, minipoolAddress, from}: {depositId: string, minipoolAddress: string, from: string}) {
	// :TODO: add assertions
	await groupAccessorContract.refundStalledMinipoolDeposit(depositId, minipoolAddress, {from, gas: 8000000});
}


// Withdraw a deposit from a staking minipool
export async function withdrawStakingMinipoolDeposit(groupAccessorContract: GroupAccessorContract, {depositId, minipoolAddress, weiAmount, from}: {depositId: string, minipoolAddress: string, weiAmount: string, from: string}) {
	// :TODO: add assertions
	await groupAccessorContract.withdrawStakingMinipoolDeposit(depositId, minipoolAddress, weiAmount, {from, gas: 8000000});
}


// Withdraw a deposit from a withdrawn minipool
export async function withdrawMinipoolDeposit(groupAccessorContract: GroupAccessorContract, {depositId, minipoolAddress, from}: {depositId: string, minipoolAddress: string, from: string}) {
	// :TODO: add assertions
	await groupAccessorContract.withdrawMinipoolDeposit(depositId, minipoolAddress, {from, gas: 8000000});
}

