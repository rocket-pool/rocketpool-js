// Imports
import { assert } from 'chai';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import { printTitle } from '../_utils/formatting';
import { shouldRevert } from '../_utils/testing';
import { compressABI } from '../_utils/contract';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {setNodeTrusted} from '../_helpers/node';
import {setDaoNodeTrustedBootstrapMember, setDAONodeTrustedBootstrapSetting, setDaoNodeTrustedBootstrapModeDisabled, setDaoNodeTrustedMemberRequired, setDaoNodeTrustedBootstrapUpgrade} from '../dao/scenario-dao-node-trusted-bootstrap';
import {daoNodeTrustedExecute, daoNodeTrustedPropose, daoNodeTrustedVote, daoNodeTrustedMemberJoin, daoNodeTrustedMemberLeave} from './scenario-dao-node-trusted';
import {getDAOProposalEndBlock, getDAOProposalStartBlock, getDAOProposalState, proposalStates} from './scenario-dao-proposal';
import {mintRPL} from '../tokens/scenario-rpl-mint';
import {Contract, SendOptions} from 'web3-eth-contract';

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


        // Contracts
        let rocketMinipoolManagerNew: Contract;
        let rocketDAONodeTrustedUpgradeNew: Contract;


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
            rocketMinipoolManagerNew = await rp.contracts.make('rocketMinipoolManager', guardian);
            rocketDAONodeTrustedUpgradeNew = await rp.contracts.make('rocketDAONodeTrustedUpgrade', guardian);

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
            await mineBlocks(web3, (await getDAOProposalStartBlock(web3, rp, proposalID_1)-blockCurrent)+2);
            // Now lets vote for the new members
            await daoNodeTrustedVote(web3, rp, proposalID_1, true, { from: registeredNodeTrusted1 });
            await daoNodeTrustedVote(web3, rp, proposalID_1, true, { from: registeredNodeTrusted2 });
            await daoNodeTrustedVote(web3, rp, proposalID_2, true, { from: registeredNodeTrusted1 });
            await daoNodeTrustedVote(web3, rp, proposalID_2, true, { from: registeredNodeTrusted2 });
            // Current block
            blockCurrent = await web3.eth.getBlockNumber();
            // Fast forward to voting periods finishing
            await mineBlocks(web3, (await getDAOProposalEndBlock(web3, rp, proposalID_1)-blockCurrent)+2);
            // Proposal should be successful, lets execute it
            await daoNodeTrustedExecute(web3, rp, proposalID_1, { from: registeredNodeTrusted1 });
            await daoNodeTrustedExecute(web3, rp, proposalID_2, { from: registeredNodeTrusted1 });
            // Member has now been invited to join, so lets do that
            // We'll allow the DAO to transfer our RPL bond before joining
            let rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
            let rocketDAONodeTrustedActions = await rp.contracts.get('rocketDAONodeTrustedActions');
            let _amount = web3.utils.toWei(rplBondAmount.toString(), 'ether');
            await mintRPL(web3, rp, registeredNode1, rplBondAmount, guardian);
            await rocketTokenRPL.methods.approve(rocketDAONodeTrustedActions.options.address, _amount).send({ from: registeredNode1 });
            await mintRPL(web3, rp, registeredNode2, rplBondAmount, guardian);
            await rocketTokenRPL.methods.approve(rocketDAONodeTrustedActions.options.address, _amount).send({ from: registeredNode2 });

            // Join now
            await daoNodeTrustedMemberJoin(web3, rp, {from: registeredNode1});
            await daoNodeTrustedMemberJoin(web3, rp, {from: registeredNode2});
            // Now registeredNodeTrusted2 wants to leave
            // Encode the calldata for the proposal
            let proposalCalldata3 = web3.eth.abi.encodeFunctionCall(
                {name: 'proposalLeave', type: 'function', inputs: [{type: 'address', name: '_nodeAddress'}]},
                [registeredNodeTrusted2]
            );
            // Add the proposal
            let proposalID_3 = await daoNodeTrustedPropose(web3, rp, 'hey guys, can I please leave the DAO?', proposalCalldata3, {
                from: registeredNodeTrusted2
            });
            // Current block
            blockCurrent = await web3.eth.getBlockNumber();
            // Now mine blocks until the proposal is 'active' and can be voted on
            await mineBlocks(web3, (await getDAOProposalStartBlock(web3, rp, proposalID_3)-blockCurrent)+2);
            // Now lets vote
            await daoNodeTrustedVote(web3, rp, proposalID_3, true, { from: registeredNodeTrusted1 });
            await daoNodeTrustedVote(web3, rp, proposalID_3, true, { from: registeredNodeTrusted2 });
            await daoNodeTrustedVote(web3, rp, proposalID_3, false, { from: registeredNode1 });
            await daoNodeTrustedVote(web3, rp, proposalID_3, true, { from: registeredNode2 });
            // Fast forward to this voting period finishing
            await mineBlocks(web3, (await getDAOProposalEndBlock(web3, rp, proposalID_3)-blockCurrent)+1);
            // Proposal should be successful, lets execute it
            await daoNodeTrustedExecute(web3, rp, proposalID_3, { from: registeredNodeTrusted2 });
            // Member can now leave and collect any RPL bond
            await daoNodeTrustedMemberLeave(web3, rp, registeredNodeTrusted2, {from: registeredNodeTrusted2});
        });

        // Test various proposal states
        it(printTitle('registeredNodeTrusted1', 'creates a proposal and verifies the proposal states as it passes and is executed'), async () => {
            // Get the DAO settings
            const daoNode = await rp.contracts.get('rocketDAONodeTrusted');
            const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
            // Setup our proposal settings
            let proposalVoteBlocks = 10;
            let proposalVoteExecuteBlocks = 10;
            // Update now while in bootstrap mode
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.vote.blocks', proposalVoteBlocks, { from: guardian });
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.execute.blocks', proposalVoteExecuteBlocks, { from: guardian });
            // Add our 3rd member
            await setNodeTrusted(web3, rp, registeredNode1, 'rocketpool', 'node@home.com', guardian);
            // Now registeredNodeTrusted2 wants to leave
            // Encode the calldata for the proposal
            let proposalCalldata = web3.eth.abi.encodeFunctionCall(
                {name: 'proposalInvite', type: 'function', inputs: [{type: 'string', name: '_id'},{type: 'string', name: '_email'}, {type: 'address', name: '_nodeAddress'}]},
                ['SaaS_Provider', 'test@sass.com', registeredNode2]
            );
            // Add the proposal
            let proposalID = await daoNodeTrustedPropose(web3, rp,'hey guys, can we add this cool SaaS member please?', proposalCalldata, {
                from: registeredNodeTrusted1
            });
            // Verify the proposal is pending
            assert(await getDAOProposalState(web3, rp, proposalID) == proposalStates.Pending, 'Proposal state is not Pending');
            // Verify voting will not work while pending
            await shouldRevert(daoNodeTrustedVote(web3, rp, proposalID, true, { from: registeredNode1 }), 'Member voted while proposal was pending', 'Voting is not active for this proposal');
            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();
            // Now mine blocks until the proposal is 'active' and can be voted on
            await mineBlocks(web3, (await getDAOProposalStartBlock(web3, rp, proposalID)-blockCurrent)+1);
            // // Now lets vote
            await daoNodeTrustedVote(web3, rp, proposalID, true, { from: registeredNode1 });
            await daoNodeTrustedVote(web3, rp, proposalID, true, { from: registeredNodeTrusted2 });
            await shouldRevert(daoNodeTrustedVote(web3, rp, proposalID, false, { from: registeredNodeTrusted1 }), 'Member voted after proposal has passed', 'Proposal has passed, voting is complete and the proposal can now be executed');
            // Verify the proposal is successful
            assert(await getDAOProposalState(web3, rp, proposalID) == proposalStates.Succeeded, 'Proposal state is not succeeded');
            // Proposal has passed, lets execute it now
            await daoNodeTrustedExecute(web3, rp, proposalID, { from: registeredNode1 });
            // Verify the proposal has executed
            assert(await getDAOProposalState(web3, rp, proposalID) == proposalStates.Executed, 'Proposal state is not executed');
        });

        it(printTitle('registeredNode2', 'is made a new member after a proposal is created, they fail to vote on that proposal'), async () => {
            // Setup our proposal settings
            let proposalVoteBlocks = 10;
            let proposalVoteExecuteBlocks = 10;
            // Update now while in bootstrap mode
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.vote.blocks', proposalVoteBlocks, { from: guardian });
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.execute.blocks', proposalVoteExecuteBlocks, { from: guardian });
            // Encode the calldata for the proposal
            let proposalCalldata = web3.eth.abi.encodeFunctionCall(
                {name: 'proposalLeave', type: 'function', inputs: [{type: 'address', name: '_nodeAddress'}]},
                [registeredNodeTrusted1]
            );
            // Add the proposal
            let proposalID = await daoNodeTrustedPropose(web3, rp, 'hey guys, can I please leave the DAO?', proposalCalldata, {
                from: registeredNodeTrusted1
            });
            // Register new member now
            await setNodeTrusted(web3, rp, registeredNode2, 'rocketpool', 'node@home.com', guardian);
            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();
            // Now mine blocks until the proposal is 'active' and can be voted on
            await mineBlocks(web3, (await getDAOProposalStartBlock(web3, rp, proposalID)-blockCurrent)+1);
            // Now lets vote
            await daoNodeTrustedVote(web3, rp, proposalID, true, { from: registeredNodeTrusted1 });
            // New member attempts to vote on proposal started before they joined, fails
            await shouldRevert(daoNodeTrustedVote(web3, rp, proposalID, true, { from: registeredNode2 }), 'Member voted on proposal they shouldn\'t be able too', 'Member cannot vote on proposal created before they became a member');
        });

        it(printTitle('registeredNodeTrusted2', 'fails to execute a successful proposal after it expires'), async () => {
            // Setup our proposal settings
            let proposalVoteBlocks = 10;
            let proposalVoteExecuteBlocks = 10;
            // Update now while in bootstrap mode
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.vote.blocks', proposalVoteBlocks, { from: guardian });
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.execute.blocks', proposalVoteExecuteBlocks, { from: guardian });
            // Encode the calldata for the proposal
            let proposalCalldata = web3.eth.abi.encodeFunctionCall(
                {name: 'proposalLeave', type: 'function', inputs: [{type: 'address', name: '_nodeAddress'}]},
                [registeredNodeTrusted1]
            );
            // Add the proposal
            let proposalID = await daoNodeTrustedPropose(web3, rp, 'hey guys, can I please leave the DAO?', proposalCalldata, {
                from: registeredNodeTrusted1
            });
            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();
            // Now mine blocks until the proposal is 'active' and can be voted on
            await mineBlocks(web3, (await getDAOProposalStartBlock(web3, rp, proposalID)-blockCurrent)+1);
            // Now lets vote
            await daoNodeTrustedVote(web3, rp, proposalID, true, { from: registeredNodeTrusted1 });
            await daoNodeTrustedVote(web3, rp, proposalID, true, { from: registeredNodeTrusted2 });
            // Fast forward to this voting period finishing and executing period expiring
            await mineBlocks(web3, (await getDAOProposalEndBlock(web3, rp, proposalID)-blockCurrent)+1+proposalVoteExecuteBlocks);
            // Execution should fail
            await shouldRevert(daoNodeTrustedExecute(web3, rp, proposalID, { from: registeredNode2 }), 'Member execute proposal after it had expired', 'Proposal has not succeeded, has expired or has already been executed');
        });

        it(printTitle('registered2', 'joins the DAO automatically as a member due to the min number of members falling below the min required'), async () => {
            // Attempt to join as a non node operator
            await shouldRevert(setDaoNodeTrustedMemberRequired(web3, rp, 'rocketpool_emergency_node_op', 'node2@home.com', {
                from: userOne
            }), 'Regular node joined DAO without bond during low member mode', 'Invalid node');
            // Attempt to join without setting allowance for the bond
            await shouldRevert(setDaoNodeTrustedMemberRequired(web3, rp, 'rocketpool_emergency_node_op', 'node2@home.com', {
                from: registeredNode2
            }), 'Regular node joined DAO without bond during low member mode', 'Not enough allowance given to RocketDAONodeTrusted contract for transfer of RPL bond tokens');
            // Get the DAO settings
            let daoNodeSettings = await rp.contracts.get('rocketDAONodeTrustedSettingsMembers');
            // How much RPL is required for a trusted node bond?
            let rplBondAmount = web3.utils.fromWei(await daoNodeSettings.methods.getRPLBond().call());
            // We'll allow the DAO to transfer our RPL bond before joining
            let rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
            let rocketDAONodeTrustedActions = await rp.contracts.get('rocketDAONodeTrustedActions');
            let _amount = web3.utils.toWei(rplBondAmount.toString(), 'ether');
            await mintRPL(web3, rp, registeredNode2, rplBondAmount, guardian);
            await rocketTokenRPL.methods.approve(rocketDAONodeTrustedActions.options.address, _amount).send({ from: registeredNode2 });
            // Should just be 2 nodes in the DAO now which means a 3rd can join to make up the min count
            await setDaoNodeTrustedMemberRequired(web3, rp, 'rocketpool_emergency_node_op', 'node2@home.com', {
                from: registeredNode2,
            });
        });

        it(printTitle('registered2', 'attempt to auto join the DAO automatically and fails as the DAO has the min member count required'), async () => {
            // Add a 3rd member
            await setNodeTrusted(web3, rp, registeredNode1, 'rocketpool_3', 'node@home.com', guardian);
            // Get the DAO settings
            let daoNodeSettings = await rp.contracts.get('rocketDAONodeTrustedSettingsMembers');
            // How much RPL is required for a trusted node bond?
            let rplBondAmount = web3.utils.fromWei(await daoNodeSettings.methods.getRPLBond().call());
            // We'll allow the DAO to transfer our RPL bond before joining
            let rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
            let rocketDAONodeTrustedActions = await rp.contracts.get('rocketDAONodeTrustedActions');
            let _amount = web3.utils.toWei(rplBondAmount.toString(), 'ether');
            await mintRPL(web3, rp, registeredNode1, rplBondAmount, guardian);
            await rocketTokenRPL.methods.approve(rocketDAONodeTrustedActions.options.address, _amount).send({ from: registeredNode1 });
            // Should just be 2 nodes in the DAO now which means a 3rd can join to make up the min count
            await shouldRevert(setDaoNodeTrustedMemberRequired(web3, rp,'rocketpool_emergency_node_op', 'node2@home.com', {
                from: registeredNode2,
            }), 'Regular node joined DAO when not in low member mode', 'Low member mode not engaged');
        });

        /*** Upgrade Contacts & ABI *************/

        // Contracts
        it(printTitle('guardian', 'can upgrade a contract in bootstrap mode'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager')
            await setDaoNodeTrustedBootstrapUpgrade(web3, rp, 'upgradeContract', 'rocketNodeManager', abi, rocketMinipoolManagerNew.options.address, {
                from: guardian,
            });
        });

        it(printTitle('guardian', 'can upgrade the upgrade contract'), async () => {
            let abi = await rp.contracts.abi('rocketDAONodeTrustedUpgrade')
            await setDaoNodeTrustedBootstrapUpgrade(web3, rp,'upgradeContract', 'rocketDAONodeTrustedUpgrade', abi, rocketDAONodeTrustedUpgradeNew.options.address, {
                from: guardian,
            });
        });

        it(printTitle('userOne', 'cannot upgrade a contract in bootstrap mode'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager')
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp,'upgradeContract', 'rocketNodeManager', abi, rocketMinipoolManagerNew.options.address, {
                from: userOne,
            }), 'Random address upgraded a contract', 'Account is not a temporary guardian');
        });

        it(printTitle('guardian', 'cannot upgrade a contract with an invalid address'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager')
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp,'upgradeContract', 'rocketNodeManager', abi, '0x0000000000000000000000000000000000000000', {
                from: guardian,
            }), 'Guardian adupgradedded a contract with an invalid address', 'Invalid contract address');
        });

        it(printTitle('guardian', 'cannot upgrade a protected contract'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager')
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp,'upgradeContract', 'rocketVault', abi, rocketMinipoolManagerNew.options.address, {
                from: guardian,
            }), 'Upgraded a protected contract', 'Cannot upgrade the vault');
        });

        it(printTitle('guardian', 'can add a contract in bootstrap mode'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager')
            await setDaoNodeTrustedBootstrapUpgrade(web3, rp,'addContract', 'rocketMinipoolManagerNew', abi, rocketMinipoolManagerNew.options.address, {
                from: guardian,
            });
        });

        it(printTitle('guardian', 'cannot add a contract with the same name as an existing one'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager')
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp,'addContract', 'rocketStorage', abi, rocketMinipoolManagerNew.options.address, {
                from: guardian,
            }), 'Guardian added a contract with the same name as an existing one', 'Contract name is already in use');
        });

        it(printTitle('guardian', 'cannot add a contract with an existing address'), async () => {
            let rocketStorage = await rp.contracts.get('rocketStorage')
            let abi = await rp.contracts.abi('rocketMinipoolManager')
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp,'addContract', 'rocketNewContract', abi, rocketStorage.options.address, {
                from: guardian,
            }), 'Guardian added a contract with the same address as an existing one', 'Contract address is already in use');
        });

        it(printTitle('guardian', 'cannot add a new contract with an invalid name'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager')
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp,'addContract', '', abi, rocketMinipoolManagerNew.options.address, {
                from: guardian,
            }), 'Added a new contract with an invalid name', 'Invalid contract name');
        });


        it(printTitle('registeredNodeTrusted1', 'creates a proposal to upgrade a network contract, it passes and is executed'), async () => {
            // Load contracts
            let rocketStorage = await rp.contracts.get('rocketStorage')
            // Setup our proposal settings
            let proposalVoteBlocks = 10;
            let proposalVoteExecuteBlocks = 10;
            // Update now while in bootstrap mode
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.vote.blocks', proposalVoteBlocks, { from: guardian });
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.execute.blocks', proposalVoteExecuteBlocks, { from: guardian });
            let abi = await rp.contracts.abi('rocketMinipoolManager')
            // Encode the calldata for the proposal
            let proposalCalldata = web3.eth.abi.encodeFunctionCall(
                {name: 'proposalUpgrade', type: 'function', inputs: [{type: 'string',  name: '_type'},{type: 'string', name: '_name'},{type: 'string', name: '_contractAbi'},{type: 'address', name: '_contractAddress'}]},
                ['upgradeContract', 'rocketNodeManager', compressABI(abi), rocketMinipoolManagerNew.options.address]
            );
            // Add the proposal
            let proposalID = await daoNodeTrustedPropose(web3, rp, 'hey guys, we really should upgrade this contracts - here\'s a link to its audit reports https://link.com/audit', proposalCalldata, {
                from: registeredNodeTrusted1
            });
            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();
            // Now mine blocks until the proposal is 'active' and can be voted on
            await mineBlocks(web3, (await getDAOProposalStartBlock(web3, rp, proposalID)-blockCurrent)+1);
            // Now lets vote
            await daoNodeTrustedVote(web3, rp, proposalID, true, { from: registeredNodeTrusted1 });
            await daoNodeTrustedVote(web3, rp, proposalID, true, { from: registeredNodeTrusted2 });
            // Proposal has passed, lets execute it now and upgrade the contract
            await daoNodeTrustedExecute(web3, rp, proposalID, { from: registeredNode1 });
            // Lets check if the address matches the upgraded one now
            assert.equal(await rocketStorage.methods.getAddress().call(web3.utils.soliditySha3('contract.address', 'rocketNodeManager')), rocketMinipoolManagerNew.options.address, 'Contract address was not successfully upgraded');
            assert.isTrue(await rocketStorage.methods.getBool().call(web3.utils.soliditySha3('contract.exists', rocketMinipoolManagerNew.options.address)), 'Contract address was not successfully upgraded');
        });

        // ABIs - contract address field is ignored
        it(printTitle('guardian', 'can upgrade a contract ABI in bootstrap mode'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager');
            await setDaoNodeTrustedBootstrapUpgrade(web3, rp,'upgradeABI', 'rocketNodeManager', abi, '0x0000000000000000000000000000000000000000', {
                from: guardian,
            });
        });

        it(printTitle('guardian', 'cannot upgrade a contract ABI which does not exist'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager');
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp,'upgradeABI', 'fooBarBaz', abi, '0x0000000000000000000000000000000000000000', {
                from: guardian,
            }), 'Upgraded a contract ABI which did not exist', 'ABI does not exist');
        });

        it(printTitle('userOne', 'cannot upgrade a contract ABI'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager');
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp,'upgradeABI', 'rocketNodeManager', abi, '0x0000000000000000000000000000000000000000', {
                from: userOne,
            }), 'Random address upgraded a contract ABI', 'Account is not a temporary guardian');
        });

        it(printTitle('guardian', 'can add a contract ABI in bootstrap mode'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager');
            await setDaoNodeTrustedBootstrapUpgrade(web3, rp, 'addABI', 'rocketNewFeature', abi, '0x0000000000000000000000000000000000000000', {
                from: guardian,
            });
        });

        it(printTitle('guardian', 'cannot add a new contract ABI with an invalid name'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager');
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp,'addABI', '', abi, '0x0000000000000000000000000000000000000000', {
                from: guardian,
            }), 'Added a new contract ABI with an invalid name', 'Invalid ABI name');
        });

        it(printTitle('guardian', 'cannot add a new contract ABI with an existing name'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager');
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp,'addABI', 'rocketNodeManager', abi, '0x0000000000000000000000000000000000000000', {
                from: guardian,
            }), 'Added a new contract ABI with an existing name', 'ABI name is already in use');
        });

        it(printTitle('userOne', 'cannot add a new contract ABI'), async () => {
            let abi = await rp.contracts.abi('rocketMinipoolManager');
            await shouldRevert(setDaoNodeTrustedBootstrapUpgrade(web3, rp, 'addABI', 'rocketNewFeature', abi, '0x0000000000000000000000000000000000000000', {
                from: userOne,
            }), 'Random address added a new contract ABI', 'Account is not a temporary guardian');
        });

    });
};

