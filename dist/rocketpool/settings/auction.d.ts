import Web3 from "web3";
import Contracts from "../contracts/contracts";
/**
 * Rocket Pool Auction Settings Manager
 */
declare class AuctionSettings {
    private web3;
    private contracts;
    /**
     * Create a new AuctionSettings instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsAuction contract
     */
    private get rocketDAOProtocolSettingsAuction();
    /**
     * Return the lot maximum ETH value setting
     * @returns a Promise<number\> that resolves to a number representing the lot maximum ETH value setting
     *
     * @example using Typescript
     * ```ts
     * const lotMaximumEthValue = rp.settings.auction.getLotMaximumEthValue().then((val: number) => { val };
     * ```
     */
    getLotMaximumEthValue(): Promise<number>;
    /**
     * Return the lot duration setting
     * @returns a Promise<number\> that resolves to a number representing the lot duration setting
     *
     * @example using Typescript
     * ```ts
     * const lotMaximumEthValue = rp.settings.auction.getLotDuration().then((val: number) => { val };
     * ```
     */
    getLotDuration(): Promise<number>;
    /**
     * Return the starting price ratio setting
     * @returns a Promise<number\> that resolves to a number representing the starting price ratio setting
     *
     * @example using Typescript
     * ```ts
     * const startingPriceRatio = rp.settings.auction.getStartingPriceRatio().then((val: number) => { val };
     * ```
     */
    getStartingPriceRatio(): Promise<number>;
    /**
     * Return the reserve price ratio setting
     * @returns a Promise<number\> that resolves to a number representing the reserve price ratio setting
     *
     * @example using Typescript
     * ```ts
     * const reservePriceRatio = rp.settings.auction.getReservePriceRatio().then((val: number) => { val };
     * ```
     */
    getReservePriceRatio(): Promise<number>;
}
export default AuctionSettings;
