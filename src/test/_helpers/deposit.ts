// Imports
import RocketPool from '../../rocketpool/rocketpool';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';


// Make a deposit
export async function deposit(rp: RocketPool, {depositorContract, groupId, stakingDurationId, from, value}: {depositorContract: GroupAccessorContract, groupId: string, stakingDurationId: string, from: string, value: string}) {
    await depositorContract.deposit(stakingDurationId, {from, value, gas: 8000000});
    let queuedDepositId = await rp.deposit.getQueuedDepositAt(groupId, from, stakingDurationId, 0);
    return queuedDepositId;
}


// Withdraw a deposit from a staking minipool
export async function withdrawStakingMinipoolDeposit({withdrawerContract, depositId, minipoolAddress, weiAmount, from}: {withdrawerContract: GroupAccessorContract, depositId: string, minipoolAddress: string, weiAmount: string, from: string}) {
    await withdrawerContract.withdrawStakingMinipoolDeposit(depositId, minipoolAddress, weiAmount, {from, gas: 8000000});
}


// Clear deposits made by a user
export async function clearDeposits(rp: RocketPool, {depositorContract, groupId, userId, stakingDurationId}: {depositorContract: GroupAccessorContract, groupId: string, userId: string, stakingDurationId: string}) {

    // While user has queued deposits
    let depositCount = await rp.deposit.getQueuedDepositCount(groupId, userId, stakingDurationId);
    while (depositCount > 0) {

        // Refund queued deposit
        let depositId = await rp.deposit.getQueuedDepositAt(groupId, userId, stakingDurationId, 0);
        await depositorContract.refundQueuedDeposit(stakingDurationId, depositId, {from: userId, gas: 8000000});

        depositCount = await rp.deposit.getQueuedDepositCount(groupId, userId, stakingDurationId);
    }

}

