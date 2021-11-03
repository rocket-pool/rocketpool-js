import Web3 from "web3";
import Contracts from "../contracts/contracts";
import ERC20 from "./erc20";
/**
 * Rocket Pool Legacy RPL Token Manager
 */
declare class LegacyRPL extends ERC20 {
    /**
     * Create a new LegacyRPL instance.
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
     * const address = rp.tokens.legacyrpl.getAddress().then((val: string) => { val };
     * ```
     */
    getAddress(): Promise<string>;
}
export default LegacyRPL;
