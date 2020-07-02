// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { takeSnapshot, revertSnapshot } from '../_utils/evm';
import { setDepositSetting } from '../_helpers/settings';
import { deposit } from './scenario-deposit';
import { assignDeposits } from './scenario-assign-deposits';

// Tests
export default function runDepositTests(web3: Web3, rp: RocketPool) {
    describe('Deposit', () => {


        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let node: string;
        let staker: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        before(async () => {

            // Get accounts
            [owner, node, staker] = await web3.eth.getAccounts();

            // Register node
            await rp.node.registerNode('Australia/Brisbane', {
                from: node,
                gas: gasLimit,
            });

        });


        it('Can get the deposit pool balance', async () => {

            // Set parameters
            const depositAmount = web3.utils.toBN(web3.utils.toWei('20', 'ether'));

            // Deposit
            await rp.deposit.deposit({
                from: staker,
                value: depositAmount,
                gas: gasLimit,
            });

            // Get & check balance
            let balance = await rp.deposit.getBalance().then(value => web3.utils.toBN(value));
            assert(balance.eq(depositAmount), 'Incorrect deposit pool balance');

        });


        it('Can make a deposit', async () => {

            // Deposit
            await deposit(web3, rp, {
                from: staker,
                value: web3.utils.toWei('10', 'ether'),
                gas: gasLimit,
            });

        });


        it('Can assign deposits', async () => {

            // Disable deposit assignments
            await setDepositSetting(rp, 'AssignDepositsEnabled', false, {from: owner});

            // Make user & node deposits
            await rp.deposit.deposit({
                from: staker,
                value: web3.utils.toWei('16', 'ether'),
                gas: gasLimit,
            });
            await rp.node.deposit(0, {
                from: node,
                value: web3.utils.toWei('16', 'ether'),
                gas: gasLimit,
            });

            // Re-enable deposit assignments
            await setDepositSetting(rp, 'AssignDepositsEnabled', true, {from: owner});

            // Assign deposits
            await assignDeposits(web3, rp, {
                from: staker,
                gas: gasLimit,
            });

        });


    });
};
