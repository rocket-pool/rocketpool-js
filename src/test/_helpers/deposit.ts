// Imports
import RocketPool from '../../rocketpool/rocketpool';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';


// Clear deposits made by a user
export async function clearDeposits(rp: RocketPool, depositorContract: GroupAccessorContract, groupId: string, userId: string, durationId: string) {

    // While user has queued deposits
    let depositCount = await rp.deposit.getQueuedDepositCount(groupId, userId, durationId);
    while (depositCount > 0) {

        // Refund queued deposit
        let depositId = await rp.deposit.getQueuedDepositAt(groupId, userId, durationId, 0);
        await depositorContract.refundQueuedDeposit(durationId, depositId, {from: userId, gas: 8000000});

        depositCount = await rp.deposit.getQueuedDepositCount(groupId, userId, durationId);
    }

}

