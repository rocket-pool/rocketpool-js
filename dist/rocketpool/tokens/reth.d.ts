import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler } from "../../utils/transaction";
import ERC20 from "./erc20";
/**
 * Rocket Pool RETH Token Manager
 */
declare class RETH extends ERC20 {
    /**
     * Create a new rETH instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Get the amount of ETH backing an amount of rETH
     * @params rethAmountWei a string representing the rETH amount in Wei
     * @returns a Promise<string\> that resolves to a string representing the amount amount of rETH backing an amount of ETH
     *
     * @example using Typescript
     * ```ts
     * const rethAmountWei = web3.utils.toWei("1", "ether");
     * const ethValue = rp.tokens.reth.getEthValue(rethAmountWei).then((val: string) => { val };
     * ```
     */
    getEthValue(rethAmountWei: string): Promise<string>;
    /**
     * Get the amount of rETH backing an amount of ETH
     * @params ethAmountWei a string representing the ETH amount in Wei
     * @returns a Promise<string\> that resolves to a string representing the amount amount of rETH backing an amount of ETH
     *
     * @example using Typescript
     * ```ts
     * const ethAmountWei = web3.utils.toWei("1", "ether");
     * const rethValue = rp.tokens.reth.getRethValue(ethAmountWei).then((val: string) => { val };
     * ```
     */
    getRethValue(ethAmountWei: string): Promise<string>;
    /**
     * Get the current ETH to rETH exchange rate
     * @returns a Promise<number\> that resolves to a number representing the amount of ETH backing 1 rETH
     *
     * @example using Typescript
     * ```ts
     * const exchangeRate = rp.tokens.reth.getTotalCollateral().then((val: number) => { val };
     * ```
     */
    getExchangeRate(): Promise<number>;
    /**
     * Get the total amount of ETH collateral available
     * @returns a Promise<string\> that resolves to a string representing the portion of rETH backed by ETH in the contract as a fraction
     *
     * @example using Typescript
     * ```ts
     * const totalCollateral = rp.tokens.reth.getTotalCollateral().then((val: string) => { val };
     * ```
     */
    getTotalCollateral(): Promise<string>;
    /**
     * Get the current ETH collateral rate
     * @returns a Promise<number\> that resolves to a number representing the portion of rETH backed by ETH in the contract as a fraction
     *
     * @example using Typescript
     * ```ts
     * const rate = rp.tokens.reth.getCollateralRate().then((val: number) => { val };
     * ```
     */
    getCollateralRate(): Promise<number>;
    /**
     * Get the total supply
     * @returns a Promise<number\> that resolves to a number representing the total supply
     *
     * @example using Typescript
     * ```ts
     * const supply = rp.tokens.reth.totalSupply().then((val: number) => { val };
     * ```
     */
    getTotalSupply(): Promise<number>;
    /**
     * Burn rETH for ETH
     * @param amountWei A string representing the amount to burn in Wei
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const fromAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const amountWei = web3.utils.toWei("1", "ether");
     * const options = {
     *		from: fromAddress,
     *		gas: 1000000
     * };
     * const txReceipt = rp.tokens.reth.burn(amountWei, options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    burn(amountWei: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
}
export default RETH;
