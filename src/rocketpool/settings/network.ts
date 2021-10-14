// Imports
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import Contracts from "../contracts/contracts";

/**
 * Rocket Pool Network Settings Manager
 */
class NetworkSettings {
	/**
	 * Create a new Network Settings instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketDAOProtocolSettingsNetwork contract
	 */
	private get rocketDAOProtocolSettingsNetwork(): Promise<Contract> {
		return this.contracts.get("rocketDAOProtocolSettingsNetwork");
	}

	/**
	 * Return the threshold of trusted nodes that must reach consensus on oracle data to commit it
	 * @returns a Promise<number> that resolves to a number representing the threshold of trusted nodes that must reach consensus on oracle daa to commit it
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeConsensusThreshold = rp.settings.network.getNodeConsensusThreshold().then((val: number) => { val };
	 * ```
	 */
	public getNodeConsensusThreshold(): Promise<number> {
		return this.rocketDAOProtocolSettingsNetwork
			.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
				return rocketDAOProtocolSettingsNetwork.methods.getNodeConsensusThreshold().call();
			})
			.then((value: string): number => parseFloat(this.web3.utils.fromWei(value, "ether")));
	}

	/**
	 * Return if balance submissions are enabled
	 * @returns a Promise<boolean> that resolves to a boolean representing the threshold of trusted nodes that must reach consensus on oracle daa to commit it
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.network.getSubmitBalancesEnabled().then((val: boolean) => { val };
	 * ```
	 */
	public getSubmitBalancesEnabled(): Promise<boolean> {
		return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<boolean> => {
			return rocketDAOProtocolSettingsNetwork.methods.getSubmitBalancesEnabled().call();
		});
	}

	/**
	 * Return the frequency in blocks at which network balances should be submitted by trusted nodes
	 * @returns a Promise<number> that resolves to a number representing the frequency in blocks at which network balances should be submitted by trusted nodes
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.network.getSubmitBalancesFrequency().then((val: number) => { val };
	 * ```
	 */
	public getSubmitBalancesFrequency(): Promise<number> {
		return this.rocketDAOProtocolSettingsNetwork
			.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
				return rocketDAOProtocolSettingsNetwork.methods.getSubmitBalancesFrequency().call();
			})
			.then((value: string): number => parseInt(value));
	}

	/**
	 * Return the minimum node fee
	 * @returns a Promise<number> that resolves to a number representing the minimum node fee
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.network.getMinimumNodeFee().then((val: number) => { val };
	 * ```
	 */
	public getMinimumNodeFee(): Promise<number> {
		return this.rocketDAOProtocolSettingsNetwork
			.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
				return rocketDAOProtocolSettingsNetwork.methods.getMinimumNodeFee().call();
			})
			.then((value: string): number => parseFloat(this.web3.utils.fromWei(value, "ether")));
	}

	/**
	 * Return the target node fee
	 * @returns a Promise<number> that resolves to a number representing the target node fee
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.network.getTargetNodeFee().then((val: number) => { val };
	 * ```
	 */
	public getTargetNodeFee(): Promise<number> {
		return this.rocketDAOProtocolSettingsNetwork
			.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
				return rocketDAOProtocolSettingsNetwork.methods.getTargetNodeFee().call();
			})
			.then((value: string): number => parseFloat(this.web3.utils.fromWei(value, "ether")));
	}

	/**
	 * Return the maximum node fee
	 * @returns a Promise<number> that resolves to a number representing the maximum node fee
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.network.getMaximumNodeFee().then((val: number) => { val };
	 * ```
	 */
	public getMaximumNodeFee(): Promise<number> {
		return this.rocketDAOProtocolSettingsNetwork
			.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
				return rocketDAOProtocolSettingsNetwork.methods.getMaximumNodeFee().call();
			})
			.then((value: string): number => parseFloat(this.web3.utils.fromWei(value, "ether")));
	}

	/**
	 * Return the range of node demand values in Wei to base fee calculations on (from negative to positive value)
	 * @returns a Promise<string> that resolves to a string representing the range of node demand values in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.network.getNodeFeeDemandRange().then((val: string) => { val };
	 * ```
	 */
	public getNodeFeeDemandRange(): Promise<string> {
		return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsNetwork.methods.getNodeFeeDemandRange().call();
		});
	}

	/**
	 * Return the target rETH collateralization rate
	 * @returns a Promise<number> that resolves to a number representing the target rETH collateralization rate
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.network.getTargetRethCollateralRate().then((val: number) => { val };
	 * ```
	 */
	public getTargetRethCollateralRate(): Promise<number> {
		return this.rocketDAOProtocolSettingsNetwork
			.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
				return rocketDAOProtocolSettingsNetwork.methods.getTargetRethCollateralRate().call();
			})
			.then((value: string): number => parseFloat(this.web3.utils.fromWei(value, "ether")));
	}

	/**
	 * Return the rETH deposit delay setting
	 * @returns a Promise<number> that resolves to a number representing the rETH deposit delay setting
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.network.getRethDespositDelay().then((val: number) => { val };
	 * ```
	 */
	public getRethDespositDelay(): Promise<number> {
		return this.rocketDAOProtocolSettingsNetwork
			.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
				return rocketDAOProtocolSettingsNetwork.methods.getRethDepositDelay().call();
			})
			.then((value: string): number => parseFloat(value));
	}
}

// Exports
export default NetworkSettings;
