/// <reference types="node" />
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import { ConfirmationHandler } from "../../utils/transaction";
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
declare class MinipoolContract {
    private web3;
    readonly address: string;
    readonly contract: Contract;
    /**
     * Create a new Minipool Contract instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, address: string, contract: Contract);
    /**
     * Get status details
     * @returns a Promise<StatusDetails\> that resolves to a StatusDetails object (status, block, time)
     *
     * @example using Typescript
     * ```ts
     * const statusDetails = minipool.getStatusDetails().then((val: StatusDetails) => { val };
     * ```
     */
    getStatusDetails(): Promise<StatusDetails>;
    /**
     * Get status of a minipool
     * @returns a Promise<number\> that resolves to a number representing the minipool status
     *
     * @example using Typescript
     * ```ts
     * const status = minipool.getStatus().then((val: number) => { val };
     * ```
     */
    getStatus(): Promise<number>;
    /**
     * Get status block of a minipool
     * @returns a Promise<number\> that resolves to a number representing the status block of a minipool
     *
     * @example using Typescript
     * ```ts
     * const statusBlock = minipool.getStatusBlock().then((val: number) => { val };
     * ```
     */
    getStatusBlock(): Promise<number>;
    /**
     * Get status timestamp of a minipool
     * @returns a Promise<Date\> that resolves to a Date representing the timestamp a minipool status
     *
     * @example using Typescript
     * ```ts
     * const statusTime = minipool.getStatusBlock().then((val: Date) => { val };
     * ```
     */
    getStatusTime(): Promise<Date>;
    /**
     * Get the deposit type
     * @returns a Promise<number\> that resolves to a number representing the deposit type
     *
     * @example using Typescript
     * ```ts
     * const depositType = minipool.getDepositType().then((val: number) => { val };
     * ```
     */
    getDepositType(): Promise<number>;
    /**
     * Get the node details of a minipool
     * @returns a Promise<NodeDetails\> that resolves to a NodeDetails object representing details about the minipool's nodes
     *
     * @example using Typescript
     * ```ts
     * const nodeDetails = minipool.getNodeDetails().then((val: NodeDetails) => { val };
     * ```
     */
    getNodeDetails(): Promise<NodeDetails>;
    /**
     * Get the node address of a minipool
     * @returns a Promise<string\> that resolves to a string representing the node address of the minipool
     *
     * @example using Typescript
     * ```ts
     * const nodeAddress = minipool.getNodeAddress().then((val: string) => { val };
     * ```
     */
    getNodeAddress(): Promise<string>;
    /**
     * Get the node fee of a minipool
     * @returns a Promise<number\> that resolves to a number representing the node fee of the minipool
     *
     * @example using Typescript
     * ```ts
     * const nodeFee = minipool.getNodeFee().then((val: number) => { val };
     * ```
     */
    getNodeFee(): Promise<number>;
    /**
     * Get the node deposit balance of a minipool
     * @returns a Promise<string\> that resolves to a string representing the node deposit balance of a minipool in Wei
     *
     * @example using Typescript
     * ```ts
     * const nodeBalanceDeposit = minipool.getNodeDepositBalance().then((val: string) => { val };
     * ```
     */
    getNodeDepositBalance(): Promise<string>;
    /**
     * Get the node refund balance of a minipool
     * @returns a Promise<string\> that resolves to a string representing the node refund balance of a minipool in Wei
     *
     * @example using Typescript
     * ```ts
     * const nodeRefundDeposit = minipool.getNodeRefundBalance().then((val: string) => { val };
     * ```
     */
    getNodeRefundBalance(): Promise<string>;
    /**
     * Get if a node deposit has been assigned for a minipool
     * @returns a Promise<boolean\> that resolves to a boolean representing if a node deposit has been assigned for a minipool
     *
     * @example using Typescript
     * ```ts
     * const nodeDepositAssigned = minipool.getNodeDepositAssigned().then((val: boolean) => { val };
     * ```
     */
    getNodeDepositAssigned(): Promise<boolean>;
    /**
     * Get if a minipool has had scrub votes
     * @returns a Promise<boolean\> that resolves to a boolean representing if a minipool has had scrub votes
     *
     * @example using Typescript
     * ```ts
     * const scrubVoted = minipool.getScrubVoted().then((val: boolean) => { val };
     * ```
     */
    getScrubVoted(): Promise<boolean>;
    /**
     * Get the total scrub votes for a minipool
     * @returns a Promise<number\> that resolves to a number representing the total number of scrub votes a minipool has
     *
     * @example using Typescript
     * ```ts
     * const totalScrubVotes = minipool.getTotalScrubVotes().then((val: number) => { val };
     * ```
     */
    getTotalScrubVotes(): Promise<number>;
    /**
     * Get user deposit details
     * @returns a Promise<UserDetails\> that resolves to a UserDetails object representing the user details (depositBalance, depositAssigned, depositAssignedTime) for a minipool
     *
     * @example using Typescript
     * ```ts
     * const userDetails = minipool.getUserDetails().then((val: UserDetails) => { val };
     * ```
     */
    getUserDetails(): Promise<UserDetails>;
    /**
     * Get user deposit balance
     * @returns a Promise<string\> that resolves to a string representing the user deposit balance for a minipool in Wei
     *
     * @example using Typescript
     * ```ts
     * const userDepositBalance = minipool.getUserDepositBalance().then((val: string) => { val };
     * ```
     */
    getUserDepositBalance(): Promise<string>;
    /**
     * Get user deposit assigned
     * @returns a Promise<boolean\> that resolves to a boolean representing if the user deposit has been assigned
     *
     * @example using Typescript
     * ```ts
     * const userDepositAssigned = minipool.getUserDepositAssigned().then((val: boolean) => { val };
     * ```
     */
    getUserDepositAssigned(): Promise<boolean>;
    /**
     * Get a timestamp for when the user deposit was assigned for the minipool
     * @returns a Promise<Date\> that resolves to a Date representing the timestamp the user deposit was assigned for the minipool
     *
     * @example using Typescript
     * ```ts
     * const userDepositAssignedTime = minipool.getUserDepositAssignedTime().then((val: boolean) => { val };
     * ```
     */
    getUserDepositAssignedTime(): Promise<Date>;
    /**
     * Get a staking details for a minipool
     * @returns a Promise<StakingDetails\> that resolves to a StakingDetails object representing staking details (start & end balance) for a minipool
     *
     * @example using Typescript
     * ```ts
     * const stakingDetails = minipool.getStakingDetails().then((val: StakingDetails) => { val };
     * ```
     */
    getStakingDetails(): Promise<StakingDetails>;
    /**
     * Get a staking start balance for a minipool
     * @returns a Promise<string\> that resolves to a string representing the staking start balance for a minipool
     *
     * @example using Typescript
     * ```ts
     * const stakingStartBalance = minipool.getStakingStartBalance().then((val: string) => { val };
     * ```
     */
    getStakingStartBalance(): Promise<string>;
    /**
     * Get a staking end balance for a minipool
     * @returns a Promise<string\> that resolves to a string representing the staking end balance for a minipool
     *
     * @example using Typescript
     * ```ts
     * const stakingEndBalance = minipool.getStakingEndBalance().then((val: string) => { val };
     * ```
     */
    getStakingEndBalance(): Promise<string>;
    /**
     * Get a minipool's withdrawal credentials
     * @returns a Promise<string\> that resolves to a string representing the minipool's withdrawal credentials
     *
     * @example using Typescript
     * ```ts
     * const withdrawalCredentials = minipool.getWithdrawalCredentials().then((val: string) => { val };
     * ```
     */
    getWithdrawalCredentials(): Promise<string>;
    /**
     * Check if a minipool's node is withdrawn
     * @returns a Promise<boolean\> that resolves to a boolean representing if the minipool's node is withdrawn
     *
     * @example using Typescript
     * ```ts
     * const nodeWithdrawn = minipool.getNodeWithdrawn().then((val: boolean) => { val };
     * ```
     */
    getNodeWithdrawn(): Promise<boolean>;
    /**
     * Dissolve the minipool
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
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
    dissolve(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Slash the minipool
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
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
    slash(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Refund node ETH refinanced from user deposited ETH
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
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
    refund(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Progress the minipool to staking, sending its ETH deposit to the VRC
     * Only accepts calls from the minipool owner (node) while in prelaunch and once scrub period has ended
     * @param validatorSignature A buffer containing the validator signature
     * @param depositDataRoot A buffer containing the deposit data
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const validatorSignature = <Buffer 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23>;
     * const depositDataRoot = <Buffer 48 ad 0b 82 2c d6 81 f9 c9 8b 06 a1 8b 93 4b df 7f 40 76 80 fb 7a 3b 5c cd 2c 92 a6 4a 58 e9 05>;
     * const owner = "0x8B0EF9f1932A2e44c3D27bE4C70C3BC07A6A27B3"; // must be the owner of the minipool
     * const options = {
     *		from: owner,
     *		gas: 1000000
     * };
     * const txReceipt = minipool.stake(validatorSignature, depositDataRoot, options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    stake(validatorSignature: Buffer, depositDataRoot: Buffer, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Finalise and unlock their RPL stake
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
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
    finalise(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Withdraw node balances & rewards from the minipool and close it
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
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
    withdraw(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Distributes the contract's balance and finalises the pool
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
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
    distributeBalanceAndFinalise(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Distributes the contract's balance
     * When called during staking status, requires 16 ether in the pool
     * When called by non-owner with less than 16 ether, requires 14 days to have passed since being made withdrawable
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
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
    distributeBalance(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Mark a minipool as scrub, we don't want no scrubs
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const daoMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // can only be called by a DAO member
     * const options = {
     *		from: daoMember,
     *		gas: 1000000
     * };
     * const txReceipt = minipool.voteScrub(options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    voteScrub(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Withdraw node balances from the minipool and close it
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
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
    close(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
}
export default MinipoolContract;
