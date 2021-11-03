import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { SendOptions } from "web3-eth-contract";
import Contracts from "../../../contracts/contracts";
import { ConfirmationHandler } from "../../../../utils/transaction";
/**
 * Rocket Pool DAO Trusted Node Actions
 */
declare class DAONodeTrustedActions {
    private web3;
    private contracts;
    /**
     * Create a new DAONodeTrustedActions instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAONodeTrustedActions contract
     */
    private get rocketDAONodeTrustedActions();
    /**
     * Join the DAO
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const options = {
     *		from: nodeAddress,
     *		gas: 1000000
     * }
     * const txReceipt = rp.dao.node.trusted.actions.actionJoin(options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    actionJoin(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Leave the DAO
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const options = {
     *		from: nodeAddress,
     *		gas: 1000000
     * }
     * const txReceipt = rp.dao.node.trusted.actions.actionLeave(options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    actionLeave(refundAddress: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Challenge another DAO member
     * @param address A string representing the address of the DAO member you want challenge
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const addressToChallenge = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
     * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const options = {
     *		from: nodeAddress,
     *		gas: 1000000
     * }
     * const txReceipt = rp.dao.node.trusted.actions.actionChallengeMake(addressToChallenge, options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    actionChallengeMake(address: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
    /**
     * Decides the success of a challenge
     * @param address A string representing the address of the DAO member you want challenge
     * @param options An optional object of web3.eth.Contract SendOptions
     * @param onConfirmation An optional confirmation handler object
     * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
     *
     * @example using Typescript
     * ```ts
     * const addressToChallenge = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
     * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const options = {
     *		from: nodeAddress,
     *		gas: 1000000
     * }
     * const txReceipt = rp.dao.node.trusted.actions.actionChallengeMake(addressToChallenge, options).then((txReceipt: TransactionReceipt) => { txReceipt };
     * ```
     */
    actionChallengeDecide(address: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt>;
}
export default DAONodeTrustedActions;
