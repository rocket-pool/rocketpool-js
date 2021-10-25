// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../../../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../../../utils/transaction";

/**
 * Rocket Pool DAO Trusted Node Proposals
 */
class DAONodeTrustedProposals {
	/**
	 * Create a new DAONodeTrustedProposals instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAONodeTrustedProposals contract
	 */
	private get rocketDAONodeTrustedProposals(): Promise<Contract> {
		return this.contracts.get("rocketDAONodeTrustedProposals");
	}

	/**
	 * Create a DAO proposal with calldata
	 * @param message A string representing the message
	 * @param payload A string representing the calldata payload
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const proposerDAOMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const toBeKickedDAOMember = "0x6f10Fd508321D27D8F19CBCC2F2f3d5527B637eC";
	 * const fineAmount = "5000000000000000000000";
	 * const message = "hey guys, this member hasn't logged on for weeks, lets boot them with a 33% fine!";
	 * const proposalCalldata = web3.eth.abi.encodeFunctionCall(
	 * {
	 *				name: "proposalKick",
	 *				type: "function",
	 *					inputs: [
	 *						{ type: "address", name: "_nodeAddress" },
	 *						{ type: "uint256", name: "_rplFine" },
	 *					],
	 * },
	 * [toBeKickedDAOMember, registeredNodeTrusted2BondAmountFine.toString()]
	 * );
	 *
	 * const options = {
	 *		from: proposerDAOMember,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.dao.node.trusted.proposals.propose(message, payload, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public propose(message: string, payload: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedProposals.then((rocketDAONodeTrustedProposals: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedProposals.methods.propose(message, payload).send(options), onConfirmation);
		});
	}

	/**
	 * Vote on an existing proposal
	 * @param proposalID A number representing the proposalID
	 * @param vote A boolean representing the vote
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const proposalID = 1;
	 * const vote = true;
	 * const daoMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 *
	 * const options = {
	 *		from: daoMember,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.dao.node.trusted.proposals.vote(proposalID, vote, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public vote(proposalID: number, vote: boolean, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedProposals.then((rocketDAONodeTrustedProposals: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedProposals.methods.vote(proposalID, vote).send(options), onConfirmation);
		});
	}

	/**
	 * Execute on an existing proposal
	 * @param proposalID A number representing the proposalID
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const proposalID = 1;
	 * const daoMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 *
	 * const options = {
	 *		from: daoMember,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.dao.node.trusted.proposals.execute(proposalID, vote, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public execute(proposalID: number, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedProposals.then((rocketDAONodeTrustedProposals: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedProposals.methods.execute(proposalID).send(options), onConfirmation);
		});
	}

	/**
	 * Cancel an existing proposal
	 * @param proposalID A number representing the proposalID
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const proposalID = 1;
	 * const daoMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 *
	 * const options = {
	 *		from: daoMember,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.dao.node.trusted.proposals.cancel(proposalID, vote, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public cancel(proposalID: number, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedProposals.then((rocketDAONodeTrustedProposals: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedProposals.methods.cancel(proposalID).send(options), onConfirmation);
		});
	}
}

// Exports
export default DAONodeTrustedProposals;
