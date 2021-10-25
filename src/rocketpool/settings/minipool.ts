// Imports
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import Contracts from "../contracts/contracts";

/**
 * Rocket Pool Minipool Settings Manager
 */
class MinipoolSettings {
	/**
	 * Create a new Minipool Settings instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsMinipool contract
	 */
	private get rocketDAOProtocolSettingsMinipool(): Promise<Contract> {
		return this.contracts.get("rocketDAOProtocolSettingsMinipool");
	}

	/**
	 * Return the balance required to launch a minipool setting in Wei
	 * @returns a Promise<string\> that resolves to a string representing the balance required to launch a minipool setting
	 *
	 * @example using Typescript
	 * ```ts
	 * const launchBalance = rp.settings.minipool.getLaunchBalance().then((val: string) => { val };
	 * ```
	 */
	public getLaunchBalance(): Promise<string> {
		return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsMinipool.methods.getLaunchBalance().call();
		});
	}

	/**
	 * Return the full node deposit amounts setting in Wei
	 * @returns a Promise<string\> that resolves to a string representing the full node deposit amounts setting in wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const fullDepositNodeAmount = rp.settings.minipool.getFullDepositNodeAmount().then((val: string) => { val };
	 * ```
	 */
	public getFullDepositNodeAmount(): Promise<string> {
		return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsMinipool.methods.getFullDepositNodeAmount().call();
		});
	}

	/**
	 * Return the half node deposit amounts setting in Wei
	 * @returns a Promise<string\> that resolves to a string representing the half node deposit amounts setting in wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const halfDepositNodeAmount = rp.settings.minipool.getHalfDepositNodeAmount().then((val: string) => { val };
	 * ```
	 */
	public getHalfDepositNodeAmount(): Promise<string> {
		return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsMinipool.methods.getHalfDepositNodeAmount().call();
		});
	}

	/**
	 * Return the empty node deposit amounts setting in Wei
	 * @returns a Promise<string\> that resolves to a string representing the empty node deposit amounts setting in wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const emptyDepositNodeAmount = rp.settings.minipool.getEmptyDepositNodeAmount().then((val: string) => { val };
	 * ```
	 */
	public getEmptyDepositNodeAmount(): Promise<string> {
		return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsMinipool.methods.getEmptyDepositNodeAmount().call();
		});
	}

	/**
	 * Return the full user deposit amount setting in Wei
	 * @returns a Promise<string\> that resolves to a string representing the full user deposit amount setting in wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const fullDepositUserAmount = rp.settings.minipool.getFullDepositUserAmount().then((val: string) => { val };
	 * ```
	 */
	public getFullDepositUserAmount(): Promise<string> {
		return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsMinipool.methods.getFullDepositUserAmount().call();
		});
	}

	/**
	 * Return the half user deposit amount setting in Wei
	 * @returns a Promise<string\> that resolves to a string representing the half user deposit amount setting in wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const halfDepositUserAmount = rp.settings.minipool.getHalfDepositUserAmount().then((val: string) => { val };
	 * ```
	 */
	public getHalfDepositUserAmount(): Promise<string> {
		return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsMinipool.methods.getHalfDepositUserAmount().call();
		});
	}

	/**
	 * Return the empty user deposit amount setting in Wei
	 * @returns a Promise<string\> that resolves to a string representing the empty user deposit amount setting in wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const emptyDepositUserAmount = rp.settings.minipool.getEmptyDepositUserAmount().then((val: string) => { val };
	 * ```
	 */
	public getEmptyDepositUserAmount(): Promise<string> {
		return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsMinipool.methods.getEmptyDepositUserAmount().call();
		});
	}

	/**
	 * Return the minipool withdrawable event submissions setting
	 * @returns a Promise<boolean\> that resolves to a boolean representing if minipool withdrawable events submissions are enabled
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.settings.minipool.getSubmitWithdrawableEnabled().then((val: boolean) => { val };
	 * ```
	 */
	public getSubmitWithdrawableEnabled(): Promise<boolean> {
		return this.rocketDAOProtocolSettingsMinipool.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<boolean> => {
			return rocketDAOProtocolSettingsMinipool.methods.getSubmitWithdrawableEnabled().call();
		});
	}

	/**
	 * Return the period in blocks for prelaunch minipools to launch
	 * @returns a Promise<number\> that resolves to a number representing the period in blocks for prelaunch minipools to launch
	 *
	 * @example using Typescript
	 * ```ts
	 * const launchTimeout = rp.settings.minipool.getLaunchTimeout().then((val: number) => { val };
	 * ```
	 */
	public getLaunchTimeout(): Promise<number> {
		return this.rocketDAOProtocolSettingsMinipool
			.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
				return rocketDAOProtocolSettingsMinipool.methods.getLaunchTimeout().call();
			})
			.then((value: string): number => parseInt(value));
	}

	/**
	 * Return the withdrawal delay setting in blocks
	 * @returns a Promise<number\> that resolves to a number representing the withdrawal delay setting in blocks
	 *
	 * @example using Typescript
	 * ```ts
	 * const withdrawalDelay = rp.settings.minipool.getWithdrawalDelay().then((val: number) => { val };
	 * ```
	 */
	public getWithdrawalDelay(): Promise<number> {
		return this.rocketDAOProtocolSettingsMinipool
			.then((rocketDAOProtocolSettingsMinipool: Contract): Promise<string> => {
				return rocketDAOProtocolSettingsMinipool.methods.getWithdrawalDelay().call();
			})
			.then((value: string): number => parseInt(value));
	}
}

// Exports
export default MinipoolSettings;
