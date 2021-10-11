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
	 * @param contracts A Rocket Pool Contract Manager Instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	// Contract accessors
	private get rocketDAOProposal(): Promise<Contract> {
		return this.contracts.get("rocketDAOProposal");
	}

	/**
	 * Getters
	 */
	// Get the total of DAO Proposals
	public getTotal(): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getTotal().call();
		});
	}

	// Get the state of a DAO Proposal
	public getState(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getState(proposalID).call();
		});
	}

	// Get the number of votes for DAO Proposal
	public getVotesFor(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getVotesFor(proposalID).call();
		});
	}

	// Get the number of required votes for DAO Proposal
	public getVotesRequired(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getVotesRequired(proposalID).call();
		});
	}

	// Get start given a proposal id
	public getStart(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getStart(proposalID).call();
		});
	}

	// Get end given a proposal id
	public getEnd(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getEnd(proposalID).call();
		});
	}

	// Get votes against
	public getVotesAgainst(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getVotesAgainst(proposalID).call();
		});
	}

	// Get the block a proposal expires
	public getExpires(proposalID: number): Promise<number> {
		return this.rocketDAOProposal.then((rocketDAOProposal: Contract): Promise<number> => {
			return rocketDAOProposal.methods.getExpires(proposalID).call();
		});
	}

	/**
	 * Mutators - Public
	 */
}

// Exports
export default DAOProposal;
