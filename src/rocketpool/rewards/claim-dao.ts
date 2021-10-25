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
	/**
	 * Create a new Rewards instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketClaimDAO contract
	 */
	private get rocketClaimDAO(): Promise<Contract> {
		return this.contracts.get("rocketClaimDAO");
	}
}

// Exports
export default Rewards;
