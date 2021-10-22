// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import { ConfirmationHandler, handleConfirmations } from "../../utils/transaction";

// Detail types
export interface StatusDetails {
	status: number;
	block: number;
	time: Date;
}

export interface NodeDetails {
	address: string;
	fee: number;
	depositBalance: string;
	refundBalance: string;
	depositAssigned: boolean;
}

export interface UserDetails {
	depositBalance: string;
	depositAssigned: boolean;
	depositAssignedTime: Date;
}

export interface StakingDetails {
	startBalance: string;
	endBalance: string;
}

/**
 * Rocket Pool Minipool Contract Instance Wrapper
 */
class MinipoolContract {
	/**
	 * Create a new Minipool Contract instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, public readonly address: string, public readonly contract: Contract) {}

	/**
	 * Get status details
	 * @returns a Promise<StatusDetails> that resolves to a StatusDetails object (status, block, time)
	 *
	 * @example using Typescript
	 * ```ts
	 * const statusDetails = minipool.getStatusDetails().then((val: StatusDetails) => { val };
	 * ```
	 */
	public getStatusDetails(): Promise<StatusDetails> {
		return Promise.all([this.getStatus(), this.getStatusBlock(), this.getStatusTime()]).then(
			([status, block, time]: [number, number, Date]): StatusDetails => ({
				status,
				block,
				time,
			})
		);
	}

	/**
	 * Get status of a minipool
	 * @returns a Promise<number> that resolves to a number representing the minipool status
	 *
	 * @example using Typescript
	 * ```ts
	 * const status = minipool.getStatus().then((val: number) => { val };
	 * ```
	 */
	public getStatus(): Promise<number> {
		return this.contract.methods.getStatus().call();
	}

	/**
	 * Get status block of a minipool
	 * @returns a Promise<number> that resolves to a number representing the status block of a minipool
	 *
	 * @example using Typescript
	 * ```ts
	 * const statusBlock = minipool.getStatusBlock().then((val: number) => { val };
	 * ```
	 */
	public getStatusBlock(): Promise<number> {
		return this.contract.methods
			.getStatusBlock()
			.call()
			.then((value: string): number => parseInt(value));
	}

	/**
	 * Get status timestamp of a minipool
	 * @returns a Promise<Date> that resolves to a Date representing the timestamp a minipool status
	 *
	 * @example using Typescript
	 * ```ts
	 * const statusTime = minipool.getStatusBlock().then((val: Date) => { val };
	 * ```
	 */
	public getStatusTime(): Promise<Date> {
		return this.contract.methods
			.getStatusTime()
			.call()
			.then((value: string): Date => new Date(parseInt(value) * 1000));
	}

	/**
	 * Get the deposit type
	 * @returns a Promise<number> that resolves to a number representing the deposit type
	 *
	 * @example using Typescript
	 * ```ts
	 * const depositType = minipool.getDepositType().then((val: number) => { val };
	 * ```
	 */
	public getDepositType(): Promise<number> {
		return this.contract.methods.getDepositType().call();
	}

	/**
	 * Get the node details of a minipool
	 * @returns a Promise<NodeDetails> that resolves to a NodeDetails object representing details about the minipool's nodes
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeDetails = minipool.getNodeDetails().then((val: NodeDetails) => { val };
	 * ```
	 */
	public getNodeDetails(): Promise<NodeDetails> {
		return Promise.all([
			this.getNodeAddress(),
			this.getNodeFee(),
			this.getNodeDepositBalance(),
			this.getNodeRefundBalance(),
			this.getNodeDepositAssigned(),
		]).then(
			([address, fee, depositBalance, refundBalance, depositAssigned]: [string, number, string, string, boolean]): NodeDetails => ({
				address,
				fee,
				depositBalance,
				refundBalance,
				depositAssigned,
			})
		);
	}

	/**
	 * Get the node address of a minipool
	 * @returns a Promise<string> that resolves to a string representing the node address of the minipool
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = minipool.getNodeAddress().then((val: string) => { val };
	 * ```
	 */
	public getNodeAddress(): Promise<string> {
		return this.contract.methods.getNodeAddress().call();
	}

	/**
	 * Get the node fee of a minipool
	 * @returns a Promise<number> that resolves to a number representing the node fee of the minipool
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeFee = minipool.getNodeFee().then((val: number) => { val };
	 * ```
	 */
	public getNodeFee(): Promise<number> {
		return this.contract.methods.getNodeFee().call();
	}

	/**
	 * Get the node deposit balance of a minipool
	 * @returns a Promise<string> that resolves to a string representing the node deposit balance of a minipool in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeBalanceDeposit = minipool.getNodeDepositBalance().then((val: string) => { val };
	 * ```
	 */
	public getNodeDepositBalance(): Promise<string> {
		return this.contract.methods.getNodeDepositBalance().call();
	}

	/**
	 * Get the node refund balance of a minipool
	 * @returns a Promise<string> that resolves to a string representing the node refund balance of a minipool in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeRefundDeposit = minipool.getNodeRefundBalance().then((val: string) => { val };
	 * ```
	 */
	public getNodeRefundBalance(): Promise<string> {
		return this.contract.methods.getNodeRefundBalance().call();
	}

	/**
	 * Get if a node deposit has been assigned for a minipool
	 * @returns a Promise<boolean> that resolves to a boolean representing if a node deposit has been assigned for a minipool
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeDepositAssigned = minipool.getNodeDepositAssigned().then((val: boolean) => { val };
	 * ```
	 */
	public getNodeDepositAssigned(): Promise<boolean> {
		return this.contract.methods.getNodeDepositAssigned().call();
	}

	/**
	 * Get if a minipool has had scrub votes
	 * @returns a Promise<boolean> that resolves to a boolean representing if a minipool has had scrub votes
	 *
	 * @example using Typescript
	 * ```ts
	 * const scrubVoted = minipool.getScrubVoted().then((val: boolean) => { val };
	 * ```
	 */
	public getScrubVoted(): Promise<boolean> {
		return this.contract.methods.getScrubVoted().call();
	}

	/**
	 * Get the total scrub votes for a minipool
	 * @returns a Promise<number> that resolves to a number representing the total number of scrub votes a minipool has
	 *
	 * @example using Typescript
	 * ```ts
	 * const totalScrubVotes = minipool.getTotalScrubVotes().then((val: number) => { val };
	 * ```
	 */
	public getTotalScrubVotes(): Promise<number> {
		return this.contract.methods.getNodeFee().call();
	}

	/**
	 * Get user deposit details
	 * @returns a Promise<UserDetails> that resolves to a UserDetails object representing the user details (depositBalance, depositAssigned, depositAssignedTime) for a minipool
	 *
	 * @example using Typescript
	 * ```ts
	 * const userDetails = minipool.getUserDetails().then((val: UserDetails) => { val };
	 * ```
	 */
	public getUserDetails(): Promise<UserDetails> {
		return Promise.all([this.getUserDepositBalance(), this.getUserDepositAssigned(), this.getUserDepositAssignedTime()]).then(
			([depositBalance, depositAssigned, depositAssignedTime]: [string, boolean, Date]): UserDetails => ({
				depositBalance,
				depositAssigned,
				depositAssignedTime,
			})
		);
	}

	/**
	 * Get user deposit balance
	 * @returns a Promise<string> that resolves to a string representing the user deposit balance for a minipool in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const userDepositBalance = minipool.getUserDepositBalance().then((val: string) => { val };
	 * ```
	 */
	public getUserDepositBalance(): Promise<string> {
		return this.contract.methods.getUserDepositBalance().call();
	}

	/**
	 * Get user deposit assigned
	 * @returns a Promise<boolean> that resolves to a boolean representing if the user deposit has been assigned
	 *
	 * @example using Typescript
	 * ```ts
	 * const userDepositAssigned = minipool.getUserDepositAssigned().then((val: boolean) => { val };
	 * ```
	 */
	public getUserDepositAssigned(): Promise<boolean> {
		return this.contract.methods.getUserDepositAssigned().call();
	}

	/**
	 * Get a timestamp for when the user deposit was assigned for the minipool
	 * @returns a Promise<Date> that resolves to a Date representing the timestamp the user deposit was assigned for the minipool
	 *
	 * @example using Typescript
	 * ```ts
	 * const userDepositAssignedTime = minipool.getUserDepositAssignedTime().then((val: boolean) => { val };
	 * ```
	 */
	public getUserDepositAssignedTime(): Promise<Date> {
		return this.contract.methods
			.getUserDepositAssignedTime()
			.call()
			.then((value: string): Date => new Date(parseInt(value) * 1000));
	}

	/**
	 * Get a staking details for a minipool
	 * @returns a Promise<StakingDetails> that resolves to a StakingDetails object representing staking details (start & end balance) for a minipool
	 *
	 * @example using Typescript
	 * ```ts
	 * const stakingDetails = minipool.getStakingDetails().then((val: StakingDetails) => { val };
	 * ```
	 */
	public getStakingDetails(): Promise<StakingDetails> {
		return Promise.all([this.getStakingStartBalance(), this.getStakingEndBalance()]).then(
			([startBalance, endBalance]: [string, string]): StakingDetails => ({
				startBalance,
				endBalance,
			})
		);
	}

	/**
	 * Get a staking start balance for a minipool
	 * @returns a Promise<string> that resolves to a string representing the staking start balance for a minipool
	 *
	 * @example using Typescript
	 * ```ts
	 * const stakingStartBalance = minipool.getStakingStartBalance().then((val: string) => { val };
	 * ```
	 */
	public getStakingStartBalance(): Promise<string> {
		return this.contract.methods.getStakingStartBalance().call();
	}

	/**
	 * Get a staking end balance for a minipool
	 * @returns a Promise<string> that resolves to a string representing the staking end balance for a minipool
	 *
	 * @example using Typescript
	 * ```ts
	 * const stakingEndBalance = minipool.getStakingEndBalance().then((val: string) => { val };
	 * ```
	 */
	public getStakingEndBalance(): Promise<string> {
		return this.contract.methods.getStakingEndBalance().call();
	}

	/**
	 * Get a minipool's withdrawal credentials
	 * @returns a Promise<string> that resolves to a string representing the minipool's withdrawal credentials
	 *
	 * @example using Typescript
	 * ```ts
	 * const withdrawalCredentials = minipool.getWithdrawalCredentials().then((val: string) => { val };
	 * ```
	 */
	public getWithdrawalCredentials(): Promise<string> {
		return this.contract.methods.getWithdrawalCredentials().call();
	}

	/**
	 * Check if a minipool's node is withdrawn
	 * @returns a Promise<boolean> that resolves to a boolean representing if the minipool's node is withdrawn
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeWithdrawn = minipool.getNodeWithdrawn().then((val: boolean) => { val };
	 * ```
	 */
	public getNodeWithdrawn(): Promise<boolean> {
		return this.contract.methods.getNodeWithdrawn().call();
	}

	/**
	 * Dissolve the minipool
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const node = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: node,
	 *		gas: 1000000
	 * };
	 * const txReceipt = minipool.dissolve(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public dissolve(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return handleConfirmations(this.contract.methods.dissolve().send(options), onConfirmation);
	}

	/**
	 * Slash the minipool
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const node = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: node,
	 *		gas: 1000000
	 * };
	 * const txReceipt = minipool.slash(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public slash(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return handleConfirmations(this.contract.methods.slash().send(options), onConfirmation);
	}

	/**
	 * Refund node ETH refinanced from user deposited ETH
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
	 * const options = {
	 *		from: owner,
	 *		gas: 1000000
	 * };
	 * const txReceipt = minipool.refund(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public refund(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return handleConfirmations(this.contract.methods.refund().send(options), onConfirmation);
	}

	/**
	 * Progress the minipool to staking, sending its ETH deposit to the VRC
	 * Only accepts calls from the minipool owner (node) while in prelaunch and once scrub period has ended
	 * @param validatorPubkey A buffer
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const validatorPubkey = <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 03>;
	 * const validatorSignature = <Buffer 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23>;
	 * const depositDataRoot = <Buffer 48 ad 0b 82 2c d6 81 f9 c9 8b 06 a1 8b 93 4b df 7f 40 76 80 fb 7a 3b 5c cd 2c 92 a6 4a 58 e9 05>;
	 * const owner = "0x8B0EF9f1932A2e44c3D27bE4C70C3BC07A6A27B3"; // must be the owner of the minipool
	 * const options = {
	 *		from: owner,
	 *		gas: 1000000
	 * };
	 * const txReceipt = minipool.stake(validatorPubkey, validatorSignature, depositDataRoot, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public stake(
		validatorPubkey: Buffer,
		validatorSignature: Buffer,
		depositDataRoot: Buffer,
		options?: SendOptions,
		onConfirmation?: ConfirmationHandler
	): Promise<TransactionReceipt> {
		return handleConfirmations(this.contract.methods.stake(validatorPubkey, validatorSignature, depositDataRoot).send(options), onConfirmation);
	}

	/**
	 * Finalise and unlock their RPL stake
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
	 * const options = {
	 *		from: owner,
	 *		gas: 1000000
	 * };
	 * const txReceipt = minipool.finalise(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public finalise(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return handleConfirmations(this.contract.methods.finalise().send(options), onConfirmation);
	}

	/**
	 * Withdraw node balances & rewards from the minipool and close it
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
	 * const options = {
	 *		from: owner,
	 *		gas: 1000000
	 * };
	 * const txReceipt = minipool.withdraw(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public withdraw(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return handleConfirmations(this.contract.methods.withdraw().send(options), onConfirmation);
	}

	/**
	 * Distributes the contract's balance and finalises the pool
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
	 * const options = {
	 *		from: owner,
	 *		gas: 1000000
	 * };
	 * const txReceipt = minipool.distributeBalanceAndFinalise(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public distributeBalanceAndFinalise(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return handleConfirmations(this.contract.methods.distributeBalanceAndFinalise().send(options), onConfirmation);
	}

	/**
	 * Distributes the contract's balance
	 * When called during staking status, requires 16 ether in the pool
	 * When called by non-owner with less than 16 ether, requires 14 days to have passed since being made withdrawable
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
	 * const options = {
	 *		from: owner,
	 *		gas: 1000000
	 * };
	 * const txReceipt = minipool.distributeBalance(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public distributeBalance(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return handleConfirmations(this.contract.methods.distributeBalance().send(options), onConfirmation);
	}

	/**
	 * Mark a minipool as scrub, we don't want no scrubs
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const daoMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // can only be called by a DAO member
	 * const options = {
	 *		from: daoMember,
	 *		gas: 1000000
	 * };
	 * const txReceipt = minipool.finalise(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public voteScrub(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return handleConfirmations(this.contract.methods.voteScrub().send(options), onConfirmation);
	}

	/**
	 * Withdraw node balances from the minipool and close it
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
	 * const options = {
	 *		from: owner,
	 *		gas: 1000000
	 * };
	 * const txReceipt = minipool.close(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public close(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return handleConfirmations(this.contract.methods.close().send(options), onConfirmation);
	}
}

// Exports
export default MinipoolContract;
