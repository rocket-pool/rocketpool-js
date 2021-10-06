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
	private get rocketClaimNode(): Promise<Contract> {
		return this.contracts.get("rocketClaimNode");
	}

	/**
	 * Getters
	 */
	// Determine if the claim is possible
	public getClaimPossible(address: string): Promise<string> {
		return this.rocketClaimNode.then((rocketClaimNode: Contract): Promise<string> => {
			return rocketClaimNode.methods.getNodeClaimPossible(address).call();
		});
	}

	/**
	 * Mutators - Public
	 */
	// Make a node claim
	public claim(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketClaimNode.then((rocketClaimNode: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketClaimNode.methods.claim().send(options), onConfirmation);
		});
	}
}

// Exports
export default Rewards;
