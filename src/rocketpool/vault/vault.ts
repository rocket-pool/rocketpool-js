// Imports
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import Contracts from "../contracts/contracts";

/**
 * Rocket Pool Vault
 */
class Vault {

	/**
	 * Create a new Vault instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketVault contract
	 */
	private get rocketVault(): Promise<Contract> {
		return this.contracts.get("rocketVault");
	}

	/**
	 * Retrieve the RocketVault contract address
	 * @returns a Promise<string> that resolves to the Rocket Vault contract address
	 *
	 * @example using Typescript
	 * ```ts
	 * const rocketVault = rp.vault.getAddress().then((val: string) => { val };
	 * ```
	 */
	public getAddress(): Promise<string> {
		return this.rocketVault.then((rocketVault: Contract): string => {
			return rocketVault.options.address;
		});
	}

	/**
	 * Retrieve the balance of a token when providing a contract & token address
	 * @param contractAddress A string representing the contract address
	 * @param tokenAddress A string representing the token address
	 * @returns a Promise<string> that resolves to the Rocket Vault contract address
	 *
	 * @example using Typescript
	 * ```ts
	 * const rplBalance = rp.vault.balanceOfToken("rocketClaimDAO", rocketTokenRPLAddress).then((val: string) => { val }
	 * ```
	 */
	public balanceOfToken(contractAddress: string, tokenAddress: string): Promise<string> {
		return this.rocketVault.then((rocketVault: Contract): Promise<string> => {
			return rocketVault.methods.balanceOfToken(contractAddress, tokenAddress).call();
		});
	}

}

// Exports
export default Vault;
