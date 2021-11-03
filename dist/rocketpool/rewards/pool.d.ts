import Web3 from "web3";
import Contracts from "../contracts/contracts";
/**
 * Rocket Pool Rewards
 */
declare class Pool {
    private web3;
    private contracts;
    /**
     * Create a new Pool instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketRewardsPool contract
     */
    private get rocketRewardsPool();
    /**
     * Get claim intervals passed
     * @returns a Promise<number\> that resolves to a number representing the claim intervals passed
     *
     * @example using Typescript
     * ```ts
     * const claimIntervalsPassed = rp.rewards.pool.getClaimIntervalsPassed().then((val: number) => { val };
     * ```
     */
    getClaimIntervalsPassed(): Promise<number>;
    /**
     * Get the claim intervals start time
     * @returns a Promise<number\> that resolves to a number representing the claim intervals start time
     *
     * @example using Typescript
     * ```ts
     * const claimIntervalTimeStart = rp.rewards.pool.getClaimIntervalTimeStart().then((val: number) => { val };
     * ```
     */
    getClaimIntervalTimeStart(): Promise<string>;
    /**
     * Get the rpl balance
     * @returns a Promise<string\> that resolves to a string representing the claim RPL balance in Wei
     *
     * @example using Typescript
     * ```ts
     * const rplBalance = rp.rewards.pool.getRPLBalance().then((val: string) => { val };
     * ```
     */
    getRPLBalance(): Promise<string>;
    /**
     * Get the claiming contract percentage
     * @params contract a string representing the contract address
     * @returns a Promise<string\> that resolves to a string representing the claiming contract percentage
     *
     * @example using Typescript
     * ```ts
     * const contract = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const claimingContractPercentage = rp.rewards.pool.getClaimingContractPerc(contract).then((val: string) => { val };
     * ```
     */
    getClaimingContractPerc(contract: string): Promise<string>;
    /**
     * Get the claiming contract allowance
     * @params contract a string representing the contract address
     * @returns a Promise<string\> that resolves to a string representing the claiming contract allowance
     *
     * @example using Typescript
     * ```ts
     * const contract = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const claimingContractAllowance = rp.rewards.pool.getClaimingContractAllowance(contract).then((val: string) => { val };
     * ```
     */
    getClaimingContractAllowance(contract: string): Promise<number>;
    /**
     * Get the claiming contract total claimed
     * @params contract a string representing the contract address
     * @returns a Promise<string\> that resolves to a string representing the claiming contract total claimed
     *
     * @example using Typescript
     * ```ts
     * const contract = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const claimingContractTotalClaimed = rp.rewards.pool.getClaimingContractTotalClaimed(contract).then((val: string) => { val };
     * ```
     */
    getClaimingContractTotalClaimed(contract: string): Promise<string>;
    /**
     * Get the claim interval rewards total
     * @returns a Promise<string\> that resolves to a string representing the claiming interval rewards total
     *
     * @example using Typescript
     * ```ts
     * const claimIntervalRewardsTotal = rp.rewards.pool.getClaimIntervalRewardsTotal().then((val: string) => { val };
     * ```
     */
    getClaimIntervalRewardsTotal(): Promise<string>;
    /**
     * Get the claim contract registered time
     * @params contractAddress a string representing the contract address
     * @params trustedNodeAddress a string representing a trusted node address
     * @returns a Promise<string\> that resolves to a string representing the claim contract registered block
     *
     * @example using Typescript
     * ```ts
     * const contractAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const trustedNodeAddress = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
     * const claimContractRegisteredTime = rp.rewards.pool.getClaimContractRegisteredTime(contractAddress, trustedNodeAddress).then((val: string) => { val };
     * ```
     */
    getClaimContractRegisteredTime(contractAddress: string, trustedNodeAddress: string): Promise<string>;
    /**
     * Get the number of claimers for the current interval per claiming contract
     * @params contract a string representing the contract address
     * @returns a Promise<string\> that resolves to a string representing the claim contract registered block
     *
     * @example using Typescript
     * ```ts
     * const contract = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
     * const claimingContractTotalClaimed = rp.rewards.pool.getClaimingContractUserTotalCurrent(contract).then((val: string) => { val };
     * ```
     */
    getClaimingContractUserTotalCurrent(contract: string): Promise<string>;
}
export default Pool;
