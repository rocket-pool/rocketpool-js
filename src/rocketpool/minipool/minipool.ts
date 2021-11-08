// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../utils/transaction";
import MinipoolContract from "./minipool-contract";
import { getNodeActiveMinipoolCount, getNodeStakingMinipoolCount } from "../../test/_helpers/minipool";

// Minipool details
export interface MinipoolDetails {
	address: string;
	exists: boolean;
	pubkey: string;
}

/**
 * Rocket Pool Minipool Manager
 */
class Minipool {
	/**
	 * Create a new Minipool instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool Contract Manager Instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketMinipoolManager contract
	 */
	private get rocketMinipoolManager(): Promise<Contract> {
		return this.contracts.get("rocketMinipoolManager");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketMinipoolQueue contract
	 */
	private get rocketMinipoolQueue(): Promise<Contract> {
		return this.contracts.get("rocketMinipoolQueue");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketMinipoolStatus contract
	 */
	private get rocketMinipoolStatus(): Promise<Contract> {
		return this.contracts.get("rocketMinipoolStatus");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketMinipool contract
	 */
	private get rocketMinipool(): Promise<Contract> {
		return this.contracts.get("rocketMinipool");
	}

	/**
	 * Get all minipool details
	 * @returns a Promise<MinipoolDetails[]\> that resolves to an array of MinipoolDetails (address, exists, pubkey)
	 *
	 * @example using Typescript
	 * ```ts
	 * const minipools = rp.minipool.getMinipools().then((val: MinipoolDetails[]) => { val };
	 * ```
	 */
	public getMinipools(): Promise<MinipoolDetails[]> {
		return this.getMinipoolAddresses().then((addresses: string[]): Promise<MinipoolDetails[]> => {
			return Promise.all(
				addresses.map((address: string): Promise<MinipoolDetails> => {
					return this.getMinipoolDetails(address);
				})
			);
		});
	}

	/**
	 * Get all minipool addresses
	 * @returns a Promise<string[]\> that resolves to an array of minipool addresses as strings
	 *
	 * @example using Typescript
	 * ```ts
	 * const addresses = rp.minipool.getMinipoolAddresses().then((val: string[]) => { val };
	 * ```
	 */
	public getMinipoolAddresses(): Promise<string[]> {
		return this.getMinipoolCount().then((count: number): Promise<string[]> => {
			return Promise.all(
				[...Array(count).keys()].map((index: number): Promise<string> => {
					return this.getMinipoolAt(index);
				})
			);
		});
	}

	/**
	 * Get all node's minipool details
	 * @params nodeAddress a string representing the node address you which to return details for
	 * @returns a Promise<MinipoolDetails[]\> that resolves to an array of MinipoolDetails about a specific node
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const details = rp.minipool.getNodeMinipools(nodeAddress).then((val: MinipoolDetails[]) => { val };
	 * ```
	 */
	public getNodeMinipools(nodeAddress: string): Promise<MinipoolDetails[]> {
		return this.getNodeMinipoolAddresses(nodeAddress).then((addresses: string[]): Promise<MinipoolDetails[]> => {
			return Promise.all(
				addresses.map((address: string): Promise<MinipoolDetails> => {
					return this.getMinipoolDetails(address);
				})
			);
		});
	}

	/**
	 * Get all node's minipool addresses
	 * @params nodeAddress a string representing the node address you which to return details for
	 * @returns a Promise<string[]\> that resolves to an array of strings containing the minipool addresses
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const minipoolAddresses = rp.minipool.getNodeMinipoolAddresses(nodeAddress).then((val: string[]) => { val };
	 * ```
	 */
	public getNodeMinipoolAddresses(nodeAddress: string): Promise<string[]> {
		return this.getNodeMinipoolCount(nodeAddress).then((count: number): Promise<string[]> => {
			return Promise.all(
				[...Array(count).keys()].map((index: number): Promise<string> => {
					return this.getNodeMinipoolAt(nodeAddress, index);
				})
			);
		});
	}

	/**
	 * Get all minipool's details
	 * @params nodeAddress a string representing the node address you which to return details for
	 * @returns a Promise<MinipoolDetails\> that resolves to a singular MinipoolDetails with details about the minipool you want to look up
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const minipoolDetails = rp.minipool.getMinipoolDetails(nodeAddress).then((val: MinipoolDetails) => { val };
	 * ```
	 */
	public getMinipoolDetails(address: string): Promise<MinipoolDetails> {
		return Promise.all([this.getMinipoolExists(address), this.getMinipoolPubkey(address)]).then(
			([exists, pubkey]: [boolean, string]): MinipoolDetails => ({
				address,
				exists,
				pubkey,
			})
		);
	}

	/**
	 * Get all the total minipool count
	 * @returns a Promise<number\> that resolves to a number representing the total minipool count
	 *
	 * @example using Typescript
	 * ```ts
	 * const totalMinipools = rp.minipool.getMinipoolCount().then((val: number) => { val };
	 * ```
	 */
	public getMinipoolCount(): Promise<number> {
		return this.rocketMinipoolManager
			.then((rocketMinipoolManager: Contract): Promise<string> => {
				return rocketMinipoolManager.methods.getMinipoolCount().call();
			})
			.then((value: string): number => parseInt(value));
	}

	/**
	 * Get a minipool address by index
	 * @params index a number representing the index of the minipool you wish to lookup
	 * @returns a Promise<string\> that resolves to a string representing the minipool address
	 *
	 * @example using Typescript
	 * ```ts
	 * const index = 5;
	 * const address = rp.minipool.getMinipoolAt(index).then((val: string) => { val };
	 * ```
	 */
	public getMinipoolAt(index: number): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getMinipoolAt(index).call();
		});
	}

	/**
	 * Get a node's total minipool count
	 * @params nodeAddress a string representing the node address you which to return details for
	 * @returns a Promise<number\> that resolves to a number representing the node's total minipool count
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const nodeMinipoolCount = rp.minipool.getNodeMinipoolCount(nodeAddress).then((val: number) => { val };
	 * ```
	 */
	public getNodeMinipoolCount(nodeAddress: string): Promise<number> {
		return this.rocketMinipoolManager
			.then((rocketMinipoolManager: Contract): Promise<string> => {
				return rocketMinipoolManager.methods.getNodeMinipoolCount(nodeAddress).call();
			})
			.then((value: string): number => parseInt(value));
	}

	/**
	 * Get the staking minipool count
	 * @returns a Promise<number\> that resolves to a number representing the total staking minipool count
	 *
	 * @example using Typescript
	 * ```ts
	 * const stakingMinipoolCount = rp.minipool.getStakingMinipoolCount().then((val: number) => { val };
	 * ```
	 */
	public getStakingMinipoolCount(): Promise<number> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<number> => {
			return rocketMinipoolManager.methods.getStakingMinipoolCount().call();
		});
	}

	/**
	 * Get the node's staking minipool count
	 * @params nodeAddress a string representing the node address you which to return details for
	 * @returns a Promise<number\> that resolves to a number representing the node's staking minipool count
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const nodeStakingMinipoolCount = rp.minipool.getNodeStakingMinipoolCount(nodeAddress).then((val: number) => { val };
	 * ```
	 */
	public getNodeStakingMinipoolCount(nodeAddress: string): Promise<number> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<number> => {
			return rocketMinipoolManager.methods.getNodeStakingMinipoolCount(nodeAddress).call();
		});
	}

	/**
	 * Get the node's active minipool count
	 * @params nodeAddress a string representing the node address you which to return details for
	 * @returns a Promise<number\> that resolves to a number representing the node's active minipool count
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const nodeActiveMinipoolCount = rp.minipool.getNodeActiveMinipoolCount(nodeAddress).then((val: number) => { val };
	 * ```
	 */
	public getNodeActiveMinipoolCount(nodeAddress: string): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getNodeActiveMinipoolCount(nodeAddress).call();
		});
	}

	/**
	 * Get the node's minipool address by index
	 * @params nodeAddress a string representing the node address you which to return details for
	 * @params index a number representing the index of
	 * @returns a Promise<string\> that resolves to a string representing the minipool address at the desired index
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const index = 2;
	 * const address = rp.minipool.getNodeMinipoolAt(nodeAddress, index).then((val: string) => { val };
	 * ```
	 */
	public getNodeMinipoolAt(nodeAddress: string, index: number): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getNodeMinipoolAt(nodeAddress, index).call();
		});
	}

	/**
	 * Get a minipool address by validator pubkey
	 * @params validatorPubkey a string representing the validator pub key
	 * @returns a Promise<string\> that resolves to a string representing the minipool address at the desired pubkey
	 *
	 * @example using Typescript
	 * ```ts
	 * const validatorPubkey = "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003";
	 * const address = rp.minipool.getMinipoolByPubkey(nodeAddress).then((val: string) => { val };
	 * ```
	 */
	public getMinipoolByPubkey(validatorPubkey: string): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getMinipoolByPubkey(validatorPubkey).call();
		});
	}

	/**
	 * Check whether a minipool exists
	 * @params address a string representing the minipool address you to check against
	 * @returns a Promise<boolean\> that resolves to a boolean representing if a minipool exists at the address
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const exists = rp.minipool.getMinipoolExists(nodeAddress).then((val: boolean) => { val };
	 * ```
	 */
	public getMinipoolExists(address: string): Promise<boolean> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<boolean> => {
			return rocketMinipoolManager.methods.getMinipoolExists(address).call();
		});
	}

	/**
	 * Get the number of minipools in each status.
	 * Returns the counts for Initialised, Prelaunch, Staking, Withdrawable, and Dissolved in that order.
	 * @params offset a number representing the offset
	 * @params limit a number representing the minipool address you to check against
	 * @returns a Promise<number[]\> that resolves to an array of number objects representing the counts of each minipool status in the following order: Initialised, Prelaunch, Staking, Withdrawable, and Dissolved
	 *
	 * @example using Typescript
	 * ```ts
	 * const minipoolCountPerStatus = rp.minipool.getMinipoolCountPerStatus(offset, limit).then((val: object) => { val };
	 * ```
	 */
	public getMinipoolCountPerStatus(offset: number, limit: number): Promise<number[]> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<number[]> => {
			return rocketMinipoolManager.methods.getMinipoolCountPerStatus(offset, limit).call();
		});
	}

	/**
	 * Get a minipool's validator pubkey
	 * @params address a string representing the minipool address
	 * @returns a Promise<string\> that resolves to a string representing the pubkey for the provided minipool address
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const address = rp.minipool.getMinipoolPubkey(nodeAddress).then((val: string) => { val };
	 * ```
	 */
	public getMinipoolPubkey(address: string): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getMinipoolPubkey(address).call();
		});
	}

	/**
	 * Get a minipool's withdrawal credentials
	 * @params address a string representing the minipool address
	 * @returns a Promise<string\> that resolves to a string representing the minipool credentials
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const address = rp.minipool.getMinipoolWithdrawalCredentials(nodeAddress).then((val: string) => { val };
	 * ```
	 */
	public getMinipoolWithdrawalCredentials(address: string): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getMinipoolWithdrawalCredentials(address).call();
		});
	}

	/**
	 * Get the minipool queue length
	 * @params depositType a number representing the deposit type
	 * @returns a Promise<number\> that resolves to a number representing the minipool queue length
	 *
	 * @example using Typescript
	 * ```ts
	 * const length = rp.minipool.getQueueLength(1).then((val: number) => { val };
	 * ```
	 */
	public getQueueLength(depositType: number): Promise<number> {
		return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<number> => {
			return rocketMinipoolQueue.methods.getLength(depositType).call();
		});
	}

	/**
	 * Get the total minipool queue length
	 * @returns a Promise<number\> that resolves to a number representing the total minipool queue length
	 *
	 * @example using Typescript
	 * ```ts
	 * const totalLength = rp.minipool.getQueueTotalLength().then((val: number) => { val };
	 * ```
	 */
	public getQueueTotalLength(): Promise<number> {
		return this.rocketMinipoolQueue
			.then((rocketMinipoolQueue: Contract): Promise<string> => {
				return rocketMinipoolQueue.methods.getTotalLength().call();
			})
			.then((value: string): number => parseInt(value));
	}

	/**
	 * Get the total capacity of queued minipools in Wei
	 * @returns a Promise<string\> that resolves to a number representing the total capacity of queued minipools in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const totalLength = rp.minipool.getQueueTotalCapacity().then((val: string) => { val };
	 * ```
	 */
	public getQueueTotalCapacity(): Promise<string> {
		return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<string> => {
			return rocketMinipoolQueue.methods.getTotalCapacity().call();
		});
	}

	/**
	 * Get the effective capacity of queued minipools in Wei (used in node demand calculations)
	 * @returns a Promise<string\> that resolves to a number representing the effective capacity of queued minipools in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const queueEffectiveCapacity = rp.minipool.getQueueEffectiveCapacity().then((val: string) => { val };
	 * ```
	 */
	public getQueueEffectiveCapacity(): Promise<string> {
		return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<string> => {
			return rocketMinipoolQueue.methods.getEffectiveCapacity().call();
		});
	}

	/**
	 * Get the capacity of the next available minipool in Wei
	 * @returns a Promise<string\> that resolves to a number representing the capacity of the next available minipool in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const queueNextCapacity = rp.minipool.getQueueNextCapacity().then((val: string) => { val };
	 * ```
	 */
	public getQueueNextCapacity(): Promise<string> {
		return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<string> => {
			return rocketMinipoolQueue.methods.getNextCapacity().call();
		});
	}

	/**
	 * Get the node reward amount for a minipool by node fee, user deposit balance, and staking start & end balances
	 * @params nodeFee a number representing the node fee
	 * @params userBalanceString a string representing the user balance in Wei
	 * @params startBalance a string representing the start balance in Wei
	 * @params endBalance a sttring representing the end balance in Wei
	 * @returns a Promise<string\> that resolves to a string representing the minipool node rewards amount in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const rewardsAmount = rp.minipool.getMinipoolNodeRewardAmount(nodeFee, userDepositBalance, startBalance, endBalance).then((val: string) => { val };
	 * ```
	 */
	public getMinipoolNodeRewardAmount(nodeFee: number, userDepositBalance: string, startBalance: string, endBalance: string): Promise<string> {
		return this.rocketMinipoolStatus.then((rocketMinipoolStatus: Contract): Promise<string> => {
			return rocketMinipoolStatus.methods
				.getMinipoolNodeRewardAmount(this.web3.utils.toWei(nodeFee.toString(), "ether"), userDepositBalance, startBalance, endBalance)
				.call();
		});
	}

	/**
	 * Get a MinipoolContract instance
	 * @params address a string representing the address of the minipool
	 * @returns a Promise<MinipoolContract\> that resolves to a MinipoolContract representing the contract of the minipool
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const minipoolContract = rp.minipool.getMinipoolContract(address).then((val: MinipoolContract) => { val };
	 * ```
	 */
	public getMinipoolContract(address: string): Promise<MinipoolContract> {
		return this.contracts.make("rocketMinipoolDelegate", address).then((rocketMinipool: Contract): MinipoolContract => {
			return new MinipoolContract(this.web3, address, rocketMinipool);
		});
	}

	/**
	 * Get the effective delegate
	 * @params address a string representing the address of the minipool
	 * @returns a Promise<string\> that resolves to the address of the effective delegate
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const effectiveDelegate = rp.minipool.getEffectiveDelegate(address).then((val: string) => { val };
	 * ```
	 */
	public getEffectiveDelegate(address: string): Promise<string> {
		return this.rocketMinipool.then((rocketMinipool: Contract): Promise<string> => {
			return rocketMinipool.methods.getEffectiveDelegate(address).call();
		});
	}

	/**
	 * Submit a minipool as withdrawable
	 * @param minipoolAddress A string representing the address of the minipool
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const minipoolAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const trustedNode = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: trustedNode,
	 *		gas: 1000000
	 * };
	 * const txReceipt = rp.minipool.submitWithdrawable(minipoolAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public submitMinipoolWithdrawable(minipoolAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketMinipoolStatus.then((rocketMinipoolStatus: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketMinipoolStatus.methods.submitMinipoolWithdrawable(minipoolAddress).send(options), onConfirmation);
		});
	}
}

// Exports
export default Minipool;
