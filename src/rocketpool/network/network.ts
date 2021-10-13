// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../utils/transaction";

/**
 * Rocket Pool Network Manager
 */
class Network {
	/**
	 * Create a new Network instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketNetworkBalances contract
	 */
	private get rocketNetworkBalances(): Promise<Contract> {
		return this.contracts.get("rocketNetworkBalances");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketNetworkFees contract
	 */
	private get rocketNetworkFees(): Promise<Contract> {
		return this.contracts.get("rocketNetworkFees");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketNetworkPrices contract
	 */
	private get rocketNetworkPrices(): Promise<Contract> {
		return this.contracts.get("rocketNetworkPrices");
	}

	/**
	 * Get the block that current network balances are set for
	 * @returns a Promise<number> that resolves to a number representing the block that the current network balances are
	 * set for
	 *
	 * @example using Typescript
	 * ```ts
	 * const block = rp.network.getBalancesBlock().then((val: number) => { val };
	 * ```
	 */
	public getBalancesBlock(): Promise<number> {
		return this.rocketNetworkBalances
			.then((rocketNetworkBalances: Contract): Promise<string> => {
				return rocketNetworkBalances.methods.getBalancesBlock().call();
			})
			.then((value: string): number => parseInt(value));
	}

	/**
	 * Get the current network total ETH balance in Wei
	 * @returns a Promise<string> that resolves to a string representing the current network total ETH balance in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const balanceInWei = rp.network.getTotalETHBalance().then((val: string) => { val };
	 * // convert to Ether if needed
	 * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
	 * ```
	 */
	public getTotalETHBalance(): Promise<string> {
		return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<string> => {
			return rocketNetworkBalances.methods.getTotalETHBalance().call();
		});
	}

	/**
	 * Get the current network staking ETH balance in Wei
	 * @returns a Promise<string> that resolves to a string representing the current network staking ETH balance in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const balanceInWei = rp.network.getStakingETHBalance().then((val: string) => { val };
	 * // convert to Ether if needed
	 * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
	 * ```
	 */
	public getStakingETHBalance(): Promise<string> {
		return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<string> => {
			return rocketNetworkBalances.methods.getStakingETHBalance().call();
		});
	}

	/**
	 * Get the current network total rETH supply in Wei
	 * @returns a Promise<string> that resolves to a string representing the rETH supply in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const balanceInWei = rp.network.getTotalRETHSupply().then((val: string) => { val };
	 * // convert to Ether if needed
	 * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
	 * ```
	 */
	public getTotalRETHSupply(): Promise<string> {
		return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<string> => {
			return rocketNetworkBalances.methods.getTotalRETHSupply().call();
		});
	}

	/**
	 * Get the current network ETH utilization rate
	 * @returns a Promise<string> that resolves to a string representing the ETH utilization rate in ETH (automatically
	 * parsed from Wei)
	 *
	 * @example using Typescript
	 * ```ts
	 * const utilizationRate = rp.network.getETHUtilizationRate().then((val: string) => { val };
	 * ```
	 */
	public getETHUtilizationRate(): Promise<number> {
		return this.rocketNetworkBalances
			.then((rocketNetworkBalances: Contract): Promise<string> => {
				return rocketNetworkBalances.methods.getETHUtilizationRate().call();
			})
			.then((value: string): number => parseFloat(this.web3.utils.fromWei(value, "ether")));
	}

	/**
	 * Get the current network node demand in Wei
	 * @returns a Promise<string> that resolves to a string representing the current node demand in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const balanceInWei = rp.network.getNodeDemand().then((val: string) => { val };
	 * // convert to Ether if needed
	 * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
	 * ```
	 */
	public getNodeDemand(): Promise<string> {
		return this.rocketNetworkFees.then((rocketNetworkFees: Contract): Promise<string> => {
			return rocketNetworkFees.methods.getNodeDemand().call();
		});
	}

	/**
	 * Get the current network node demand
	 * @returns a Promise<string> that resolves to a number representing the current node fee
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeFee = rp.network.getNodeFee().then((val: number) => { val };
	 * ```
	 */
	public getNodeFee(): Promise<number> {
		return this.rocketNetworkFees.then((rocketNetworkFees: Contract): Promise<number> => {
			return rocketNetworkFees.methods.getNodeFee().call();
		});
	}

	/**
	 * Get the network node commission rate by demand value
	 * @param demand A string representing the demand
	 * @returns a Promise<number> that resolves to a number representing the network node commission rate by demand value
	 *
	 * @example using Typescript
	 * ```ts
	 * const demand = web3.utils.toWei("0.75", "ether");
	 * const nodeFeeByDemand = rp.network.getNodeFeeByDemand(demand).then((val: string) => { val };
	 * ```
	 */
	public getNodeFeeByDemand(demand: string): Promise<number> {
		return this.rocketNetworkFees.then((rocketNetworkFees: Contract): Promise<number> => {
			return rocketNetworkFees.methods.getNodeFeeByDemand(demand).call();
		});
	}

	/**
	 * Get the network RPL Price
	 * @returns a Promise<number> that resolves to a number representing the network RPL price
	 *
	 * @example using Typescript
	 * ```ts
	 * const rplPrice = rp.network.getRPLPrice().then((val: number) => { val };
	 * ```
	 */
	public getRPLPrice(): Promise<number> {
		return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<number> => {
			return rocketNetworkPrices.methods.getRPLPrice().call();
		});
	}

	/**
	 * Get the prices block
	 * @returns a Promise<number> that resolves to a number representing the prices block
	 *
	 * @example using Typescript
	 * ```ts
	 * const block = rp.network.getPricesBlock().then((val: number) => { val };
	 * ```
	 */
	public getPricesBlock(): Promise<number> {
		return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<number> => {
			return rocketNetworkPrices.methods.getPricesBlock().call();
		});
	}

	/**
	 * Get latest reportable block
	 * @returns a Promise<string> that resolves to a string representing the latest reportable block
	 *
	 * @example using Typescript
	 * ```ts
	 * const latestReportableBlock = rp.network.getLatestReportableBlock().then((val: string) => { val };
	 * ```
	 */
	public getLatestReportableBlock(): Promise<string> {
		return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<string> => {
			return rocketNetworkPrices.methods.getLatestReportableBlock().call();
		});
	}

	/**
	 * Get effective RPL stake
	 * @returns a Promise<string> that resolves to a string representing the effective RPL stake
	 *
	 * @example using Typescript
	 * ```ts
	 * const effectiveRPLStake = rp.network.getEffectiveRPLStake().then((val: string) => { val };
	 * ```
	 */
	public getEffectiveRPLStake(): Promise<string> {
		return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<string> => {
			return rocketNetworkPrices.methods.getEffectiveRPLStake().call();
		});
	}

	/**
	 * Get the block that the effective RPL stake was updated at
	 * @returns a Promise<string> that resolves to a string representing the block the effective RPL stake was updated at
	 *
	 * @example using Typescript
	 * ```ts
	 * const block = rp.network.getEffectiveRPLStakeUpdatedBlock().then((val: string) => { val };
	 * ```
	 */
	public getEffectiveRPLStakeUpdatedBlock(): Promise<string> {
		return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<string> => {
			return rocketNetworkPrices.methods.getEffectiveRPLStakeUpdatedBlock().call();
		});
	}

	/**
	 * Submit node balances (Restricted to oDAO nodes)
	 * @param block A string representing the block
	 * @param totalEth A string representing the totalEth in Wei
	 * @param stakingEth A string representing the stakingEth in Wei
	 * @param rethSupply A string representing the rethSupply in Wei
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const block = await web3.eth.getBlockNumber();
	 * const totalEth = web3.utils.toWei("1", "ether");
	 * const stakingEth = "0";
	 * const rethSupply = rp.network.getTotalRETHSupply().then((val: string) => { val };
	 * const trustedNode = "0x18A58E43c37DdC9ccCf3AC642c6f430ad663E400"; // must be an oDAO member
	 *
	 * const options = {
	 *		from: trustedNode,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.network.submitBalances(block, totalEth, stakingEth, rethSupply, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public submitBalances(
		block: number,
		totalEth: string,
		stakingEth: string,
		rethSupply: string,
		options?: SendOptions,
		onConfirmation?: ConfirmationHandler
	): Promise<TransactionReceipt> {
		return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketNetworkBalances.methods.submitBalances(block, totalEth, stakingEth, rethSupply).send(options), onConfirmation);
		});
	}

	/**
	 * Submit prices (Restricted to oDAO nodes)
	 * @param block A string representing the block
	 * @param rplPrice A string representing the rplPrice in Wei
	 * @param effectiveRplStake A string representing the effective RPL stake
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const block = await web3.eth.getBlockNumber();
	 * const rplPrice = web3.utils.toWei("1", "ether");
	 * const effectiveRPLStake = rp.node.calculateTotalEffectiveRPLStake(0, 0, rplPrice).then((val: string) => { val };
	 * const trustedNode = "0x18A58E43c37DdC9ccCf3AC642c6f430ad663E400"; // must be an oDAO member
	 *
	 * const options = {
	 *		from: trustedNode,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.network.submitPrices(block, rplPrice, effectiveRplStake, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public submitPrices(
		block: number,
		rplPrice: string,
		effectiveRplStake: string,
		options?: SendOptions,
		onConfirmation?: ConfirmationHandler
	): Promise<TransactionReceipt> {
		return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketNetworkPrices.methods.submitPrices(block, rplPrice, effectiveRplStake).send(options), onConfirmation);
		});
	}

	/**
	 * Execute prices (Restricted to oDAO nodes)
	 * @param block A string representing the block
	 * @param rplPrice A string representing the rplPrice in Wei
	 * @param effectiveRplStake A string representing the effective RPL stake
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const block = await web3.eth.getBlockNumber();
	 * const rplPrice = web3.utils.toWei("1", "ether");
	 * const effectiveRPLStake = rp.node.calculateTotalEffectiveRPLStake(0, 0, rplPrice).then((val: string) => { val };
	 * const trustedNode = "0x18A58E43c37DdC9ccCf3AC642c6f430ad663E400"; // must be an oDAO member
	 *
	 * const options = {
	 *		from: trustedNode,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.network.executeUpdatePrices(block, rplPrice, effectiveRplStake, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public executeUpdatePrices(
		block: number,
		rplPrice: string,
		effectiveRplStake: string,
		options?: SendOptions,
		onConfirmation?: ConfirmationHandler
	): Promise<TransactionReceipt> {
		return this.rocketNetworkPrices.then((rocketNetworkPrices: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketNetworkPrices.methods.executeUpdatePrices(block, rplPrice, effectiveRplStake).send(options), onConfirmation);
		});
	}

	/**
	 * Execute Update Balances (Restricted to oDAO nodes)
	 * @param block A string representing the block
	 * @param totalEth A string representing the totalEth in Wei
	 * @param stakingEth A string representing the stakingEth in Wei
	 * @param rethSupply A string representing the rethSupply in Wei
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const block = await web3.eth.getBlockNumber();
	 * const totalEth = web3.utils.toWei("1", "ether");
	 * const stakingEth = "0";
	 * const rethSupply = rp.network.getTotalRETHSupply().then((val: string) => { val };
	 * const trustedNode = "0x18A58E43c37DdC9ccCf3AC642c6f430ad663E400"; // must be an oDAO member
	 *
	 * const options = {
	 *		from: trustedNode,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.network.executeUpdateBalances(block, totalEth, stakingEth, rethSupply, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public executeUpdateBalances(
		block: number,
		totalEth: string,
		stakingEth: string,
		rethSupply: string,
		options?: SendOptions,
		onConfirmation?: ConfirmationHandler
	): Promise<TransactionReceipt> {
		return this.rocketNetworkBalances.then((rocketNetworkBalances: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketNetworkBalances.methods.executeUpdateBalances(block, totalEth, stakingEth, rethSupply).send(options), onConfirmation);
		});
	}
}

// Exports
export default Network;
