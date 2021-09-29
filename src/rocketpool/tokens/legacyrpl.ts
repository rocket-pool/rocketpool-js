// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../utils/transaction";
import ERC20 from "./erc20";

/**
 * Rocket Pool Legacy RPL token manager
 */
class LegacyRPL extends ERC20 {
	// Constructor
	public constructor(web3: Web3, contracts: Contracts) {
		super(web3, contracts, "rocketTokenRPLFixedSupply");
	}

	/**
   * Getters
   */
	// Get contract address
	public getAddress(): Promise<string> {
		return this.tokenContract.then((tokenContract: Contract): string => {
			return tokenContract.options.address;
		});
	}
}

// Exports
export default LegacyRPL;
