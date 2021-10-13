// Imports
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import Contracts from "../contracts/contracts";

/**
 * Rocket Pool Auction Settings Manager
 */
class AuctionSettings {
	/**
	 * Create a new AuctionSettings instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketDAOProtocolSettingsAuction contract
	 */
	private get rocketDAOProtocolSettingsAuction(): Promise<Contract> {
		return this.contracts.get("rocketDAOProtocolSettingsAuction");
	}

	/**
	 * Return the lot maximum ETH value setting
	 * @returns a Promise<number> that resolves to a number representing the lot maximum ETH value setting
	 *
	 * @example using Typescript
	 * ```ts
	 * const lotMaximumEthValue = rp.settings.auction.getLotMaximumEthValue().then((val: number) => { val };
	 * ```
	 */
	public getLotMaximumEthValue(): Promise<number> {
		return this.rocketDAOProtocolSettingsAuction.then((rocketDAOProtocolSettingsAuction: Contract): Promise<number> => {
			return rocketDAOProtocolSettingsAuction.methods.getLotMaximumEthValue().call();
		});
	}

	/**
	 * Return the lot duration setting
	 * @returns a Promise<number> that resolves to a number representing the lot duration setting
	 *
	 * @example using Typescript
	 * ```ts
	 * const lotMaximumEthValue = rp.settings.auction.getLotDuration().then((val: number) => { val };
	 * ```
	 */
	public getLotDuration(): Promise<number> {
		return this.rocketDAOProtocolSettingsAuction.then((rocketDAOProtocolSettingsAuction: Contract): Promise<number> => {
			return rocketDAOProtocolSettingsAuction.methods.getLotDuration().call();
		});
	}

	/**
	 * Return the starting price ratio setting
	 * @returns a Promise<number> that resolves to a number representing the starting price ratio setting
	 *
	 * @example using Typescript
	 * ```ts
	 * const startingPriceRatio = rp.settings.auction.getStartingPriceRatio().then((val: number) => { val };
	 * ```
	 */
	public getStartingPriceRatio(): Promise<number> {
		return this.rocketDAOProtocolSettingsAuction.then((rocketDAOProtocolSettingsAuction: Contract): Promise<number> => {
			return rocketDAOProtocolSettingsAuction.methods.getStartingPriceRatio().call();
		});
	}

	/**
	 * Return the reserve price ratio setting
	 * @returns a Promise<number> that resolves to a number representing the reserve price ratio setting
	 *
	 * @example using Typescript
	 * ```ts
	 * const reservePriceRatio = rp.settings.auction.getReservePriceRatio().then((val: number) => { val };
	 * ```
	 */
	public getReservePriceRatio(): Promise<number> {
		return this.rocketDAOProtocolSettingsAuction.then((rocketDAOProtocolSettingsAuction: Contract): Promise<number> => {
			return rocketDAOProtocolSettingsAuction.methods.getReservePriceRatio().call();
		});
	}
}

// Exports
export default AuctionSettings;
