/// <reference types="node" />
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler } from "../../utils/transaction";
export interface NodeDetails {
    address: string;
    exists: boolean;
    timezoneLocation: string;
}
/**
 * Rocket Pool Node Manager
 */
declare class Node {
    private web3;
    private contracts;
    /**
     * Create a new Node instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeDeposit contract
     */
    private get rocketNodeDeposit();
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeManager contract
     */
    private get rocketNodeManager();
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeStaking contract
     */
    private get rocketNodeStaking();
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketStorage contract
     */
    private get rocketStorage();
    /**
     * Get an array of Node Details
     * @returns a Promise<NodeDetails[]\> that resolves to an array of NodeDetails
     *
     * @example using Typescript
     * ```ts
     * const nodes = rp.node.getNodes().then((val: string) => { val };
     * ```
     */
    getNodes(): Promise<NodeDetails[]>;
    /**
     * Get an array of node addresses
     * @returns a Promise<string[]\> that resolves to an array of node addresses
     *
     * @example using Typescript
     * ```ts
     * const addresses = rp.node.getNodesAddresses().then((val: string[]) => { val };
     * ```
     */
    getNodeAddresses(): Promise<string[]>;
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
    getNodeDetails(address: string): Promise<NodeDetails>;
    /**
     * Get the total node count
     * @returns a Promise<number\> that resolves to a number representing the quantity of total nodes
     *
     * @example using Typescript
     * ```ts
     * const nodeCount = rp.node.getNodeCount().then((val: number) => { val };
     * ```
     */
    getNodeCount(): Promise<number>;
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
    getNodeAt(index: number): Promise<string>;
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
    getNodeExists(address: string): Promise<boolean>;
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
    getNodeTimezoneLocation(address: string): Promise<string>;
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
    getNodeWithdrawalAddress(address: string): Promise<string>;
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
    getNodeRPLStake(address: string): Promise<string>;
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
    getNodeEffectiveRPLStake(address: string): Promise<string>;
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
    getNodeMinipoolLimit(address: string): Promise<string>;
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
    getNodeTotalEffectiveRPLStake(): Promise<string>;
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
    getNodeMinimumRPLStake(address: string): Promise<string>;
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
    getNodePendingWithdrawalAddress(address: string): Promise<string>;
    /**
     * Get the total effective RPL stake
     * @returns a Promise<string\> that resolves to a string representing the total effective rpl stake
     *
     * @example using Typescript
     * ```ts
     * const totalEffectiveRPLStake = rp.node.getTotalEffectiveRPLStake().then((val: string) => { val };
     * ```
     */
    getTotalEffectiveRPLStake(): Promise<string>;
    /**
     * Get the total RPL stake
     * @returns a Promise<string\> that resolves to a string representing the total rpl stake
     *
     * @example using Typescript
     * ```ts
     * const totalRPLStake = rp.node.getTotalRPLStake().then((val: string) => { val };
     * ```
     */
    getTotalRPLStake(): Promise<string>;
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
    calculateTotalEffectiveRPLStake(offset: number, limit: number, rplPrice: string): Promise<string>;
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
    getNodeCountPerTimezone(offset: number, limit: number): Promise<object>;
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
    getDepositType(amount: string): Promise<number>;
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
    registerNode(timezoneLocation: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
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
    setWithdrawalAddress(nodeAddress: string, withdrawalAddress: string, confirm: boolean, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
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
    stakeRPL(amount: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
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
    confirmWithdrawalAddress(nodeAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
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
    withdrawRPL(amount: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
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
    setTimezoneLocation(timezoneLocation: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
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
    deposit(minimumNodeFee: string, validatorPubKey: Buffer, validatorSignature: Buffer, depositDataRoot: Buffer, salt: number, expectedMinipoolAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
}
export default Node;
