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
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketClaimNode contract
	 */
	private get rocketClaimNode(): Promise<Contract> {
		return this.contracts.get("rocketClaimNode");
	}

	/**
	 * Determine if the claim is possible
	 * @params address a string representing the node address
	 * @returns a Promise<boolean\> that resolves to a boolean representing if a claim is possible
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const claimPossible = rp.rewards.claimNode.getClaimPossible(address).then((val: bool) => { val };
	 * ```
	 */
	public getClaimPossible(address: string): Promise<boolean> {
		return this.rocketClaimNode.then((rocketClaimNode: Contract): Promise<boolean> => {
			return rocketClaimNode.methods.getClaimPossible(address).call();
		});
	}

	/**
	 * Make a node claim
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
	 * };
	 * const txReceipt = rp.rewards.claimNode(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public claim(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketClaimNode.then((rocketClaimNode: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketClaimNode.methods.claim().send(options), onConfirmation);
		});
	}
}

// Exports
export default Rewards;
