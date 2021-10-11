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
	 * @param contracts A Rocket Pool Contract Manager Instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	// Contract accessors
	private get rocketDAONodeTrustedActions(): Promise<Contract> {
		return this.contracts.get("rocketDAONodeTrustedActions");
	}

	/**
	 * Getters
	 */

	/**
	 * Mutators - Public
	 */

	// Join the DAO
	public actionJoin(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedActions.then((rocketDAONodeTrustedActions: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedActions.methods.actionJoin().send(options), onConfirmation);
		});
	}

	// Leave the DAO
	public actionLeave(refundAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedActions.then((rocketDAONodeTrustedActions: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedActions.methods.actionLeave(refundAddress).send(options), onConfirmation);
		});
	}

	// Challenge Make
	public actionChallengeMake(address: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedActions.then((rocketDAONodeTrustedActions: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedActions.methods.actionChallengeMake(address).send(options), onConfirmation);
		});
	}

	// Challenge Decide
	public actionChallengeDecide(address: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrustedActions.then((rocketDAONodeTrustedActions: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrustedActions.methods.actionChallengeDecide(address).send(options), onConfirmation);
		});
	}
}

// Exports
export default DAONodeTrustedActions;
