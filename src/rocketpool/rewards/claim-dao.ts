// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../utils/transaction";
import { NodeDetails } from "../node/node";

/**
 * Rocket Pool Rewards
 */
class Rewards {
	// Constructor
	public constructor(private web3: Web3, private contracts: Contracts) {}

	// Contract accessors
	private get rocketClaimDAO(): Promise<Contract> {
		return this.contracts.get("rocketClaimDAO");
	}

	/**
	 * Getters
	 */

	/**
	 * Mutators - Public
	 */
}

// Exports
export default Rewards;
