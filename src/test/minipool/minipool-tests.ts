// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import { getValidatorPubkey } from '../_utils/beacon';
import { takeSnapshot, revertSnapshot } from '../_utils/evm';
import { createMinipool, stakeMinipool } from '../_helpers/minipool';
import { submitExited } from './scenario-submit-exited';
import { submitWithdrawable } from './scenario-submit-withdrawable';

// Tests
export default function runMinipoolTests(web3: Web3, rp: RocketPool) {
    describe('Minipool', () => {


        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let trustedNode: string;
        let node1: string;
        let node2: string;


        // Minipool validator keys
        const stakingMinipoolPubkey = getValidatorPubkey();
        const exitedMinipoolPubkey = getValidatorPubkey();
        const withdrawableMinipoolPubkey = getValidatorPubkey();


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        let initializedMinipool: MinipoolContract;
        let prelaunchMinipool: MinipoolContract;
        let stakingMinipool: MinipoolContract;
        let exitedMinipool: MinipoolContract;
        let withdrawableMinipool: MinipoolContract;
        let dissolvedMinipool: MinipoolContract;
        let withdrawableMinipoolWithdrawalBalance = web3.utils.toWei('36', 'ether');
        before(async () => {

            // Get accounts
            [owner, trustedNode, node1, node2] = await web3.eth.getAccounts();

            // Register nodes
            await rp.node.registerNode('Australia/Brisbane', {from: node1, gas: gasLimit});
            await rp.node.registerNode('Australia/Brisbane', {from: node2, gas: gasLimit});
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode, gas: gasLimit});
            await rp.node.setNodeTrusted(trustedNode, true, {from: owner, gas: gasLimit});

            // Create minipools
             initializedMinipool = (await createMinipool(web3, rp, {from: node1, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);
               prelaunchMinipool = (await createMinipool(web3, rp, {from: node1, value: web3.utils.toWei('32', 'ether'), gas: gasLimit}) as MinipoolContract);
                 stakingMinipool = (await createMinipool(web3, rp, {from: node1, value: web3.utils.toWei('32', 'ether'), gas: gasLimit}) as MinipoolContract);
                  exitedMinipool = (await createMinipool(web3, rp, {from: node1, value: web3.utils.toWei('32', 'ether'), gas: gasLimit}) as MinipoolContract);
            withdrawableMinipool = (await createMinipool(web3, rp, {from: node2, value: web3.utils.toWei('32', 'ether'), gas: gasLimit}) as MinipoolContract);
               dissolvedMinipool = (await createMinipool(web3, rp, {from: node2, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);

            // Stake minipools
            await stakeMinipool(web3, rp, stakingMinipool, stakingMinipoolPubkey, {from: node1, gas: gasLimit});
            await stakeMinipool(web3, rp, exitedMinipool, exitedMinipoolPubkey, {from: node1, gas: gasLimit});
            await stakeMinipool(web3, rp, withdrawableMinipool, withdrawableMinipoolPubkey, {from: node2, gas: gasLimit});

            // Set minipools to exited
            await rp.minipool.submitMinipoolExited(exitedMinipool.address, 1, {from: trustedNode, gas: gasLimit});
            await rp.minipool.submitMinipoolExited(withdrawableMinipool.address, 1, {from: trustedNode, gas: gasLimit});

            // Set minipool to withdrawable
            await rp.minipool.submitMinipoolWithdrawable(withdrawableMinipool.address, withdrawableMinipoolWithdrawalBalance, 2, {from: trustedNode, gas: gasLimit});

            // Dissolve minipool
            await dissolvedMinipool.dissolve({from: node2, gas: gasLimit});

        });


        describe('Manager', () => {

            it('Can get minipool details', async () => {

                // Get details
                let allMinipools = await rp.minipool.getMinipools();
                let node1Minipools = await rp.minipool.getNodeMinipools(node1);

                // Check minipool indexes
                assert.equal(allMinipools.length, 6, 'Incorrect total minipool count');
                assert.equal(node1Minipools.length, 4, 'Incorrect node minipool count');

                // Check minipoole existence
                assert.isTrue(allMinipools[0].exists, 'Incorrect minipool exists status');
                assert.isTrue(allMinipools[1].exists, 'Incorrect minipool exists status');
                assert.isTrue(allMinipools[2].exists, 'Incorrect minipool exists status');
                assert.isTrue(allMinipools[3].exists, 'Incorrect minipool exists status');
                assert.isTrue(allMinipools[4].exists, 'Incorrect minipool exists status');
                assert.isTrue(allMinipools[5].exists, 'Incorrect minipool exists status');

                // Check minipool pubkeys
                assert.isNull(allMinipools[0].pubkey, 'Incorrect minipool pubkey');
                assert.isNull(allMinipools[1].pubkey, 'Incorrect minipool pubkey');
                assert.equal(allMinipools[2].pubkey.substr(2), stakingMinipoolPubkey.toString('hex'), 'Incorrect minipool pubkey');
                assert.equal(allMinipools[3].pubkey.substr(2), exitedMinipoolPubkey.toString('hex'), 'Incorrect minipool pubkey');
                assert.equal(allMinipools[4].pubkey.substr(2), withdrawableMinipoolPubkey.toString('hex'), 'Incorrect minipool pubkey');
                assert.isNull(allMinipools[5].pubkey, 'Incorrect minipool pubkey');

                // Check minipool withdrawal balances
                assert(web3.utils.toBN(allMinipools[0].withdrawalTotalBalance).eq(web3.utils.toBN(web3.utils.toWei('0', 'ether'))), 'Incorrect minipool withdrawal balance');
                assert(web3.utils.toBN(allMinipools[1].withdrawalTotalBalance).eq(web3.utils.toBN(web3.utils.toWei('0', 'ether'))), 'Incorrect minipool withdrawal balance');
                assert(web3.utils.toBN(allMinipools[2].withdrawalTotalBalance).eq(web3.utils.toBN(web3.utils.toWei('0', 'ether'))), 'Incorrect minipool withdrawal balance');
                assert(web3.utils.toBN(allMinipools[3].withdrawalTotalBalance).eq(web3.utils.toBN(web3.utils.toWei('0', 'ether'))), 'Incorrect minipool withdrawal balance');
                assert(web3.utils.toBN(allMinipools[4].withdrawalTotalBalance).eq(web3.utils.toBN(withdrawableMinipoolWithdrawalBalance)), 'Incorrect minipool withdrawal balance');
                assert(web3.utils.toBN(allMinipools[5].withdrawalTotalBalance).eq(web3.utils.toBN(web3.utils.toWei('0', 'ether'))), 'Incorrect minipool withdrawal balance');

                // Check minipool withdrawable statuses
                assert.isFalse(allMinipools[0].withdrawable, 'Incorrect minipool withdrawable status');
                assert.isFalse(allMinipools[1].withdrawable, 'Incorrect minipool withdrawable status');
                assert.isFalse(allMinipools[2].withdrawable, 'Incorrect minipool withdrawable status');
                assert.isFalse(allMinipools[3].withdrawable, 'Incorrect minipool withdrawable status');
                assert.isTrue(allMinipools[4].withdrawable, 'Incorrect minipool withdrawable status');
                assert.isFalse(allMinipools[5].withdrawable, 'Incorrect minipool withdrawable status');

                // Get & check minipool by pubkey
                let stakingPubkeyMinipoolAddress = await rp.minipool.getMinipoolByPubkey(stakingMinipoolPubkey);
                assert.equal(stakingPubkeyMinipoolAddress, stakingMinipool.address, 'Incorrect minipool by pubkey');

            });

        });


        describe('Queue', () => {

            it('Can get queue details', async () => {

                // Get details
                let [totalLength, totalCapacity, nextCapacity] = await Promise.all([
                    rp.minipool.getQueueTotalLength(),
                    rp.minipool.getQueueTotalCapacity(),
                    rp.minipool.getQueueNextCapacity(),
                ]);

                // Check details
                assert.equal(totalLength, 3, 'Incorrect minipool queue length');
                assert(web3.utils.toBN(totalCapacity).eq(web3.utils.toBN(web3.utils.toWei('48', 'ether'))), 'Incorrect minipool queue capacity');
                assert(web3.utils.toBN(nextCapacity).eq(web3.utils.toBN(web3.utils.toWei('16', 'ether'))), 'Incorrect minipool queue next item capacity');

            });

        });


        describe('Status', () => {

            it('Can submit an exited event', async () => {
                await submitExited(web3, rp, stakingMinipool, 1, {
                    from: trustedNode,
                    gas: gasLimit,
                });
            });

            it('Can submit a withdrawable event', async () => {
                await submitWithdrawable(web3, rp, exitedMinipool, web3.utils.toWei('36', 'ether'), 2, {
                    from: trustedNode,
                    gas: gasLimit,
                });
            });

        });


    });
};
