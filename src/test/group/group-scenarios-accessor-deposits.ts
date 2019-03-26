// Imports
import { assert } from 'chai';
import RocketPool from '../../rocketpool/rocketpool';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';


// Make a deposit
export async function deposit(rp: RocketPool, groupAccessorContract: GroupAccessorContract, {groupId, durationId, from, value}: {groupId: string, durationId: string, from: string, value: string}): Promise<string> {
    // :TODO: add assertions
    let result = await groupAccessorContract.deposit(durationId, {from, value, gas: 8000000});
    let queuedDepositId = await rp.deposit.getQueuedDepositAt(groupId, from, durationId, 0);
    return queuedDepositId;
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

