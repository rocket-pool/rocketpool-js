// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../utils/transaction";

/**
 * Rocket Pool Deposit Pool Manager
 */
class Deposit {
	/**
	 * Create a new Deposit instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketDepositPool contract
	 */
	private get rocketDepositPool(): Promise<Contract> {
		return this.contracts.get("rocketDepositPool");
	}

	/**
	 * Get the current deposit pool balance in Wei
	 * @returns a Promise<string> that resolves to a string representing the current deposit pool balance in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const balanceInWei = rp.deposit.getBalance().then((val: string) => { val };
	 * // convert to Ether if needed
	 * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
	 * ```
	 */
	public getBalance(): Promise<string> {
		return this.rocketDepositPool.then((rocketDepositPool: Contract): Promise<string> => {
			return rocketDepositPool.methods.getBalance().call();
		});
	}

	/**
	 * Get the excess balance in Wei
	 * @returns a Promise<string> that resolves to a string representing the current excess balance in Wei
	 *
	 * @example using Typescript
	 * ```ts
	 * const balanceInWei = rp.deposit.getExcessBalance().then((val: string) => { val };
	 * // convert to Ether if needed
	 * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
	 * ```
	 */
	public getExcessBalance(): Promise<string> {
		return this.rocketDepositPool.then((rocketDepositPool: Contract): Promise<string> => {
			return rocketDepositPool.methods.getExcessBalance().call();
		});
	}

	/**
	 * Get the block of the last user deposit
	 * @returns a Promise<number> that resolves to a number representing the block of the last user deposit
	 *
	 * @example using Typescript
	 * ```ts
	 * const block = rp.deposit.getUserLastDepositBlock().then((val: number) => { val };
	 * ```
	 */
	public getUserLastDepositBlock(address: string): Promise<number> {
		return this.rocketDepositPool.then((rocketDepositPool: Contract): Promise<number> => {
			return rocketDepositPool.methods.getUserLastDepositBlock(address).call();
		});
	}

	/**
	 * Make a deposit
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *	  value: web3.utils.toWei("10", "ether"),
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.deposit.deposit(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public deposit(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDepositPool.then((rocketDepositPool: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDepositPool.methods.deposit().send(options), onConfirmation);
		});
	}

	/**
	 * Assign Deposits
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: nodeAddress,
	 *		gas: 1000000
	 * }
	 * const txReceipt = rp.deposit.assignDeposits(options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public assignDeposits(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDepositPool.then((rocketDepositPool: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDepositPool.methods.assignDeposits().send(options), onConfirmation);
		});
	}
}

// Exports
export default Deposit;
