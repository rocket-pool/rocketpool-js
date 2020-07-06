// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { takeSnapshot, revertSnapshot } from '../_utils/evm';
import { transfer } from './scenario-transfer';
import { transferFrom } from './scenario-transfer-from';

// Tests
export default function runNodeTests(web3: Web3, rp: RocketPool) {
    describe('Tokens', () => {


        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let staker: string;
        let random: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        let rethAmount = web3.utils.toWei('10', 'ether');
        before(async () => {

            // Get accounts
            [owner, staker, random] = await web3.eth.getAccounts();

            // Make deposit / mint rETH
            await rp.deposit.deposit({from: staker, value: rethAmount, gas: gasLimit});

        });


        describe('Tokens', () => {

            it('Can get token balance', async () => {

                // Get & check balance
                let rethBalance = await rp.tokens.reth.balanceOf(staker);
                assert(web3.utils.toBN(rethBalance).eq(web3.utils.toBN(rethAmount)), 'Incorrect token balance');

            });

            it('Can get token transfer allowance', async () => {

                // Set allowance
                await rp.tokens.reth.approve(random, rethAmount, {from: staker, gas: gasLimit});

                // Get & check allowance
                let allowance = await rp.tokens.reth.allowance(staker, random);
                assert(web3.utils.toBN(allowance).eq(web3.utils.toBN(rethAmount)), 'Incorrect token allowance');

            });

            it('Can transfer tokens', async () => {
                await transfer(web3, rp.tokens.reth, staker, random, rethAmount, gasLimit);
            });

            it('Can transfer tokens from an address', async () => {
                await transferFrom(web3, rp.tokens.reth, staker, random, rethAmount, gasLimit);
            });

        });


    });
}
