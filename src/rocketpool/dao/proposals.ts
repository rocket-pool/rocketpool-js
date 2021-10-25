// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../utils/transaction";

/**
 * Rocket Pool DAO Proposals
 */
class DAOProposal {
	/**
	 * Create a new DAOProposal instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProposal contract
	 */
	private get rocketDAOProposal(): Promise<Contract> {
		return this.contracts.get("rocketDAOProposal");
	}

	/**
	 * Return the total of DAO Proposals
	 * @returns a Promise<number\> that resolves to a number representing if node registrations are enabled
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.dao.proposals.getTotal().then((val: number) => { val };
	 * ```
	 */
	public getTotal(): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getTotal().call();
		});
	}

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
	public getState(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getState(proposalID).call();
		});
	}

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
	public getVotesFor(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getVotesFor(proposalID).call();
		});
	}

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
	public getVotesRequired(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getVotesRequired(proposalID).call();
		});
	}

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
	public getStart(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getStart(proposalID).call();
		});
	}

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
	public getEnd(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getEnd(proposalID).call();
		});
	}

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
	public getVotesAgainst(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getVotesAgainst(proposalID).call();
		});
	}

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
	public getExpires(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getExpires(proposalID).call();
		});
	}
}

// Exports
export default DAOProposal;
