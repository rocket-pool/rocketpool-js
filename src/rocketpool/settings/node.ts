// Imports
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import Contracts from "../contracts/contracts";

/**
 * Rocket Pool Node Settings Manager
 */
class NodeSettings {
	/**
	 * Create a new Node Settings instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketDAOProtocolSettingsNode contract
	 */
	private get rocketDAOProtocolSettingsNode(): Promise<Contract> {
		return this.contracts.get("rocketDAOProtocolSettingsNode");
	}

	/**
	 * Return if node registrations are currently enabled
	 * @returns a Promise<boolean> that resolves to a boolean representing if node registrations are enabled
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.node.getRegistrationEnabled().then((val: boolean) => { val };
	 * ```
	 */
	public getRegistrationEnabled(): Promise<boolean> {
		return this.rocketDAOProtocolSettingsNode.then((rocketDAOProtocolSettingsNode: Contract): Promise<boolean> => {
			return rocketDAOProtocolSettingsNode.methods.getRegistrationEnabled().call();
		});
	}

	/**
	 * Return if node deposits are currently enabled
	 * @returns a Promise<boolean> that resolves to a boolean representing if node deposits are enabled
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.node.getDepositEnabled().then((val: boolean) => { val };
	 * ```
	 */
	public getDepositEnabled(): Promise<boolean> {
		return this.rocketDAOProtocolSettingsNode.then((rocketDAOProtocolSettingsNode: Contract): Promise<boolean> => {
			return rocketDAOProtocolSettingsNode.methods.getDepositEnabled().call();
		});
	}
}

// Exports
export default NodeSettings;
