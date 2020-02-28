// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';
import { setRocketPoolWithdrawalKey, deposit, clearDeposits } from '../_helpers/deposit';
import { registerGroup, createGroupAccessor } from '../_helpers/group';

// Tests
export default function runDepositTests(web3: Web3, rp: RocketPool): void {
    describe('Deposit', (): void => {


        // Accounts
        let owner: string;
        let groupOwner: string;
        let depositor: string;
        let withdrawalKeyOperator: string;

        // Group details
        let groupName: string;
        let groupId: string;
        let groupAccessorContract: GroupAccessorContract;


        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            owner = accounts[0];
            groupOwner = accounts[1];
            depositor = accounts[2];
            withdrawalKeyOperator = accounts[9];

            // Create group & accessor
            [groupName, groupId] = await registerGroup(rp, {groupOwner});
            let groupAccessorAddress = await createGroupAccessor(rp, {groupId, groupOwner});
            groupAccessorContract = await rp.group.getAccessorContract(groupAccessorAddress);

            // Set RP withdrawal credentials
            await setRocketPoolWithdrawalKey(web3, rp, {nodeOperator: withdrawalKeyOperator, owner});

        });


        // Queued deposits
        describe('Queued Deposits', (): void => {

            it('Can get a user\'s queued deposits', async () => {

                // Deposit
                await deposit(rp, {depositorContract: groupAccessorContract, groupId, stakingDurationId: '3m', from: depositor, value: web3.utils.toWei('4', 'ether')});
                await deposit(rp, {depositorContract: groupAccessorContract, groupId, stakingDurationId: '3m', from: depositor, value: web3.utils.toWei('5', 'ether')});
                await deposit(rp, {depositorContract: groupAccessorContract, groupId, stakingDurationId: '3m', from: depositor, value: web3.utils.toWei('6', 'ether')});

                // Check queued deposits
                let deposits = await rp.deposit.getQueuedDeposits(groupId, depositor, '3m');
                assert.equal(deposits.length, 3, 'Queued deposit count is incorrect');
                assert.equal(parseInt(deposits[0].queuedAmount), parseInt(web3.utils.toWei('4', 'ether')), 'Incorrect queued deposit balance');
                assert.equal(parseInt(deposits[1].queuedAmount), parseInt(web3.utils.toWei('5', 'ether')), 'Incorrect queued deposit balance');
                assert.equal(parseInt(deposits[2].queuedAmount), parseInt(web3.utils.toWei('6', 'ether')), 'Incorrect queued deposit balance');

                // Clear deposits
                await clearDeposits(rp, {depositorContract: groupAccessorContract, groupId, userId: depositor, stakingDurationId: '3m'});

            });

        });


    });
};
