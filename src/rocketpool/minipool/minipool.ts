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

	// Contract accessors
	private get rocketMinipoolManager(): Promise<Contract> {
		return this.contracts.get("rocketMinipoolManager");
	}

	private get rocketMinipoolQueue(): Promise<Contract> {
		return this.contracts.get("rocketMinipoolQueue");
	}

	private get rocketMinipoolStatus(): Promise<Contract> {
		return this.contracts.get("rocketMinipoolStatus");
	}

	private get rocketMinipool(): Promise<Contract> {
		return this.contracts.get("rocketMinipool");
	}

	/**
	 * Getters
	 */
	// Get all minipool details
	public getMinipools(): Promise<MinipoolDetails[]> {
		return this.getMinipoolAddresses().then((addresses: string[]): Promise<MinipoolDetails[]> => {
			return Promise.all(
				addresses.map((address: string): Promise<MinipoolDetails> => {
					return this.getMinipoolDetails(address);
				})
			);
		});
	}

	// Get all minipool addresses
	public getMinipoolAddresses(): Promise<string[]> {
		return this.getMinipoolCount().then((count: number): Promise<string[]> => {
			return Promise.all(
				[...Array(count).keys()].map((index: number): Promise<string> => {
					return this.getMinipoolAt(index);
				})
			);
		});
	}

	// Get a node's minipool details
	public getNodeMinipools(nodeAddress: string): Promise<MinipoolDetails[]> {
		return this.getNodeMinipoolAddresses(nodeAddress).then((addresses: string[]): Promise<MinipoolDetails[]> => {
			return Promise.all(
				addresses.map((address: string): Promise<MinipoolDetails> => {
					return this.getMinipoolDetails(address);
				})
			);
		});
	}

	// Get a node's minipool addresses
	public getNodeMinipoolAddresses(nodeAddress: string): Promise<string[]> {
		return this.getNodeMinipoolCount(nodeAddress).then((count: number): Promise<string[]> => {
			return Promise.all(
				[...Array(count).keys()].map((index: number): Promise<string> => {
					return this.getNodeMinipoolAt(nodeAddress, index);
				})
			);
		});
	}

	// Get a minipool's details
	public getMinipoolDetails(address: string): Promise<MinipoolDetails> {
		return Promise.all([this.getMinipoolExists(address), this.getMinipoolPubkey(address)]).then(
			([exists, pubkey]: [boolean, string]): MinipoolDetails => ({
				address,
				exists,
				pubkey,
			})
		);
	}

	// Get the total minipool count
	public getMinipoolCount(): Promise<number> {
		return this.rocketMinipoolManager
			.then((rocketMinipoolManager: Contract): Promise<string> => {
				return rocketMinipoolManager.methods.getMinipoolCount().call();
			})
			.then((value: string): number => parseInt(value));
	}

	// Get a minipool address by index
	public getMinipoolAt(index: number): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getMinipoolAt(index).call();
		});
	}

	// Get a node's total minipool count
	public getNodeMinipoolCount(nodeAddress: string): Promise<number> {
		return this.rocketMinipoolManager
			.then((rocketMinipoolManager: Contract): Promise<string> => {
				return rocketMinipoolManager.methods.getNodeMinipoolCount(nodeAddress).call();
			})
			.then((value: string): number => parseInt(value));
	}

	// Get the staking minipool count
	public getStakingMinipoolCount(): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getStakingMinipoolCount().call();
		});
	}

	// Get the total staking minipool count
	public getNodeStakingMinipoolCount(nodeAddress: string): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getNodeStakingMinipoolCount(nodeAddress).call();
		});
	}

	// Get the node active minipool count
	public getNodeActiveMinipoolCount(nodeAddress: string): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getNodeActiveMinipoolCount(nodeAddress).call();
		});
	}

	// Get a node's minipool address by index
	public getNodeMinipoolAt(nodeAddress: string, index: number): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getNodeMinipoolAt(nodeAddress, index).call();
		});
	}

	// Get a minipool address by validator pubkey
	public getMinipoolByPubkey(validatorPubkey: string): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getMinipoolByPubkey(validatorPubkey).call();
		});
	}

	// Check whether a minipool exists
	public getMinipoolExists(address: string): Promise<boolean> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<boolean> => {
			return rocketMinipoolManager.methods.getMinipoolExists(address).call();
		});
	}

	// Get a minipool's validator pubkey
	public getMinipoolPubkey(address: string): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getMinipoolPubkey(address).call();
		});
	}

	// Get a minipools withdrawal credentials
	public getMinipoolWithdrawalCredentials(address: string): Promise<string> {
		return this.rocketMinipoolManager.then((rocketMinipoolManager: Contract): Promise<string> => {
			return rocketMinipoolManager.methods.getMinipoolWithdrawalCredentials(address).call();
		});
	}

	// Get the minipool queue length
	public getQueueLength(depositType: number): Promise<number> {
		return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<number> => {
			return rocketMinipoolQueue.methods.getLength(depositType).call();
		});
	}

	// Get the total minipool queue length
	public getQueueTotalLength(): Promise<number> {
		return this.rocketMinipoolQueue
			.then((rocketMinipoolQueue: Contract): Promise<string> => {
				return rocketMinipoolQueue.methods.getTotalLength().call();
			})
			.then((value: string): number => parseInt(value));
	}

	// Get the total capacity of queued minipools in wei
	public getQueueTotalCapacity(): Promise<string> {
		return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<string> => {
			return rocketMinipoolQueue.methods.getTotalCapacity().call();
		});
	}

	// Get the effective capacity of queued minipools in wei (used in node demand calculations)
	public getQueueEffectiveCapacity(): Promise<string> {
		return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<string> => {
			return rocketMinipoolQueue.methods.getEffectiveCapacity().call();
		});
	}

	// Get the capacity of the next available minipool in wei
	public getQueueNextCapacity(): Promise<string> {
		return this.rocketMinipoolQueue.then((rocketMinipoolQueue: Contract): Promise<string> => {
			return rocketMinipoolQueue.methods.getNextCapacity().call();
		});
	}

	// Get the node reward amount for a minipool by node fee, user deposit balance, and staking start & end balances
	public getMinipoolNodeRewardAmount(nodeFee: number, userDepositBalance: string, startBalance: string, endBalance: string): Promise<string> {
		return this.rocketMinipoolStatus.then((rocketMinipoolStatus: Contract): Promise<string> => {
			return rocketMinipoolStatus.methods
				.getMinipoolNodeRewardAmount(this.web3.utils.toWei(nodeFee.toString(), "ether"), userDepositBalance, startBalance, endBalance)
				.call();
		});
	}

	// Get a MinipoolContract instance
	public getMinipoolContract(address: string): Promise<MinipoolContract> {
		return this.contracts.make("rocketMinipoolDelegate", address).then((rocketMinipool: Contract): MinipoolContract => {
			return new MinipoolContract(this.web3, address, rocketMinipool);
		});
	}

	// Get Effective Delegate
	public getEffectiveDelegate(address: string): Promise<string> {
		return this.rocketMinipool.then((rocketMinipool: Contract): Promise<string> => {
			return rocketMinipool.methods.getEffectiveDelegate(address).call();
		});
	}

	/**
	 * Mutators - Restricted to trusted nodes
	 */
	// Submit a minipool withdrawable event
	public submitMinipoolWithdrawable(minipoolAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketMinipoolStatus.then((rocketMinipoolStatus: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketMinipoolStatus.methods.submitMinipoolWithdrawable(minipoolAddress).send(options), onConfirmation);
		});
	}
}

// Exports
export default Minipool;
