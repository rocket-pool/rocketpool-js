// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {SendOptions} from 'web3-eth-contract';
import {proposalStates, getDAOProposalState} from './scenario-dao-proposal';

// Create a proposal for this DAO
export async function daoNodeTrustedPropose(web3: Web3, rp: RocketPool, _proposalMessage:string, _payload:string, options: SendOptions) {

    // Get data about the tx
    function getTxData() {
        return Promise.all([
            rp.dao.proposals.getTotal(),
        ]).then(
            ([proposalTotal]) =>
                ({proposalTotal})
        );
    }

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();
    options.gas = 10000000;

    // Capture data
    let ds1 = await getTxData();

    // Add a new proposal
    await rp.dao.node.trusted.proposals.propose(_proposalMessage, _payload, options);

    // Capture data
    let ds2 = await getTxData();

    // console.log(Number(ds1.proposalTotal), Number(ds2.proposalTotal));

    // Get the current state, new proposal should be in pending
    let state = Number(await getDAOProposalState(web3, rp, ds2.proposalTotal));

    let ds1ProposalTotal = web3.utils.toBN(ds1.proposalTotal);
    let ds2ProposalTotal = web3.utils.toBN(ds2.proposalTotal);

    // Check proposals
    assert(ds2ProposalTotal.eq(ds1ProposalTotal.add(web3.utils.toBN(1))), 'Incorrect proposal total count');
    assert(state == proposalStates.Pending, 'Incorrect proposal state, should be pending');

    // Return the proposal ID
    return Number(ds2.proposalTotal);

}

// Vote on a proposal for this DAO
export async function daoNodeTrustedVote(web3: Web3, rp: RocketPool, _proposalID: number, _vote: boolean, options: SendOptions) {

    // Get data about the tx
    function getTxData() {
        return Promise.all([
            rp.dao.proposals.getTotal(),
            rp.dao.proposals.getState(_proposalID),
            rp.dao.proposals.getVotesFor(_proposalID).then((value: any) => web3.utils.toBN(value)),
            rp.dao.proposals.getVotesRequired(_proposalID).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([proposalTotal, proposalState, proposalVotesFor, proposalVotesRequired]) =>
                ({proposalTotal, proposalState, proposalVotesFor, proposalVotesRequired})
        );
    }

    // Capture data
    let ds1 = await getTxData();

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();
    options.gas = 1000000;

    // Add a new proposal
    await rp.dao.node.trusted.proposals.vote(_proposalID, _vote, options);

    // Capture data
    let ds2 = await getTxData();

    // Check proposals
    if(ds2.proposalState == proposalStates.Active) assert(ds2.proposalVotesFor.lt(ds2.proposalVotesRequired), 'Proposal state is active, votes for proposal should be less than the votes required');
    if(ds2.proposalState == proposalStates.Succeeded) assert(ds2.proposalVotesFor.gte(ds2.proposalVotesRequired), 'Proposal state is successful, yet does not have the votes required');

}

// Execute a successful proposal
export async function daoNodeTrustedExecute(web3: Web3, rp: RocketPool, _proposalID:number, options: SendOptions) {

    // Get data about the tx
    function getTxData() {
        return Promise.all([
            rp.dao.proposals.getState(_proposalID).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([proposalState]) =>
                ({proposalState})
        );
    }

    // Capture data
    let ds1 = await getTxData();
    //console.log(Number(ds1.proposalState));

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();
    options.gas = 1000000;

    // Execute a proposal
    await rp.dao.node.trusted.proposals.execute(_proposalID, options);

    // Capture data
    let ds2 = await getTxData();
    //console.log(Number(ds2.proposalState));

    // Check it was updated
    assert(ds2.proposalState.eq(web3.utils.toBN(6)), 'Proposal is not in the executed state');

}

// Join the DAO after a successful invite proposal has passed
export async function daoNodeTrustedMemberJoin(web3: Web3, rp: RocketPool, options:SendOptions) {

    let rocketTokenRPLAddress = await rp.tokens.rpl.getAddress();

    // Get data about the tx
    function getTxData() {
        return Promise.all([
            rp.dao.node.trusted.node.getMemberCount().then((value: any) => web3.utils.toBN(value)),
            rp.tokens.rpl.balanceOf(options.from).then((value: any) => web3.utils.toBN(value)),
            rp.vault.balanceOfToken('rocketDAONodeTrustedActions', rocketTokenRPLAddress).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([memberTotal, rplBalanceBond, rplBalanceVault]) =>
                ({memberTotal, rplBalanceBond, rplBalanceVault})
        );
    }

    // Capture data
    let ds1 = await getTxData();
    //console.log('Member Total', Number(ds1.memberTotal), web3.utils.fromWei(ds1.rplBalanceBond), web3.utils.fromWei(ds1.rplBalanceVault));

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();
    options.gas = 1000000;

    // Add a new proposal
    await rp.dao.node.trusted.actions.actionJoin(options);

    // Capture data
    let ds2 = await getTxData();
    //console.log('Member Total', Number(ds2.memberTotal), web3.utils.fromWei(ds2.rplBalanceBond), web3.utils.fromWei(ds2.rplBalanceVault));

    // Check member count has increased
    assert(ds2.memberTotal.eq(ds1.memberTotal.add(web3.utils.toBN(1))), 'Member count has not increased');
    assert(ds2.rplBalanceVault.eq(ds1.rplBalanceVault.add(ds1.rplBalanceBond)), 'RocketVault address does not contain the correct RPL bond amount');

}

// Leave the DAO after a successful leave proposal has passed
export async function daoNodeTrustedMemberLeave(web3: Web3, rp: RocketPool, _rplRefundAddress:string, options:SendOptions) {

    let rocketTokenRPLAddress = await rp.tokens.rpl.getAddress();

    // Get data about the tx
    function getTxData() {
        return Promise.all([
            rp.dao.node.trusted.node.getMemberCount().then((value: any) => web3.utils.toBN(value)),
            rp.tokens.rpl.balanceOf(_rplRefundAddress).then((value: any) => web3.utils.toBN(value)),
            rp.vault.balanceOfToken('rocketDAONodeTrustedActions', rocketTokenRPLAddress).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([memberTotal, rplBalanceRefund, rplBalanceVault]) =>
                ({memberTotal, rplBalanceRefund, rplBalanceVault
                })
        );
    }

    // Capture data
    let ds1 = await getTxData();
    // console.log('Member Total', Number(ds1.memberTotal), web3.utils.fromWei(ds1.rplBalanceRefund), web3.utils.fromWei(ds1.rplBalanceVault));

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();
    options.gas = 1000000;

    // Add a new proposal
    await rp.dao.node.trusted.actions.actionLeave(_rplRefundAddress, options);

    // Capture data
    let ds2 = await getTxData();
    // console.log('Member Total', Number(ds2.memberTotal), web3.utils.fromWei(ds2.rplBalanceRefund), web3.utils.fromWei(ds2.rplBalanceVault));

    // Verify
    assert(ds2.memberTotal.eq(ds1.memberTotal.sub(web3.utils.toBN(1))), 'Member count has not decreased');
    assert(ds2.rplBalanceVault.eq(ds1.rplBalanceVault.sub(ds2.rplBalanceRefund)), 'Member RPL refund address does not contain the correct RPL bond amount');

}
