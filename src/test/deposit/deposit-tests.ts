// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { takeSnapshot, revertSnapshot } from '../_utils/evm';
import { deposit } from './scenario-deposit';

// Tests
export default function runDepositTests(web3: Web3, rp: RocketPool) {
    describe('Deposit', () => {


        // Accounts
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
            [staker] = await web3.eth.getAccounts();

        });


        // Deposits
        describe('Deposits', () => {

            it('Can make a deposit', async () => {
                await deposit(web3, rp, {
                    from: staker,
                    value: web3.utils.toWei('10', 'ether'),
                    gas: 8000000,
                });
            });

        });


    });
};
