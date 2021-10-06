// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../../utils/transaction";

/**
 * Rocket Pool DAO Protocol Settings
 */
class DAOProtocolSettings {
	// Constructor
	public constructor(private web3: Web3, private contracts: Contracts) {}

	// Contract accessors
	private get rocketDAOProtocolSettings(): Promise<Contract> {
		return this.contracts.get("rocketDAOProtocolSettings");
	}

	private get rocketDAOProtocolSettingsNetwork(): Promise<Contract> {
		return this.contracts.get("rocketDAOProtocolSettingsNetwork");
	}

	/**
	 * Getters
	 */
	// Get member id given an address
	public getRethDepositDelay(): Promise<number> {
		return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<number> => {
			return rocketDAOProtocolSettingsNetwork.methods.getRethDepositDelay().call();
		});
	}

	/**
	 * Mutators - Public
	 */
}

// Exports
export default DAOProtocolSettings;
