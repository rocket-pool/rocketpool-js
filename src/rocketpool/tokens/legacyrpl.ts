// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../utils/transaction";
import ERC20 from "./erc20";

/**
 * Rocket Pool Legacy RPL Token Manager
 */
class LegacyRPL extends ERC20 {
	/**
	 * Create a new LegacyRPL instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(web3: Web3, contracts: Contracts) {
		super(web3, contracts, "rocketTokenRPLFixedSupply");
	}

	/**
	 * Get the contract address
	 * @returns a Promise<string> that resolves to a string representing the contract address of the token
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = rp.tokens.legacyrpl.getAddress().then((val: string) => { val };
	 * ```
	 */
	public getAddress(): Promise<string> {
		return this.tokenContract.then((tokenContract: Contract): string => {
			return tokenContract.options.address;
		});
	}
}

// Exports
export default LegacyRPL;
