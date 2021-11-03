import Web3 from "web3";
import Contracts from "../contracts/contracts";
/**
 * Rocket Pool DAO Proposals
 */
declare class DAOProposal {
    private web3;
    private contracts;
    /**
     * Create a new DAOProposal instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProposal contract
     */
    private get rocketDAOProposal();
    /**
     * Return the total of DAO Proposals
     * @returns a Promise<number\> that resolves to a number representing if node registrations are enabled
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.dao.proposals.getTotal().then((val: number) => { val };
     * ```
     */
    getTotal(): Promise<number>;
    /**
     * Return the state of a DAO proposal
     * @param proposalID A number representing proposalID
     * @returns a Promise<number\> that resolves to a number representing the state of a DAO proposal
     *
     * @example using Typescript
     * ```ts
     * const proposalID = 5; // fictional proposal to invite user Kermit
     * const state = rp.dao.proposals.getState(proposalID).then((val: number) => { val };
     * ```
     */
    getState(proposalID: number): Promise<number>;
    /**
     * Return the number of votes for a specific DAO proposal
     * @param proposalID A number representing proposalID
     * @returns a Promise<number\> that resolves to a number representing the votes for a specific DAO proposal
     *
     * @example using Typescript
     * ```ts
     * const proposalID = 5; // fictional proposal to invite user Kermit
     * const voteFor = rp.dao.proposals.getVotesFor(proposalID).then((val: number) => { val };
     * ```
     */
    getVotesFor(proposalID: number): Promise<number>;
    /**
     * Return the number of votes required for a specific DAO proposal
     * @param proposalID A number representing proposalID
     * @returns a Promise<number\> that resolves to a number representing the votes required for a specific DAO proposal
     *
     * @example using Typescript
     * ```ts
     * const proposalID = 5; // fictional proposal to invite user Kermit
     * const votesRequired = rp.dao.proposals.getVotesRequired(proposalID).then((val: number) => { val };
     * ```
     */
    getVotesRequired(proposalID: number): Promise<number>;
    /**
     * Return the start block of this proposal
     * @param proposalID A number representing proposalID
     * @returns a Promise<number\> that resolves to a number representing the start block for the specific DAO proposal
     *
     * @example using Typescript
     * ```ts
     * const proposalID = 5; // fictional proposal to invite user Kermit
     * const state = rp.dao.proposals.getStart(proposalID).then((val: number) => { val };
     * ```
     */
    getStart(proposalID: number): Promise<number>;
    /**
     * Return the end block of this proposal
     * @param proposalID A number representing proposalID
     * @returns a Promise<number\> that resolves to a number representing the end block for the specific DAO proposal
     *
     * @example using Typescript
     * ```ts
     * const proposalID = 5; // fictional proposal to invite user Kermit
     * const state = rp.dao.proposals.getEnd(proposalID).then((val: number) => { val };
     * ```
     */
    getEnd(proposalID: number): Promise<number>;
    /**
     * Return the number of votes against a specific DAO proposal
     * @param proposalID A number representing proposalID
     * @returns a Promise<number\> that resolves to a number representing the votes against a specific DAO proposal
     *
     * @example using Typescript
     * ```ts
     * const proposalID = 5; // fictional proposal to invite user Kermit
     * const voteFor = rp.dao.proposals.getVotesAgainst(proposalID).then((val: number) => { val };
     * ```
     */
    getVotesAgainst(proposalID: number): Promise<number>;
    /**
     * Return the block a specific DAO proposal expires
     * @param proposalID A number representing proposalID
     * @returns a Promise<number\> that resolves to a number representing the block that a specific DAO proposal expires
     *
     * @example using Typescript
     * ```ts
     * const proposalID = 5; // fictional proposal to invite user Kermit
     * const state = rp.dao.proposals.getEnd(proposalID).then((val: number) => { val };
     * ```
     */
    getExpires(proposalID: number): Promise<number>;
}
export default DAOProposal;
