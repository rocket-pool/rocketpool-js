// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../utils/transaction";

// Node details
export interface NodeDetails {
	address: string;
	exists: boolean;
	timezoneLocation: string;
}

/**
 * Rocket Pool Node Manager
 */
class Node {
	/**
	 * Create a new Node instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeDeposit contract
	 */
	private get rocketNodeDeposit(): Promise<Contract> {
		return this.contracts.get("rocketNodeDeposit");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeManager contract
	 */
	private get rocketNodeManager(): Promise<Contract> {
		return this.contracts.get("rocketNodeManager");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeStaking contract
	 */
	private get rocketNodeStaking(): Promise<Contract> {
		return this.contracts.get("rocketNodeStaking");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketStorage contract
	 */
	private get rocketStorage(): Promise<Contract> {
		return this.contracts.get("rocketStorage");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeDistributor contract
	 */
	private get rocketNodeDistributor(): Promise<Contract> {
		return this.contracts.get("rocketNodeDistributor");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeDistributorDelegate contract
	 */
	private get rocketNodeDistributorDelegate(): Promise<Contract> {
		return this.contracts.get("rocketNodeDistributorDelegate");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeDistributorFactory contract
	 */
	private get rocketNodeDistributorFactory(): Promise<Contract> {
		return this.contracts.get("rocketNodeDistributorFactory");
	}

	/**
	 * Get an array of Node Details
	 * @returns a Promise<NodeDetails[]\> that resolves to an array of NodeDetails
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodes = rp.node.getNodes().then((val: string) => { val };
	 * ```
	 */
	public getNodes(): Promise<NodeDetails[]> {
		return this.getNodeAddresses().then((addresses: string[]): Promise<NodeDetails[]> => {
			return Promise.all(
				addresses.map((address: string): Promise<NodeDetails> => {
					return this.getNodeDetails(address);
				})
			);
		});
	}

	/**
	 * Get an array of node addresses
	 * @returns a Promise<string[]\> that resolves to an array of node addresses
	 *
	 * @example using Typescript
	 * ```ts
	 * const addresses = rp.node.getNodesAddresses().then((val: string[]) => { val };
	 * ```
	 */
	public getNodeAddresses(): Promise<string[]> {
		return this.getNodeCount().then((count: number): Promise<string[]> => {
			return Promise.all(
				[...Array(count).keys()].map((index: number): Promise<string> => {
					return this.getNodeAt(index);
				})
			);
		});
	}

	/**
	 * Get a node's details
	 * @param address A string representing a node address
	 * @returns a Promise<NodeDetails\> that resolves to a NodeDetails object
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeDetail = rp.node.getNodeDetails("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: NodeDetails) => { val }
	 * ```
	 */
	public getNodeDetails(address: string): Promise<NodeDetails> {
		return Promise.all([this.getNodeExists(address), this.getNodeTimezoneLocation(address)]).then(
			([exists, timezoneLocation]: [boolean, string]): NodeDetails => ({
				address,
				exists,
				timezoneLocation,
			})
		);
	}

	/**
	 * Get the total node count
	 * @returns a Promise<number\> that resolves to a number representing the quantity of total nodes
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeCount = rp.node.getNodeCount().then((val: number) => { val };
	 * ```
	 */
	public getNodeCount(): Promise<number> {
		return this.rocketNodeManager
			.then((rocketNodeManager: Contract): Promise<string> => {
				return rocketNodeManager.methods.getNodeCount().call();
			})
			.then((value: string): number => parseInt(value));
	}

	/**
	 * Calculate a nodes average node fee
	 * @returns a Promise<number\> that resolves to a number representing nodes average node fee
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAverageFee = rp.node.getAverageFee().then((val: number) => { val };
	 * ```
	 */
	public getAverageNodeFee(address: string): Promise<string> {
		return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
			return rocketNodeManager.methods.getAverageNodeFee(address).call();
		});
	}

	/**
	 * Get a node address by index
	 * @param index A number representing the index of the node
	 * @returns a Promise<string\> that resolves to a string representing a node address
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = rp.node.getNodeAt(5).then((val: string) => { val };
	 * ```
	 */
	public getNodeAt(index: number): Promise<string> {
		return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
			return rocketNodeManager.methods.getNodeAt(index).call();
		});
	}

	/**
	 * Check whether a node exists
	 * @param address A string representing a node address
	 * @returns a Promise<boolean\> that resolves to a boolean representing whether the node exists or not
	 *
	 * @example using Typescript
	 * ```ts
	 * const exists = rp.node.getNodeExists("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: boolean) => { val };
	 * ```
	 */
	public getNodeExists(address: string): Promise<boolean> {
		return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<boolean> => {
			return rocketNodeManager.methods.getNodeExists(address).call();
		});
	}

	/**
	 * Get a node's timezone location
	 * @param address A string representing a node address
	 * @returns a Promise<string\> that resolves to a string representing the node's timezone
	 *
	 * @example using Typescript
	 * ```ts
	 * const tz = rp.node.getNodeTimezoneLocation("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
	 * ```
	 */
	public getNodeTimezoneLocation(address: string): Promise<string> {
		return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<string> => {
			return rocketNodeManager.methods.getNodeTimezoneLocation(address).call();
		});
	}

	/**
	 * Get a node's withdrawal address
	 * @param address A string representing a node address
	 * @returns a Promise<string\> that resolves to a string representing the node's withdrawal address
	 *
	 * @example using Typescript
	 * ```ts
	 * const withdrawalAddress = rp.node.getNodeWithdrawalAddress("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
	 * ```
	 */
	public getNodeWithdrawalAddress(address: string): Promise<string> {
		return this.rocketStorage.then((rocketStorage: Contract): Promise<string> => {
			return rocketStorage.methods.getNodeWithdrawalAddress(address).call();
		});
	}

	/**
	 * Get a node's RPL stake
	 * @param address A string representing a node address
	 * @returns a Promise<string\> that resolves to a string representing the node's RPL stake
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeRPLStake = rp.node.getNodeRPLStake("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
	 * ```
	 */
	public getNodeRPLStake(address: string): Promise<string> {
		return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
			return rocketNodeStaking.methods.getNodeRPLStake(address).call();
		});
	}

	/**
	 * Get a node's effective RPL stake
	 * @param address A string representing a node address
	 * @returns a Promise<string\> that resolves to a string representing the node's effective RPL stake
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeEffectiveRPLStake = rp.node.getNodeEffectiveRPLStake("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
	 * ```
	 */
	public getNodeEffectiveRPLStake(address: string): Promise<string> {
		return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
			return rocketNodeStaking.methods.getNodeEffectiveRPLStake(address).call();
		});
	}

	/**
	 * Get the node minipool limit
	 * @param address A string representing a node address
	 * @returns a Promise<string\> that resolves to a string representing the node minipool limit
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeMinipoolLimit = rp.node.getNodeMinipoolLimit("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
	 * ```
	 */
	public getNodeMinipoolLimit(address: string): Promise<string> {
		return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
			return rocketNodeStaking.methods.getNodeMinipoolLimit(address).call();
		});
	}

	/**
	 * Get a node's total effective RPL stake
	 * @param address A string representing a node address
	 * @returns a Promise<string\> that resolves to a string representing the node's RPL stake
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeTotalEffectiveRPLStake = rp.node.getNodeTotalEffectiveRPLStake("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
	 * ```
	 */
	public getNodeTotalEffectiveRPLStake(): Promise<string> {
		return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
			return rocketNodeStaking.methods.getTotalEffectiveRPLStake().call();
		});
	}

	/**
	 * Get a node's minimum RPL stake
	 * @param address A string representing a node address
	 * @returns a Promise<string\> that resolves to a string representing the node's minimum RPL stake
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeRPLStake = rp.node.getNodeRPLStake("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
	 * ```
	 */
	public getNodeMinimumRPLStake(address: string): Promise<string> {
		return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
			return rocketNodeStaking.methods.getNodeMinimumRPLStake(address).call();
		});
	}

	/**
	 * Get a node's pending withdrawal address
	 * @param address A string representing a node address
	 * @returns a Promise<string\> that resolves to a string representing the node's pending withdrawal address
	 *
	 * @example using Typescript
	 * ```ts
	 * const pendingWithdrawalAddress = rp.node.getNodePendingWithdrawalAddress("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
	 * ```
	 */
	public getNodePendingWithdrawalAddress(address: string): Promise<string> {
		return this.rocketStorage.then((rocketStorage: Contract): Promise<string> => {
			return rocketStorage.methods.getNodePendingWithdrawalAddress(address).call();
		});
	}

	/**
	 * Get the total effective RPL stake
	 * @returns a Promise<string\> that resolves to a string representing the total effective rpl stake
	 *
	 * @example using Typescript
	 * ```ts
	 * const totalEffectiveRPLStake = rp.node.getTotalEffectiveRPLStake().then((val: string) => { val };
	 * ```
	 */
	public getTotalEffectiveRPLStake(): Promise<string> {
		return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
			return rocketNodeStaking.methods.getTotalEffectiveRPLStake().call();
		});
	}

	/**
	 * Get the total RPL stake
	 * @returns a Promise<string\> that resolves to a string representing the total rpl stake
	 *
	 * @example using Typescript
	 * ```ts
	 * const totalRPLStake = rp.node.getTotalRPLStake().then((val: string) => { val };
	 * ```
	 */
	public getTotalRPLStake(): Promise<string> {
		return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
			return rocketNodeStaking.methods.getTotalRPLStake().call();
		});
	}

	/**
	 * Check if the node has their fee distributor initialised
	 * @returns a Promise<bool\> that resolves to a boolean representing if the node has its fee distributor initialised
	 *
	 * @example using Typescript
	 * ```ts
	 * const feeDistributorInitialised = rp.node.getFeeDistributorInitialised().then((val: string) => { val };
	 * ```
	 */
	public getFeeDistributorInitialised(): Promise<boolean> {
		return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<boolean> => {
			return rocketNodeManager.methods.getFeeDistributorInitialised().call();
		});
	}

	/**
	 * Get the proxy address for the node distributor
	 * @returns a Promise<string\> that resolves to a boolean representing if the node has its fee distributor initialised
	 *
	 * @example using Typescript
	 * ```ts
	 * const feeDistributorInitialised = rp.node.getFeeDistributorInitialised().then((val: string) => { val };
	 * ```
	 */
	public getNodeDistributorProxyAddress(address: string): Promise<string> {
		return this.rocketNodeDistributorFactory.then((rocketNodeDistributorFactory: Contract): Promise<string> => {
			return rocketNodeDistributorFactory.methods.getProxyAddress(address).call();
		});
	}

	/**
	 * Calculate the total effective RPL stake provided inputs
	 * @params offset a number representing the offset
	 * @params limit a number representing the limit
	 * @params rplPrice a string representing the rplPrice
	 * @returns a Promise<string\> that resolves to a string representing the calculated RPL stake given inputs
	 *
	 * @example using Typescript
	 * ```ts
	 * const calculatedTotalEffectiveRPLStake = rp.node.calculateTotalEffectiveRPLStake(offset, limit, rplPrice).then((val: string) => { val };
	 * ```
	 */
	public calculateTotalEffectiveRPLStake(offset: number, limit: number, rplPrice: string): Promise<string> {
		return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<string> => {
			return rocketNodeStaking.methods.calculateTotalEffectiveRPLStake(offset, limit, rplPrice).call();
		});
	}

	/**
	 * Get a breakdown of the number of nodes per timezone
	 * @params offset a number representing the offset
	 * @params limit a number representing the limit
	 * @returns a Promise<object\> that resolves to an object node counts per timezone
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeCountPerTimezone = rp.node.getNodeCountPerTimezone(offset, limit).then((val: object) => { val };
	 * ```
	 */
	public getNodeCountPerTimezone(offset: number, limit: number): Promise<object> {
		return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<object> => {
			return rocketNodeManager.methods.getNodeCountPerTimezone(offset, limit).call();
		});
	}

	/**
	 * Get the deposit type
	 * @params amount a number representing the deposit amount
	 * @returns a Promise<number\> that resolves to a number representing the minipool deposit enum value type
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeCountPerTimezone = rp.node.getNodeCountPerTimezone(offset, limit).then((val: object) => { val };
	 * ```
	 */
	public getDepositType(amount: string): Promise<number> {
		return this.rocketNodeDeposit.then((rocketNodeDeposit: Contract): Promise<number> => {
			return rocketNodeDeposit.methods.getDepositType(amount).call();
		});
	}

	/**
	 * Initialise fee distributor
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 * 		from: nodeAddress,
	 * 		gas: 1000000
	 * }
	 * const txReceipt = rp.node.initaliseFeeDistributor(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public initialiseFeeDistributor(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketNodeManager.methods.initialiseFeeDistributor().send(options), onConfirmation);
		});
	}

	/**
	 * Register a node
	 * @param timezoneLocation A string representing the timezone location
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const timezoneLocation = "Australia/Brisbane";
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.node.registerNode(timezoneLocation, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public registerNode(timezoneLocation: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketNodeManager.methods.registerNode(timezoneLocation).send(options), onConfirmation);
		});
	}

	/**
	 * Set a node's withdrawal address
	 * @param nodeAddress A string representing the node's address
	 * @param withdrawalAddress A string representing the withdrawalAddress
	 * @param confirm A boolean representing as to whether you which to auto confirm, true will auto confirm (negating the
	 * need to prove your ownership of the withdrawal address), false will set the withdrawal address to pending and will
	 * require an additional transaction (see confirmWithdrawalAddress) signed by the withdrawalAddress to prove ownership.
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const withdrawalAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
	 * const confirm = false; // will set the withdrawalAddress to pending
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.node.setWithdrawalAddress(nodeAddress, withdrawalAddress, confirm, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public setWithdrawalAddress(
		nodeAddress: string,
		withdrawalAddress: string,
		confirm: boolean,
		options?: SendOptions,
		onConfirmation?: ConfirmationHandler
	): Promise<TransactionReceipt> {
		return this.rocketStorage.then((rocketStorage: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketStorage.methods.setWithdrawalAddress(nodeAddress, withdrawalAddress, confirm).send(options), onConfirmation);
		});
	}

	/**
	 * Stake RPL for a node address
	 * @param amount A string representing the amount in Wei
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const amount = web3.utils.toWei("5000", "ether");
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.node.stakeRPL(nodeAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public stakeRPL(amount: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketNodeStaking.methods.stakeRPL(amount).send(options), onConfirmation);
		});
	}

	/**
	 * Confirm a  node's withdrawal address
	 * @param nodeAddress A string representing the node's address
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const withdrawalAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
	 * const options = {
	 *		from: withdrawalAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.node.confirmWithdrawalAddress(nodeAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public confirmWithdrawalAddress(nodeAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketStorage.then((rocketStorage: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketStorage.methods.confirmWithdrawalAddress(nodeAddress).send(options), onConfirmation);
		});
	}

	/**
	 * Withdraw RPL for a node address
	 * @param amount A string representing the amount in Wei
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const amount = web3.utils.toWei("5000", "ether");
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.node.withdrawRPL(nodeAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public withdrawRPL(amount: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketNodeStaking.then((rocketNodeStaking: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketNodeStaking.methods.withdrawRPL(amount).send(options), onConfirmation);
		});
	}

	/**
	 * Set the node's timezone location
	 * @param timezoneLocation A string representing the timezone location
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const timezoneLocation = "Brisbane/Australia";
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.node.setTimezoneLocation(nodeAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public setTimezoneLocation(timezoneLocation: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketNodeManager.then((rocketNodeManager: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketNodeManager.methods.setTimezoneLocation(timezoneLocation).send(options), onConfirmation);
		});
	}

	/**
	 * Make a node deposit
	 * @param minimumNodeFee A string representing the minimumNodeFee in Wei
	 * @param validatorPubKey A buffer representing the validator pub key
	 * @param validatorSignature A buffer representing the validator signature
	 * @param depositDataRoot A buffer representing the deposit data root
	 * @param salt A number representing the salt
	 * @param expectedMinipoolAddress A string representing the expected minipool address
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const minimumNodeFee = web3.utils.toWei("0", "ether");
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.node.deposit(minimumNodeFee, depositData.pubkey, depositData.signature, depositDataRoot, salt, minipoolAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public deposit(
		minimumNodeFee: string,
		validatorPubKey: Buffer,
		validatorSignature: Buffer,
		depositDataRoot: Buffer,
		salt: number,
		expectedMinipoolAddress: string,
		options?: SendOptions,
		onConfirmation?: ConfirmationHandler
	): Promise<TransactionReceipt> {
		return this.rocketNodeDeposit.then((rocketNodeDeposit: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(
				rocketNodeDeposit.methods.deposit(minimumNodeFee, validatorPubKey, validatorSignature, depositDataRoot, salt, expectedMinipoolAddress).send(options),
				onConfirmation
			);
		});
	}
}

// Exports
export default Node;
