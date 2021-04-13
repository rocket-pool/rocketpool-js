// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { SendOptions } from 'web3-eth-contract';


// Possible states that a proposal may be in
export const proposalStates = {
    Pending     : 0,
    Active      : 1,
    Cancelled   : 2,
    Defeated    : 3,
    Succeeded   : 4,
    Expired     : 5,
    Executed    : 6
};

// Get the status of a proposal
export async function getDAOProposalState(web3: Web3, rp: RocketPool, proposalID:number) {
    // Load contracts
    const rocketDAOProposal = await rp.contracts.get('rocketDAOProposal');
    return await rocketDAOProposal.methods.getState(proposalID).call();
};

// Get the block a proposal can start being voted on
export async function getDAOProposalStartBlock(web3: Web3, rp: RocketPool, proposalID:number) {
    // Load contracts
    const rocketDAOProposal = await rp.contracts.get('rocketDAOProposal');
    return await rocketDAOProposal.methods.getStart(proposalID).call();
};

// Get the block a proposal can end being voted on
export async function getDAOProposalEndBlock(web3: Web3, rp: RocketPool, proposalID:number) {
    // Load contracts
    const rocketDAOProposal = await rp.contracts.get('rocketDAOProposal');
    return await rocketDAOProposal.methods.getEnd(proposalID).call();
};

// Get the vote count for a proposal
export async function getDAOProposalVotesFor(web3: Web3, rp: RocketPool, proposalID:number) {
    // Load contracts
    const rocketDAOProposal = await rp.contracts.get('rocketDAOProposal');
    return await rocketDAOProposal.methods.getVotesFor(proposalID).call();
};

// Get the vote count against a proposal
export async function getDAOProposalVotesAgainst(web3: Web3, rp: RocketPool, proposalID:number) {
    // Load contracts
    const rocketDAOProposal = await rp.contracts.get('rocketDAOProposal');
    return await rocketDAOProposal.methods.getVotesAgainst(proposalID).call();
};
