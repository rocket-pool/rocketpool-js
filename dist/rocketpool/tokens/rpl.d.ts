import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler } from "../../utils/transaction";
import ERC20 from "./erc20";
/**
 * Rocket Pool RPL Token Manager
 */
declare class RPL extends ERC20 {
    /**
     * Create a new RPL instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Get the contract address
     * @returns a Promise<string\> that resolves to a string representing the contract address of the token
     *
     * @example using Typescript
     * ```ts
     * const address = rp.tokens.rpl.getAddress().then((val: string) => { val };
     * ```
     */
    getAddress(): Promise<string>;
    /**
     * Get the inflation intervals that have passed
     * @returns a Promise<number\> that resolves to a number representing the inflation intervals that have passed (in time)
     *
     * @example using Typescript
     * ```ts
     * const address = rp.tokens.rpl.getInflationIntervalsPassed().then((val: number) => { val };
     * ```
     */
    getInflationIntervalsPassed(): Promise<number>;
    /**
     * Get the total supply
     * @returns a Promise<number\> that resolves to a number representing the total supply
     *
     * @example using Typescript
     * ```ts
     * const address = rp.tokens.rpl.totalSupply().then((val: number) => { val };
     * ```
     */
    totalSupply(): Promise<number>;
    /**
     * Swap current RPL fixed supply tokens for new RPL
     * @param amountWei A string representing the amount to swap in Wei
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const toAddress = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
     * const amountWei = web3.utils.toWei("20", "ether");
     * const options = {
     *		from: fromAddress,
     *		gas: 1000000
     * };
     * const txReceipt = rp.tokens.rpl.swapTokens(amountWei, options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    swapTokens(amountWei: any, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Inflation mint tokens
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const toAddress = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
     * const options = {
     *		from: toAddress,
     *		gas: 1000000
     * };
     * const txReceipt = rp.tokens.rpl.inflationMintTokens(options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    inflationMintTokens(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
}
export default RPL;
