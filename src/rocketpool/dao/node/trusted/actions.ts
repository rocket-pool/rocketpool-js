// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../../../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../../../utils/transaction";

/**
 * Rocket Pool DAO Trusted Node Actions
 */
class DAONodeTrustedActions {
	/**
	 * Create a new DAONodeTrustedActions instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAONodeTrustedActions contract
	 */
	private get rocketDAONodeTrustedActions(): Promise<Contract> {
		return this.contracts.get("rocketDAONodeTrustedActions");
	}

	/**
	 * Join the DAO
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.dao.node.trusted.actions.actionJoin(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public actionJoin(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedActions.then((rocketDAONodeTrustedActions: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedActions.methods.actionJoin().send(options), onConfirmation);
		});
	}

	/**
	 * Leave the DAO
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.dao.node.trusted.actions.actionLeave(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public actionLeave(refundAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedActions.then((rocketDAONodeTrustedActions: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedActions.methods.actionLeave(refundAddress).send(options), onConfirmation);
		});
	}

	/**
	 * Challenge another DAO member
	 * @param address A string representing the address of the DAO member you want challenge
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const addressToChallenge = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.dao.node.trusted.actions.actionChallengeMake(addressToChallenge, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public actionChallengeMake(address: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedActions.then((rocketDAONodeTrustedActions: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedActions.methods.actionChallengeMake(address).send(options), onConfirmation);
		});
	}

	/**
	 * Decides the success of a challenge
	 * @param address A string representing the address of the DAO member you want challenge
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const addressToChallenge = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.dao.node.trusted.actions.actionChallengeMake(addressToChallenge, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public actionChallengeDecide(address: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedActions.then((rocketDAONodeTrustedActions: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedActions.methods.actionChallengeDecide(address).send(options), onConfirmation);
		});
	}
}

// Exports
export default DAONodeTrustedActions;
