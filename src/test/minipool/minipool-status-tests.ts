// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import {takeSnapshot, revertSnapshot} from '../_utils/evm';
import {createMinipool, getMinipoolMinimumRPLStake, stakeMinipool} from '../_helpers/minipool';
import {nodeStakeRPL, setNodeTrusted} from '../_helpers/node';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {userDeposit} from '../_helpers/deposit';
import {mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {submitWithdrawable} from './scenario-submit-withdrawable';

// Tests
export default function runMinipoolStatusTests(web3: Web3, rp: RocketPool) {
    describe('Minipool Status Tests', () => {

        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let node: string;
        let trustedNode1: string;
        let trustedNode2: string;
        let trustedNode3: string;
        let staker: string;
        let random: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        let stakingMinipool1: MinipoolContract;
        let stakingMinipool2: MinipoolContract;
        let stakingMinipool3: MinipoolContract;

        before(async () => {

            // Get accounts
            [owner, node, trustedNode1, trustedNode2, trustedNode3, staker, random] = await web3.eth.getAccounts();

            // Register node & set withdrawal address
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});

            // Register trusted node
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode1, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode1, 'saas_1', 'node@home.com', owner);
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode2, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode2, 'saas_2', 'node@home.com', owner);
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode3, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode3, 'saas_3', 'node@home.com', owner);


            // Stake RPL to cover minipools
            let minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
            let rplStake = minipoolRplStake.mul(web3.utils.toBN(3));
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node, gas: gasLimit});

            // Create minipools
            stakingMinipool1 = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);
            stakingMinipool2 = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);
            stakingMinipool3 = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);

            // Make and assign deposits to minipools
            await userDeposit(web3, rp, {from: staker, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});
            await userDeposit(web3, rp,{from: staker, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});
            await userDeposit(web3, rp,{from: staker, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});

            // Stake minipools
            await stakeMinipool(web3, rp, stakingMinipool1, null, {from: node, gas: gasLimit});
            await stakeMinipool(web3, rp, stakingMinipool2, null, {from: node, gas: gasLimit});
            await stakeMinipool(web3, rp, stakingMinipool3, null, {from: node, gas: gasLimit});

            // Check minipool statuses
            let stakingStatus1 = await stakingMinipool1.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            let stakingStatus2 = await stakingMinipool2.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            let stakingStatus3 = await stakingMinipool3.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));

            assert(stakingStatus1.eq(web3.utils.toBN(2)), 'Incorrect staking minipool status');
            assert(stakingStatus2.eq(web3.utils.toBN(2)), 'Incorrect staking minipool status');
            assert(stakingStatus3.eq(web3.utils.toBN(2)), 'Incorrect staking minipool status');

        });


        //
        // Submit withdrawable
        //
        it(printTitle('trusted nodes', 'can submit a withdrawable event for a staking minipool'), async () => {

            // Set parameters
            let startBalance1 = web3.utils.toWei('32', 'ether');
            let endBalance1 = web3.utils.toWei('36', 'ether');
            let startBalance2 = web3.utils.toWei('32', 'ether');
            let endBalance2 = web3.utils.toWei('28', 'ether');
            let startBalance3 = web3.utils.toWei('32', 'ether');
            let endBalance3 = web3.utils.toWei('14', 'ether');

            // Submit different withdrawable events
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance1, web3.utils.toWei('37', 'ether'), {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance1, web3.utils.toWei('38', 'ether'), {
                from: trustedNode2,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance1, web3.utils.toWei('39', 'ether'), {
                from: trustedNode3,
                gas: gasLimit
            });

            // Submit identical withdrawable events to trigger update:

            // Minipool 1 - rewards earned
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance1, endBalance1, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance1, endBalance1, {
                from: trustedNode2,
                gas: gasLimit
            });

            // Minipool 2 - penalties applied
            await submitWithdrawable(web3, rp, stakingMinipool2.address, startBalance2, endBalance2, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool2.address, startBalance2, endBalance2, {
                from: trustedNode2,
                gas: gasLimit
            });

            // Minipool 3 - penalties applied & RPL slashed
            await submitWithdrawable(web3, rp, stakingMinipool3.address, startBalance3, endBalance3, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool3.address, startBalance3, endBalance3, {
                from: trustedNode2,
                gas: gasLimit
            });

        });

        it(printTitle('trusted nodes', 'cannot submit a withdrawable event for a minipool while withdrawable submissions are disabled'), async () => {

            // Set parameters
            let startBalance = web3.utils.toWei('32', 'ether');
            let endBalance = web3.utils.toWei('36', 'ether');

            // Disable submissions
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsMinipool', 'minipool.submit.withdrawable.enabled', false, {from: owner});

            // Attempt to submit withdrawable event for staking minipool
            await shouldRevert(submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance, endBalance, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted a withdrawable event while withdrawable submissions were disabled', 'Submitting withdrawable status is currently disabled');

        });

        it(printTitle('trusted nodes', 'cannot submit a withdrawable event for a minipool which is not staking'), async () => {

            // Set parameters
            let startBalance = web3.utils.toWei('32', 'ether');
            let endBalance = web3.utils.toWei('36', 'ether');

            // Submit withdrawable events to trigger update
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance, endBalance, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance, endBalance, {
                from: trustedNode2,
                gas: gasLimit
            });

            // Attempt to submit withdrawable event for withdrawable minipool
            await shouldRevert(submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance, endBalance, {
                from: trustedNode3,
                gas: gasLimit
            }), 'Submitted a withdrawable event for a minipool which was not staking', 'Minipool can only be set as withdrawable while staking');

        });

        it(printTitle('trusted nodes', 'cannot submit a withdrawable event for an invalid minipool'), async () => {

            // Set parameters
            let startBalance = web3.utils.toWei('32', 'ether');
            let endBalance = web3.utils.toWei('36', 'ether');

            // Attempt to submit withdrawable event for invalid minipool
            await shouldRevert(submitWithdrawable(web3, rp, random, startBalance, endBalance, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted a withdrawable event for an invalid minipool', 'Invalid minipool');

        });

        it(printTitle('trusted nodes', 'cannot submit a withdrawable event for a minipool twice'), async () => {

            // Set parameters
            let startBalance = web3.utils.toWei('32', 'ether');
            let endBalance = web3.utils.toWei('36', 'ether');

            // Submit withdrawable event for staking minipool
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance, endBalance, {
                from: trustedNode1,
                gas: gasLimit
            });

            // Attempt to submit withdrawable event for staking minipool again
            await shouldRevert(submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance, endBalance, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted the same withdrawable event for a minipool twice', 'Duplicate submission from node');

        });

        it(printTitle('regular nodes', 'cannot submit a withdrawable event for a minipool'), async () => {

            // Set parameters
            let startBalance = web3.utils.toWei('32', 'ether');
            let endBalance = web3.utils.toWei('36', 'ether');

            // Attempt to submit withdrawable event for staking minipool
            await shouldRevert(submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance, endBalance, {
                from: node,
                gas: gasLimit
            }), 'Regular node submitted a withdrawable event for a minipool', 'Invalid trusted node');

        });


    });
};
