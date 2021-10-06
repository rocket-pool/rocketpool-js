// Imports
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import Contracts from "../contracts/contracts";

/**
 * Rocket Pool Auction Settings Manager
 */
class AuctionSettings {
	// Constructor
	public constructor(private web3: Web3, private contracts: Contracts) {}

	// Contract accessors
	private get rocketDAOProtocolSettingsAuction(): Promise<Contract> {
		return this.contracts.get("rocketDAOProtocolSettingsAuction");
	}

	/**
	 * Getters
	 */
	// Return the Lot Maximum Eth Value Setting
	public getLotMaximumEthValue(): Promise<number> {
		return this.rocketDAOProtocolSettingsAuction.then((rocketDAOProtocolSettingsAuction: Contract): Promise<number> => {
			return rocketDAOProtocolSettingsAuction.methods.getLotMaximumEthValue().call();
		});
	}

	// Return the Lot Duration Setting
	public getLotDuration(): Promise<number> {
		return this.rocketDAOProtocolSettingsAuction.then((rocketDAOProtocolSettingsAuction: Contract): Promise<number> => {
			return rocketDAOProtocolSettingsAuction.methods.getLotDuration().call();
		});
	}

	// Return the Starting Price Ratio Setting
	public getStartingPriceRatio(): Promise<number> {
		return this.rocketDAOProtocolSettingsAuction.then((rocketDAOProtocolSettingsAuction: Contract): Promise<number> => {
			return rocketDAOProtocolSettingsAuction.methods.getStartingPriceRatio().call();
		});
	}

	// Return the Reserve Price Ratio Setting
	public getReservePriceRatio(): Promise<number> {
		return this.rocketDAOProtocolSettingsAuction.then((rocketDAOProtocolSettingsAuction: Contract): Promise<number> => {
			return rocketDAOProtocolSettingsAuction.methods.getReservePriceRatio().call();
		});
	}
}

// Exports
export default AuctionSettings;
