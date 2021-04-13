// Imports
import { takeSnapshot, revertSnapshot } from '../_utils/evm';
import { printTitle } from '../_utils/formatting';
import { shouldRevert } from '../_utils/testing';
import { compressABI } from '../_utils/contract';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {setNodeTrusted} from '../_helpers/node';
import {setDaoNodeTrustedBootstrapMember, setDAONodeTrustedBootstrapSetting, setDaoNodeTrustedBootstrapModeDisabled} from '../dao/scenario-dao-node-trusted-bootstrap';
import { assert } from 'chai';
import {daoNodeTrustedPropose} from './scenario-dao-node-trusted';
import {getDAOProposalStartBlock} from "./scenario-dao-proposal";

export default function runDAONodeTrusted(web3: Web3, rp: RocketPool) {
    describe('DAO Node Trusted', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let guardian: string;
        let userOne: string;
        let registeredNode1: string;
        let registeredNode2: string;
        let registeredNodeTrusted1: string;
        let registeredNodeTrusted2: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        before(async () => {
            // Get accounts
            [guardian, userOne, registeredNode1, registeredNode2, registeredNodeTrusted1, registeredNodeTrusted2] = await web3.eth.getAccounts();

            const rocketStorage = await rp.contracts.get('rocketStorage');

            // Register nodes
            await rp.node.registerNode('Australia/Brisbane', {from: registeredNode1, gas: gasLimit});
            await rp.node.registerNode('Australia/Brisbane', {from: registeredNode2, gas: gasLimit});
            await rp.node.registerNode('Australia/Brisbane', {from: registeredNodeTrusted1, gas: gasLimit});
            await rp.node.registerNode('Australia/Brisbane', {from: registeredNodeTrusted2, gas: gasLimit});

            // Add members to the DAO
            await setNodeTrusted(web3, rp, registeredNodeTrusted1, 'rocketpool_1', 'node@home.com', guardian);
            await setNodeTrusted(web3, rp, registeredNodeTrusted2, 'rocketpool_2', 'node@home.com', guardian);

            // Deploy new contracts
            await rp.contracts.make('rocketMinipoolManager', rocketStorage.options.address);
            await rp.contracts.make('rocketDAONodeTrustedUpgrade', rocketStorage.options.address);

            // Set a small proposal cooldown
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.cooldown', 10, {from: guardian});
        });


        //
        // Start Tests
        //
        it(printTitle('userOne', 'fails to be added as a trusted node dao member as they are not a registered node'), async () => {
            // Set as trusted dao member via bootstrapping
            await shouldRevert(setDaoNodeTrustedBootstrapMember(web3, rp,'rocketpool', 'node@home.com', userOne, {
                from: guardian
            }), 'Non registered node added to trusted node DAO', 'Invalid node');
        });

        it(printTitle('userOne', 'fails to add a bootstrap trusted node DAO member as non guardian'), async () => {
            // Set as trusted dao member via bootstrapping
            await shouldRevert(setDaoNodeTrustedBootstrapMember(web3, rp, 'rocketpool', 'node@home.com', registeredNode1, {
                from: userOne
            }), 'Non guardian registered node to trusted node DAO', 'Account is not a temporary guardian');
        });

        it(printTitle('guardian', 'cannot add the same member twice'), async () => {
            // Set as trusted dao member via bootstrapping
            await shouldRevert(setDaoNodeTrustedBootstrapMember(web3, rp,'rocketpool', 'node@home.com', registeredNodeTrusted2, {
                from: guardian
            }), 'Guardian the same DAO member twice', 'This node is already part of the trusted node DAO');
        });

        it(printTitle('guardian', 'updates quorum setting while bootstrap mode is enabled'), async () => {
            // Set as trusted dao member via bootstrapping
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsMembers', 'members.quorum', web3.utils.toWei('0.55'), {
                from: guardian
            });
        });

        it(printTitle('guardian', 'updates RPL bond setting while bootstrap mode is enabled'), async () => {
            // Set RPL Bond at 10K RPL
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsMembers', 'members.rplbond', web3.utils.toWei('10000'), {
                from: guardian
            });
        });

        it(printTitle('userOne', 'fails to update RPL bond setting while bootstrap mode is enabled as they are not the guardian'), async () => {
            // Update setting
            await shouldRevert(setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsMembers', 'members.rplbond', web3.utils.toWei('10000'), {
                from: userOne
            }), 'UserOne changed RPL bond setting', 'Account is not a temporary guardian');
        });

        it(printTitle('guardian', 'fails to set quorum setting as 0% while bootstrap mode is enabled'), async () => {
            // Update setting
            await shouldRevert(setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsMembers', 'members.quorum', web3.utils.toWei('0'), {
                from: guardian
            }), 'Guardian changed quorum setting to invalid value', 'Quorum setting must be > 0 & <= 90%');
        });

        it(printTitle('guardian', 'fails to set quorum setting above 90% while bootstrap mode is enabled'), async () => {
            // Update setting
            await shouldRevert(setDAONodeTrustedBootstrapSetting(web3, rp,'rocketDAONodeTrustedSettingsMembers', 'members.quorum', web3.utils.toWei('0.91'), {
                from: guardian
            }), 'Guardian changed quorum setting to invalid value', 'Quorum setting must be > 0 & <= 90%');
        });

        it(printTitle('registeredNode1', 'verify trusted node quorum votes required is correct'), async () => {
            // Load contracts
            const rocketDAONodeTrusted = await rp.contracts.get('rocketDAONodeTrusted');
            const rocketDAONodeTrustedSettings = await rp.contracts.get('rocketDAONodeTrustedSettingsMembers');

            // How many trusted nodes do we have?
            let trustedNodeCount =  await rocketDAONodeTrusted.methods.getMemberCount().call();
            // Get the current quorum threshold
            let quorumThreshold = await rocketDAONodeTrustedSettings.methods.getQuorum().call();
            // Calculate the expected vote threshold
            let expectedVotes = (Number(web3.utils.fromWei(quorumThreshold)) * Number(trustedNodeCount)).toFixed(2);
            console.log(expectedVotes);
            // Calculate it now on the contracts
            let quorumVotes = await rocketDAONodeTrusted.methods.getMemberQuorumVotesRequired().call();
            // Verify
            assert(expectedVotes == Number(web3.utils.fromWei(quorumVotes)).toFixed(2), "Expected vote threshold does not match contracts");
        });

        // The big test
        it(printTitle('registeredNodeTrusted1&2', 'create two proposals for two new members that are voted in, one then chooses to leave and is allowed too'), async () => {
            // Get the DAO settings
            let daoNodesettings = await rp.contracts.get('rocketDAONodeTrustedSettingsMembers');
            // How much RPL is required for a trusted node bond?
            let rplBondAmount = web3.utils.fromWei(await daoNodesettings.methods.getRPLBond().call());
            // Setup our proposal settings
            let proposalVoteBlocks = 10;
            let proposalVoteExecuteBlocks = 10;
            // Update now while in bootstrap mode
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.vote.blocks', proposalVoteBlocks, { from: guardian });
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.execute.blocks', proposalVoteExecuteBlocks, { from: guardian });
            // Disable bootstrap mode
            await setDaoNodeTrustedBootstrapModeDisabled(web3, rp, { from: guardian });
            // New Member 1
            // Encode the calldata for the proposal
            let proposalCalldata1 = web3.eth.abi.encodeFunctionCall(
                {name: 'proposalInvite', type: 'function', inputs: [{type: 'string', name: '_id'},{type: 'string', name: '_email'}, {type: 'address', name: '_nodeAddress'}]},
                ['SaaS_Provider1', 'test@sass.com', registeredNode1]
            );
            // Add the proposal
            let proposalID_1 = await daoNodeTrustedPropose(web3, rp, 'hey guys, can we add this cool SaaS member please?', proposalCalldata1, {
                from: registeredNodeTrusted1
            });
            // New Member 2
            // Encode the calldata for the proposal
            let proposalCalldata2 = web3.eth.abi.encodeFunctionCall(
                {name: 'proposalInvite', type: 'function', inputs: [{type: 'string', name: '_id'},{type: 'string', name: '_email'}, {type: 'address', name: '_nodeAddress'}]},
                ['SaaS_Provider2', 'test2@sass.com', registeredNode2]
            );
            // Add the proposal
            let proposalID_2 = await daoNodeTrustedPropose(web3, rp, 'hey guys, can we add this cool SaaS member please?', proposalCalldata2, {
                from: registeredNodeTrusted2
            });
            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();
            // Now mine blocks until the proposal is 'active' and can be voted on
            // await mineBlocks(web3, (await getDAOProposalStartBlock(web3, rp, proposalID_1)-blockCurrent)+2);
            // // Now lets vote for the new members
            // await daoNodeTrustedVote(web3, rp, proposalID_1, true, { from: registeredNodeTrusted1 });
            // await daoNodeTrustedVote(web3, rp, proposalID_1, true, { from: registeredNodeTrusted2 });
            // await daoNodeTrustedVote(web3, rp, proposalID_2, true, { from: registeredNodeTrusted1 });
            // await daoNodeTrustedVote(web3, rp, proposalID_2, true, { from: registeredNodeTrusted2 });
            // // Current block
            // blockCurrent = await web3.eth.getBlockNumber();
            // // Fast forward to voting periods finishing
            // await mineBlocks(web3, (await getDAOProposalEndBlock(proposalID_1)-blockCurrent)+2);
            // // Proposal should be successful, lets execute it
            // await daoNodeTrustedExecute(proposalID_1, { from: registeredNodeTrusted1 });
            // await daoNodeTrustedExecute(proposalID_2, { from: registeredNodeTrusted1 });
            // // Member has now been invited to join, so lets do that
            // // We'll allow the DAO to transfer our RPL bond before joining
            // await rplMint(registeredNode1, rplBondAmount);
            // await rplAllowanceDAO(registeredNode1, rplBondAmount);
            // await rplMint(registeredNode2, rplBondAmount);
            // await rplAllowanceDAO(registeredNode2, rplBondAmount);
            // // Join now
            // await daoNodeTrustedMemberJoin({from: registeredNode1});
            // await daoNodeTrustedMemberJoin({from: registeredNode2});
            // // Now registeredNodeTrusted2 wants to leave
            // // Encode the calldata for the proposal
            // let proposalCalldata3 = web3.eth.abi.encodeFunctionCall(
            //     {name: 'proposalLeave', type: 'function', inputs: [{type: 'address', name: '_nodeAddress'}]},
            //     [registeredNodeTrusted2]
            // );
            // // Add the proposal
            // let proposalID_3 = await daoNodeTrustedPropose('hey guys, can I please leave the DAO?', proposalCalldata3, {
            //     from: registeredNodeTrusted2
            // });
            // // Current block
            // blockCurrent = await web3.eth.getBlockNumber();
            // // Now mine blocks until the proposal is 'active' and can be voted on
            // await mineBlocks(web3, (await getDAOProposalStartBlock(proposalID_3)-blockCurrent)+2);
            // // Now lets vote
            // await daoNodeTrustedVote(proposalID_3, true, { from: registeredNodeTrusted1 });
            // await daoNodeTrustedVote(proposalID_3, true, { from: registeredNodeTrusted2 });
            // await daoNodeTrustedVote(proposalID_3, false, { from: registeredNode1 });
            // await daoNodeTrustedVote(proposalID_3, true, { from: registeredNode2 });
            // // Fast forward to this voting period finishing
            // await mineBlocks(web3, (await getDAOProposalEndBlock(proposalID_3)-blockCurrent)+1);
            // // Proposal should be successful, lets execute it
            // await daoNodeTrustedExecute(proposalID_3, { from: registeredNodeTrusted2 });
            // // Member can now leave and collect any RPL bond
            // await daoNodeTrustedMemberLeave(registeredNodeTrusted2, {from: registeredNodeTrusted2});
        });


    });
};

