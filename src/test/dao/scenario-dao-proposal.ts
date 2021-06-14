// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';


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
    return await rp.dao.proposals.getState(proposalID);
};


// Get the block a proposal can start being voted on
export async function getDAOProposalStartTime(web3: Web3, rp: RocketPool, proposalID:number) {
    return await rp.dao.proposals.getStart(proposalID);
};


// Get the block a proposal can end being voted on
export async function getDAOProposalEndTime(web3: Web3, rp: RocketPool, proposalID:number) {
    return await rp.dao.proposals.getEnd(proposalID);
};

// Get the block a proposal expires
export async function getDAOProposalExpires(web3: Web3, rp: RocketPool, proposalID: number) {
    return await rp.dao.proposals.getExpires(proposalID);
}

// Get the vote count for a proposal
export async function getDAOProposalVotesFor(web3: Web3, rp: RocketPool, proposalID:number) {
    return await rp.dao.proposals.getVotesFor(proposalID);
};


// Get the vote count against a proposal
export async function getDAOProposalVotesAgainst(web3: Web3, rp: RocketPool, proposalID:number) {
    return await rp.dao.proposals.getVotesAgainst(proposalID);
};
