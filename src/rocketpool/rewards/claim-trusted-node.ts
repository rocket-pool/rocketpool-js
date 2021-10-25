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
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketClaimTrustedNode contract
	 */
	private get rocketClaimTrustedNode(): Promise<Contract> {
		return this.contracts.get("rocketClaimTrustedNode");
	}

	/**
	 * Get claim rewards amount
	 * @params address a string representing the node address
	 * @returns a Promise<string\> that resolves to a string representing the claim rewards amount in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const claimPossible = rp.rewards.claimTrustedNode.getClaimRewardsAmount(address).then((val: string) => { val };
	 * ```
	 */
	public getClaimRewardsAmount(address: string): Promise<string> {
		return this.rocketClaimTrustedNode.then((rocketClaimTrustedNode: Contract): Promise<string> => {
			return rocketClaimTrustedNode.methods.getClaimRewardsAmount(address).call();
		});
	}

	/**
	 * Claim from a trusted node
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const trustedNode = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
	 * const options = {
	 *		from: trustedNode,
	 *		gas: 1000000
	 * };
	 * const txReceipt = rp.rewards.claimTrustedNode(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public claim(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketClaimTrustedNode.then((rocketClaimTrustedNode: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketClaimTrustedNode.methods.claim().send(options), onConfirmation);
		});
	}
}

// Exports
export default Rewards;
