import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler } from "../../utils/transaction";
/**
 * ERC20 Token Contract
 */
declare abstract class ERC20 {
    protected web3: Web3;
    protected contracts: Contracts;
    protected tokenContractName: string;
    /**
     * Create a new ERC20 instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     * @param tokenContractName A string representing the Token Contract Name
     */
    constructor(web3: Web3, contracts: Contracts, tokenContractName: string);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the contract passed into the constructor
     */
    protected get tokenContract(): Promise<Contract>;
    /**
     * Return the token balance of an account
     * @param account A string representing the address you wish to lookup the balance for
     * @returns a Promise<string\> that resolves to a string representing the token balance in Wei
     *
     * @example using Typescript
     * const account = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * ```ts
     * const balance = rp.tokens.rpl.balanceOf(account).then((val: string) => { val };
     * ```
     */
    balanceOf(account: string): Promise<string>;
    /**
     * Return the token allowance for an account
     * @param account A string representing the address you wish to lookup the balance for
     * @param spender A string representing the spender address (usually a token contract)
     * @returns a Promise<string\> that resolves to a string representing the token balance in Wei
     *
     * @example using Typescript
     * const account = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const contractAddress = rp.api.contracts.get("rocketTokenRPL").then((val: string) => { contract.options.address };
     * ```ts
     * const balance = rp.tokens.rpl.allowance(account, contractAddress).then((val: string) => { val };
     * ```
     */
    allowance(account: string, spender: string): Promise<string>;
    /**
     * Transfer tokens to an account to a recipient if approved
     * @param to A string representing the to address
     * @param amountWei A string representing the amount to send in Wei
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const fromAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const toAddress = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
     * const amountWei = web3.utils.toWei("20", "ether");
     * const options = {
     *		from: fromAddress,
     *		gas: 1000000
     * };
     * const txReceipt = rp.tokens.rpl.transfer(toAddress, amountWei, options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    transfer(to: string, amountWei: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Approve an allowance for a spender
     * @param spender A string representing the spender address (usually a token contract)
     * @param amountWei A string representing the amount to send in Wei
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const fromAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const contractAddress = rp.api.contracts.get("rocketTokenRPL").then((val: string) => { contract.options.address };
     * const amountWei = web3.utils.toWei("20", "ether");
     * const options = {
     *		from: fromAddress,
     *		gas: 1000000
     * };
     * const txReceipt = rp.tokens.rpl.approve(contractAddress, amountWei, options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    approve(spender: string, amountWei: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Transfer tokens from an account to a recipient if approved
     * @param from A string representing the from address
     * @param to A string representing the to address
     * @param amountWei A string representing the amount to send in Wei
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const fromAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const toAddress = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
     * const amountWei = web3.utils.toWei("20", "ether");
     * const options = {
     *		from: fromAddress,
     *		gas: 1000000
     * };
     * const txReceipt = rp.tokens.rpl.transferFrom(from, to, options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    transferFrom(from: string, to: string, amountWei: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
}
export default ERC20;
