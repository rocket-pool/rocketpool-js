// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks, increaseTime, getCurrentTime} from '../_utils/evm';
import {nodeDeposit, nodeStakeRPL, setNodeTrusted} from '../_helpers/node';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {executeUpdatePrices, submitPrices} from './scenario-submit-prices';
import {setDAONodeTrustedBootstrapSetting} from '../dao/scenario-dao-node-trusted-bootstrap';
import {daoNodeTrustedExecute, daoNodeTrustedMemberLeave, daoNodeTrustedPropose, daoNodeTrustedVote} from '../dao/scenario-dao-node-trusted';
import {getDAOProposalEndTime, getDAOProposalStartTime} from '../dao/scenario-dao-proposal';
import {mintRPL} from '../_helpers/tokens';

// Tests
export default function runNetworkPricesTests(web3: Web3, rp: RocketPool) {
    describe('Network Prices', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let owner: string;
        let node: string;
        let trustedNode1: string;
        let trustedNode2: string;
        let trustedNode3: string;
        let trustedNode4: string;
        let random: string;

        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });

        // Constants
        let proposalCooldown = 60 * 60
        let proposalVoteTime = 60 * 60
        let proposalVoteDelayBlocks = 4;


        before(async () => {

            // Get accounts
            [owner, node, trustedNode1, trustedNode2, trustedNode3, trustedNode4, random] = await web3.eth.getAccounts();

            // Register node
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});

            // Register trusted nodes
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode1, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode1, 'saas_1', 'node@home.com', owner);
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode2, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode2, 'saas_2', 'node@home.com', owner);
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode3, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode3, 'saas_3', 'node@home.com', owner);

            // Set a small proposal cooldown
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.cooldown', proposalCooldown, { from: owner, gas: gasLimit });
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.vote.blocks', proposalVoteTime, { from: owner, gas: gasLimit });
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.vote.delay.blocks', proposalVoteDelayBlocks, { from: owner, gas: gasLimit });

        });


        async function trustedNode4JoinDao() {
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode4, gas: gasLimit})
            await setNodeTrusted(web3, rp, trustedNode4, 'saas_4', 'node@home.com', owner);
        }


        async function trustedNode4LeaveDao() {
            // Wait enough time to do a new proposal
            await increaseTime(web3, proposalCooldown);
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
            await increaseTime(web3, (await getDAOProposalStartTime(web3, rp, proposalId)-timeCurrent)+2);
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


        it(printTitle('trusted nodes', 'can submit network prices'), async () => {

            // Set parameters
            let block = await web3.eth.getBlockNumber();
            let rplPrice = web3.utils.toWei('0.02', 'ether');

            // Submit different prices
            await submitPrices(web3, rp, block, web3.utils.toWei('0.03', 'ether'), {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitPrices(web3, rp, block, web3.utils.toWei('0.04', 'ether'), {
                from: trustedNode2,
                gas: gasLimit
            });
            await submitPrices(web3, rp, block, web3.utils.toWei('0.05', 'ether'), {
                from: trustedNode3,
                gas: gasLimit
            });

            // Set parameters
            block = await web3.eth.getBlockNumber();

            // Submit identical prices to trigger update
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode2,
                gas: gasLimit
            });

        });


        it(printTitle('trusted nodes', 'cannot submit network prices while price submissions are disabled'), async () => {

            // Set parameters
            let block = await web3.eth.getBlockNumber();
            let rplPrice = web3.utils.toWei('0.02', 'ether');

            // Disable submissions
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.submit.prices.enabled', false, {from: owner, gas: gasLimit});

            // Attempt to submit prices
            await shouldRevert(submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted prices while price submissions were disabled', 'Submitting prices is currently disabled');

        });


        it(printTitle('trusted nodes', 'cannot submit network prices for the current block or lower'), async () => {

            // Set parameters
            let block = await web3.eth.getBlockNumber();
            let rplPrice = web3.utils.toWei('0.02', 'ether');

            // Submit prices for block to trigger update
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode2,
                gas: gasLimit
            });

            // Attempt to submit prices for current block
            await shouldRevert(submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode3,
                gas: gasLimit
            }), 'Submitted prices for the current block', 'Network prices for an equal or higher block are set');

            // Attempt to submit prices for lower block
            await shouldRevert(submitPrices(web3, rp, block - 1, rplPrice, {
                from: trustedNode3,
                gas: gasLimit
            }), 'Submitted prices for a lower block', 'Network prices for an equal or higher block are set');

        });


        it(printTitle('trusted nodes', 'cannot submit the same network prices twice'), async () => {

            // Set parameters
            let block = await web3.eth.getBlockNumber();
            let rplPrice = web3.utils.toWei('0.02', 'ether');

            // Submit prices for block
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode1,
                gas: gasLimit
            });

            // Attempt to submit prices for block again
            await shouldRevert(submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted the same network prices twice', 'Duplicate submission from node');

        });


        it(printTitle('regular nodes', 'cannot submit network prices'), async () => {

            // Set parameters
            let block = await web3.eth.getBlockNumber();
            let rplPrice = web3.utils.toWei('0.02', 'ether');

            // Attempt to submit prices
            await shouldRevert(submitPrices(web3, rp, block, rplPrice, {
                from: node,
                gas: gasLimit
            }), 'Regular node submitted network prices', 'Invalid trusted node');

        });


        it(printTitle('random', 'can execute price update when consensus is reached after member count changes'), async () => {
            // Setup
            await trustedNode4JoinDao();
            // Set parameters
            let block = await web3.eth.getBlockNumber();
            let rplPrice = web3.utils.toWei('0.02', 'ether');
            // Submit same price from 2 nodes (not enough for 4 member consensus but enough for 3)
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode2,
                gas: gasLimit
            });
            // trustedNode4 leaves the DAO
            await trustedNode4LeaveDao();
            // There is now consensus with the remaining 3 trusted nodes about the price, try to execute the update
            await executeUpdatePrices(web3, rp, block, rplPrice, {
                from: random,
                gas: gasLimit
            })
        });


        it(printTitle('random', 'cannot execute price update without consensus'), async () => {
            // Setup
            await trustedNode4JoinDao();
            // Set parameters
            let block = await web3.eth.getBlockNumber();
            let rplPrice = web3.utils.toWei('0.02', 'ether');
            // Submit same price from 2 nodes (not enough for 4 member consensus)
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode2,
                gas: gasLimit
            });
            // There is no consensus so execute should fail
            await shouldRevert(executeUpdatePrices(web3, rp, block, rplPrice, {
                from: random,
                gas: gasLimit
            }), 'Random account could execute update prices without consensus', 'Consensus has not been reached');
        });

        it(printTitle('random', 'should calculate the correct latest reportable block'), async () => {
            // Mint some RPL so we can stake
            await mintRPL(web3, rp, owner, trustedNode1, web3.utils.toWei('10000', 'ether'));
            // Set update frequency to 5000
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.submit.prices.frequency', 500, { from: owner, gas: gasLimit });
            // Mine to block 800
            const block = await web3.eth.getBlockNumber();
            await mineBlocks(web3, 800 - block);
            // Set the RPL price to 1:1 at block 500
            await submitPrices(web3, rp, 500, web3.utils.toWei('1', 'ether'), { from: trustedNode1, gas: gasLimit });
            await submitPrices(web3, rp, 500, web3.utils.toWei('1', 'ether'), { from: trustedNode2, gas: gasLimit });
            // Record the latest reportable block (should be 500)
            const latest1 = await rp.network.getLatestReportableBlock().then((value: any) => web3.utils.toBN(value));
            assert(latest1.eq(web3.utils.toBN(500)), 'Incorrect latest reportable block')
            // Update effective RPL stake on-chain by staking
            await nodeStakeRPL(web3, rp, web3.utils.toWei('1.6', 'ether'), { from: trustedNode1, gas: gasLimit });
            await nodeDeposit(web3, rp, { from: trustedNode1, value: web3.utils.toWei('16', 'ether'), gas: gasLimit });
            const onchain1 = await rp.network.getEffectiveRPLStakeUpdatedBlock().then((value: any) => web3.utils.toBN(value));      // Should contain the current block number (~800)
            // Record the latest reportable block
            const latest2 = await rp.network.getLatestReportableBlock().then((value: any) => web3.utils.toBN(value));
            // Updating on-chain effective stake should not change the latest reportable block (should still be 500)
            assert(latest1.eq(latest2), 'Latest reportable block changed');
            // Change the update frequency to 300
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.submit.prices.frequency', 300, { from: owner, gas: gasLimit });
            const latest3 = await rp.network.getLatestReportableBlock().then((value: any) => web3.utils.toBN(value));
            // We've simulated the edge case where the on-chain value of the effective RPL stake was updated and then a change to the update frequency
            // resulted in the latest window falling on a block lower than the on-chain update. So the contract should now report the block that it was last
            // updated instead of the latest window
            assert(latest3.eq(onchain1), 'Incorrect latest reportable block');
        })


    });
}
