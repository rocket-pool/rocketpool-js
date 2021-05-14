// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {setNodeTrusted} from '../_helpers/node';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {executeUpdatePrices, submitPrices} from './scenario-submit-prices';
import {setDAONodeTrustedBootstrapSetting} from '../dao/scenario-dao-node-trusted-bootstrap';
import {daoNodeTrustedExecute, daoNodeTrustedMemberLeave, daoNodeTrustedPropose, daoNodeTrustedVote} from '../dao/scenario-dao-node-trusted';
import {getDAOProposalEndBlock, getDAOProposalStartBlock} from '../dao/scenario-dao-proposal';

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
        let proposalCooldown = 10
        let proposalVoteBlocks = 10


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
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.cooldown', proposalCooldown, { from: owner });
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.vote.blocks', proposalVoteBlocks, { from: owner });

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
            let blockCurrent = await web3.eth.getBlockNumber();
            // Now mine blocks until the proposal is 'active' and can be voted on
            await mineBlocks(web3, (await getDAOProposalStartBlock(web3, rp, proposalId)-blockCurrent)+2);
            // Now lets vote
            await daoNodeTrustedVote(web3, rp, proposalId, true, { from: trustedNode1 });
            await daoNodeTrustedVote(web3, rp, proposalId, true, { from: trustedNode2 });
            await daoNodeTrustedVote(web3, rp, proposalId, true, { from: trustedNode3 });
            // Fast forward to this voting period finishing
            await mineBlocks(web3, (await getDAOProposalEndBlock(web3, rp, proposalId)-blockCurrent)+1);
            // Proposal should be successful, lets execute it
            await daoNodeTrustedExecute(web3, rp, proposalId, { from: trustedNode1 });
            // Member can now leave and collect any RPL bond
            await daoNodeTrustedMemberLeave(web3, rp, trustedNode4, { from: trustedNode4 });
        }


        it(printTitle('trusted nodes', 'can submit network prices'), async () => {

            // Set parameters
            let block = 1;
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
            block = 2;

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
            let block = 1;
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
            let block = 2;
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
            let block = 1;
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
            let block = 1;
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
            let block = 1;
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
            let block = 1;
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


    });
}
