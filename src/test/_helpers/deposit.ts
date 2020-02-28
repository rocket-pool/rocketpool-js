// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';
import { getWithdrawalPubkey, getWithdrawalCredentials } from './casper';


// Set Rocket Pool withdrawal credentials
export async function setRocketPoolWithdrawalKey(web3: Web3, rp: RocketPool, {nodeOperator, owner}: {nodeOperator: string, owner: string}) {

    // Register node
    let rocketNodeAPI = await rp.contracts.get('rocketNodeAPI');
    await rocketNodeAPI.methods.add('Australia/Brisbane').send({from: nodeOperator, gas: 8000000});

    // Set node trusted status
    let rocketAdmin = await rp.contracts.get('rocketAdmin');
    await rocketAdmin.methods.setNodeTrusted(nodeOperator, true).send({from: owner, gas: 8000000});

    // Set withdrawal credentials
    let rocketNodeWatchtower = await rp.contracts.get('rocketNodeWatchtower');
    await rocketNodeWatchtower.methods.updateWithdrawalKey(getWithdrawalPubkey(web3), getWithdrawalCredentials(web3)).send({from: nodeOperator, gas: 8000000});

}


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

