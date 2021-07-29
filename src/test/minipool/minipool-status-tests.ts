// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import {takeSnapshot, revertSnapshot, mineBlocks, getCurrentTime, increaseTime} from '../_utils/evm';
import {createMinipool, getMinipoolMinimumRPLStake, stakeMinipool} from '../_helpers/minipool';
import {nodeStakeRPL, setNodeTrusted} from '../_helpers/node';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {userDeposit} from '../_helpers/deposit';
import {mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {executeSetWithdrawable, submitWithdrawable} from './scenario-submit-withdrawable';
import {setDAONodeTrustedBootstrapSetting} from '../dao/scenario-dao-node-trusted-bootstrap';
import {daoNodeTrustedExecute, daoNodeTrustedMemberLeave, daoNodeTrustedPropose, daoNodeTrustedVote} from '../dao/scenario-dao-node-trusted';
import {getDAOProposalEndTime, getDAOProposalStartBlock} from '../dao/scenario-dao-proposal';

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
        let trustedNode4: string;
        let staker: string;
        let random: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });

        // Constants
        let proposalCooldown = 10
        let proposalVoteBlocks = 10
        let proposalVoteDelayBlocks = 4;

        // Setup
        let stakingMinipool1: MinipoolContract;
        let stakingMinipool2: MinipoolContract;
        let stakingMinipool3: MinipoolContract;

        before(async () => {

            // Get accounts
            [owner, node, trustedNode1, trustedNode2, trustedNode3, trustedNode4, staker, random] = await web3.eth.getAccounts();

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


            // Set a small proposal cooldown
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.cooldown', proposalCooldown, { from: owner, gas: gasLimit });
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.vote.blocks', proposalVoteBlocks, { from: owner, gas: gasLimit });
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.vote.delay.blocks', proposalVoteDelayBlocks, { from: owner, gas: gasLimit });

        });


        async function trustedNode4JoinDao() {
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode4, gas: gasLimit})
            await setNodeTrusted(web3, rp, trustedNode4, 'saas_4', 'node@home.com', owner);
        }


        async function trustedNode4LeaveDao() {
            // Wait enough time to do a new proposal
            await mineBlocks(web3, proposalCooldown);
            // Encode the calldata for the proposal
            let proposalCallData = web3.eth.abi.encodeFunctionCall(
                {name: 'proposalLeave', type: 'function', inputs: [{type: 'address', name: '_nodeAddress'}]},
                [trustedNode4]
            );

            // Add the proposal
            let proposalId = await daoNodeTrustedPropose(web3, rp,'hey guys, can I please leave the DAO?', proposalCallData, {
                from: trustedNode4,
                gas: gasLimit
            });
            // Current block
            let timeCurrent = await getCurrentTime(web3);
            // Now mine blocks until the proposal is 'active' and can be voted on
            await increaseTime(web3, (await getDAOProposalStartBlock(web3, rp, proposalId)-timeCurrent)+2);
            // Now lets vote
            await daoNodeTrustedVote(web3, rp, proposalId, true, { from: trustedNode1, gas: gasLimit });
            await daoNodeTrustedVote(web3, rp, proposalId, true, { from: trustedNode2, gas: gasLimit });
            await daoNodeTrustedVote(web3, rp, proposalId, true, { from: trustedNode3, gas: gasLimit });
            // Fast forward to this voting period finishing
            timeCurrent = await getCurrentTime(web3);
            await increaseTime(web3, (await getDAOProposalEndTime(web3, rp, proposalId)-timeCurrent)+2);
            // Proposal should be successful, lets execute it
            await daoNodeTrustedExecute(web3, rp, proposalId, { from: trustedNode1, gas: gasLimit });
            // Member can now leave and collect any RPL bond
            await daoNodeTrustedMemberLeave(web3, rp, trustedNode4, { from: trustedNode4, gas: gasLimit });
        }


        //
        // Submit withdrawable
        //
        it(printTitle('trusted nodes', 'can submit a withdrawable event for a staking minipool'), async () => {

            // Minipool 1 - rewards earned
            await submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode2,
                gas: gasLimit
            });

            // Minipool 2 - penalties applied
            await submitWithdrawable(web3, rp, stakingMinipool2.address, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool2.address, {
                from: trustedNode2,
                gas: gasLimit
            });

            // Minipool 3 - penalties applied & RPL slashed
            await submitWithdrawable(web3, rp, stakingMinipool3.address, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool3.address, {
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
            await shouldRevert(submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted a withdrawable event while withdrawable submissions were disabled', 'Submitting withdrawable status is currently disabled');

        });


        it(printTitle('trusted nodes', 'cannot submit a withdrawable event for a minipool which is not staking'), async () => {

            // Set parameters
            let startBalance = web3.utils.toWei('32', 'ether');
            let endBalance = web3.utils.toWei('36', 'ether');

            // Submit withdrawable events to trigger update
            await submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode2,
                gas: gasLimit
            });

            // Attempt to submit withdrawable event for withdrawable minipool
            await shouldRevert(submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode3,
                gas: gasLimit
            }), 'Submitted a withdrawable event for a minipool which was not staking', 'Minipool can only be set as withdrawable while staking');

        });


        it(printTitle('trusted nodes', 'cannot submit a withdrawable event for an invalid minipool'), async () => {

            // Set parameters
            let startBalance = web3.utils.toWei('32', 'ether');
            let endBalance = web3.utils.toWei('36', 'ether');

            // Attempt to submit withdrawable event for invalid minipool
            await shouldRevert(submitWithdrawable(web3, rp, random, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted a withdrawable event for an invalid minipool', 'Invalid minipool');

        });


        it(printTitle('trusted nodes', 'cannot submit a withdrawable event for a minipool twice'), async () => {

            // Set parameters
            let startBalance = web3.utils.toWei('32', 'ether');
            let endBalance = web3.utils.toWei('36', 'ether');

            // Submit withdrawable event for staking minipool
            await submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode1,
                gas: gasLimit
            });

            // Attempt to submit withdrawable event for staking minipool again
            await shouldRevert(submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted the same withdrawable event for a minipool twice', 'Duplicate submission from node');

        });


        it(printTitle('regular nodes', 'cannot submit a withdrawable event for a minipool'), async () => {

            // Set parameters
            let startBalance = web3.utils.toWei('32', 'ether');
            let endBalance = web3.utils.toWei('36', 'ether');

            // Attempt to submit withdrawable event for staking minipool
            await shouldRevert(submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: node,
                gas: gasLimit
            }), 'Regular node submitted a withdrawable event for a minipool', 'Invalid trusted node');

        });


        it(printTitle('random', 'can execute status update when consensus is reached after member count changes'), async () => {
            // Setup
            await trustedNode4JoinDao();
            // Set parameters
            let startBalance = web3.utils.toWei('32', 'ether');
            let endBalance = web3.utils.toWei('36', 'ether');
            // Submit status from 2 nodes (not enough for 4 member consensus but enough for 3)
            await submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode2,
                gas: gasLimit
            });
            // trustedNode4 leaves the DAO
            await trustedNode4LeaveDao();
            // There is now consensus with the remaining 3 trusted nodes about the status, try to execute the update
            await executeSetWithdrawable(web3, rp, stakingMinipool1.address, {
                from: random,
                gas: gasLimit
            });
        });


        it(printTitle('random', 'cannot execute status update without consensus'), async () => {
            // Setup
            await trustedNode4JoinDao();
            // Submit same price from 2 nodes (not enough for 4 member consensus)
            await submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, {
                from: trustedNode2,
                gas: gasLimit
            });
            // There is no consensus so execute should fail
            await shouldRevert(executeSetWithdrawable(web3, rp, stakingMinipool1.address, {
                from: random,
                gas: gasLimit
            }), 'Random account could execute update status without consensus', 'Consensus has not been reached');
        });


    });
};
