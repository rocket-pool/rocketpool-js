import Web3 from "web3";
import Contracts from "../contracts/contracts";
/**
 * Rocket Pool Vault
 */
declare class Vault {
    private web3;
    private contracts;
    /**
     * Create a new Vault instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketVault contract
     */
    private get rocketVault();
    /**
     * Retrieve the RocketVault contract address
     * @returns a Promise<string\> that resolves to the Rocket Vault contract address
     *
     * @example using Typescript
     * ```ts
     * const rocketVault = rp.vault.getAddress().then((val: string) => { val };
     * ```
     */
    getAddress(): Promise<string>;
    /**
     * Retrieve the balance of a token when providing a contract & token address
     * @param contractAddress A string representing the contract address
     * @param tokenAddress A string representing the token address
     * @returns a Promise<string\> that resolves to the Rocket Vault contract address
     *
     * @example using Typescript
     * ```ts
     * const rplBalance = rp.vault.balanceOfToken("rocketClaimDAO", rocketTokenRPLAddress).then((val: string) => { val }
     * ```
     */
    balanceOfToken(contractAddress: string, tokenAddress: string): Promise<string>;
}
export default Vault;
