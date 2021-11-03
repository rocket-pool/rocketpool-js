import Web3 from "web3";
import Contracts from "../contracts/contracts";
/**
 * Rocket Pool Deposit Settings Manager
 */
declare class DepositSettings {
    private web3;
    private contracts;
    /**
     * Create a new Deposit Settings instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsDeposit contract
     */
    private get rocketDAOProtocolSettingsDeposit();
    /**
     * Check to see if deposits are enabled
     * @returns a Promise<boolean\> that resolves to a boolean representing if deposits are enabled
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.settings.deposit.getDepositsEnabled().then((val: boolean) => { val };
     * ```
     */
    getDepositEnabled(): Promise<boolean>;
    /**
     * Check to see if deposit assignments are enabled
     * @returns a Promise<boolean\> that resolves to a boolean representing if deposit assignments are enabled
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.settings.deposit.getAssignDepositsEnabled().then((val: boolean) => { val };
     * ```
     */
    getAssignDepositsEnabled(): Promise<boolean>;
    /**
     * Return the minimum deposit amount setting in wei
     * @returns a Promise<string\> that resolves to a string representing the minimum deposit amount setting
     *
     * @example using Typescript
     * ```ts
     * const minimumDeposit = rp.settings.deposit.getMinimumDeposit().then((val: string) => { val };
     * ```
     */
    getMinimumDeposit(): Promise<string>;
    /**
     * Return the maximum deposit pool size setting in Wei
     * @returns a Promise<string\> that resolves to a string representing the maximum deposit pool size setting
     *
     * @example using Typescript
     * ```ts
     * const maximumDepositPoolSize = rp.settings.deposit.getMaximumDepositPoolSize().then((val: string) => { val };
     * ```
     */
    getMaximumDepositPoolSize(): Promise<string>;
    /**
     * Return the maximum number of deposit assignments to perform at once
     * @returns a Promise<number\> that resolves to a number representing the maximum number of deposit assignments to perform at once
     *
     * @example using Typescript
     * ```ts
     * const maxDepositAssignments = rp.settings.deposit.getMaximumDepositAssignments().then((val: string) => { val };
     * ```
     */
    getMaximumDepositAssignments(): Promise<number>;
}
export default DepositSettings;
