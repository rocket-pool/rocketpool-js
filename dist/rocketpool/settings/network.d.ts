import Web3 from "web3";
import Contracts from "../contracts/contracts";
/**
 * Rocket Pool Network Settings Manager
 */
declare class NetworkSettings {
    private web3;
    private contracts;
    /**
     * Create a new Network Settings instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsNetwork contract
     */
    private get rocketDAOProtocolSettingsNetwork();
    /**
     * Return the threshold of trusted nodes that must reach consensus on oracle data to commit it
     * @returns a Promise<number\> that resolves to a number representing the threshold of trusted nodes that must reach consensus on oracle daa to commit it
     *
     * @example using Typescript
     * ```ts
     * const nodeConsensusThreshold = rp.settings.network.getNodeConsensusThreshold().then((val: number) => { val };
     * ```
     */
    getNodeConsensusThreshold(): Promise<number>;
    /**
     * Return if balance submissions are enabled
     * @returns a Promise<boolean\> that resolves to a boolean representing the threshold of trusted nodes that must reach consensus on oracle daa to commit it
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.settings.network.getSubmitBalancesEnabled().then((val: boolean) => { val };
     * ```
     */
    getSubmitBalancesEnabled(): Promise<boolean>;
    /**
     * Return the frequency in blocks at which network balances should be submitted by trusted nodes
     * @returns a Promise<number\> that resolves to a number representing the frequency in blocks at which network balances should be submitted by trusted nodes
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.settings.network.getSubmitBalancesFrequency().then((val: number) => { val };
     * ```
     */
    getSubmitBalancesFrequency(): Promise<number>;
    /**
     * Return the minimum node fee
     * @returns a Promise<number\> that resolves to a number representing the minimum node fee
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.settings.network.getMinimumNodeFee().then((val: number) => { val };
     * ```
     */
    getMinimumNodeFee(): Promise<number>;
    /**
     * Return the target node fee
     * @returns a Promise<number\> that resolves to a number representing the target node fee
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.settings.network.getTargetNodeFee().then((val: number) => { val };
     * ```
     */
    getTargetNodeFee(): Promise<number>;
    /**
     * Return the maximum node fee
     * @returns a Promise<number\> that resolves to a number representing the maximum node fee
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.settings.network.getMaximumNodeFee().then((val: number) => { val };
     * ```
     */
    getMaximumNodeFee(): Promise<number>;
    /**
     * Return the range of node demand values in Wei to base fee calculations on (from negative to positive value)
     * @returns a Promise<string\> that resolves to a string representing the range of node demand values in Wei
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.settings.network.getNodeFeeDemandRange().then((val: string) => { val };
     * ```
     */
    getNodeFeeDemandRange(): Promise<string>;
    /**
     * Return the target rETH collateralization rate
     * @returns a Promise<number\> that resolves to a number representing the target rETH collateralization rate
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.settings.network.getTargetRethCollateralRate().then((val: number) => { val };
     * ```
     */
    getTargetRethCollateralRate(): Promise<number>;
    /**
     * Return the rETH deposit delay setting
     * @returns a Promise<number\> that resolves to a number representing the rETH deposit delay setting
     *
     * @example using Typescript
     * ```ts
     * const enabled = rp.settings.network.getRethDespositDelay().then((val: number) => { val };
     * ```
     */
    getRethDespositDelay(): Promise<number>;
}
export default NetworkSettings;
