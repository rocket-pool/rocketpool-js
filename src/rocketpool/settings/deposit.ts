// Imports
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import Contracts from "../contracts/contracts";

/**
 * Rocket Pool Deposit Settings Manager
 */
class DepositSettings {
	/**
	 * Create a new Deposit Settings instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool Contract Manager Instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	// Contract accessors
	private get rocketDAOProtocolSettingsDeposit(): Promise<Contract> {
		return this.contracts.get("rocketDAOProtocolSettingsDeposit");
	}

	/**
	 * Getters
	 */

	// Deposits are currently enabled
	public getDepositEnabled(): Promise<boolean> {
		return this.rocketDAOProtocolSettingsDeposit.then((rocketDAOProtocolSettingsDeposit: Contract): Promise<boolean> => {
			return rocketDAOProtocolSettingsDeposit.methods.getDepositEnabled().call();
		});
	}

	// Deposit assignments are currently enabled
	public getAssignDepositsEnabled(): Promise<boolean> {
		return this.rocketDAOProtocolSettingsDeposit.then((rocketDAOProtocolSettingsDeposit: Contract): Promise<boolean> => {
			return rocketDAOProtocolSettingsDeposit.methods.getAssignDepositsEnabled().call();
		});
	}

	// Minimum deposit amount in wei
	public getMinimumDeposit(): Promise<string> {
		return this.rocketDAOProtocolSettingsDeposit.then((rocketDAOProtocolSettingsDeposit: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsDeposit.methods.getMinimumDeposit().call();
		});
	}

	// Maximum deposit pool size in wei
	public getMaximumDepositPoolSize(): Promise<string> {
		return this.rocketDAOProtocolSettingsDeposit.then((rocketDAOProtocolSettingsDeposit: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsDeposit.methods.getMaximumDepositPoolSize().call();
		});
	}

	// Maximum number of deposit assignments to perform at once
	public getMaximumDepositAssignments(): Promise<number> {
		return this.rocketDAOProtocolSettingsDeposit
			.then((rocketDAOProtocolSettingsDeposit: Contract): Promise<string> => {
				return rocketDAOProtocolSettingsDeposit.methods.getMaximumDepositAssignments().call();
			})
			.then((value: string): number => parseInt(value));
	}
}

// Exports
export default DepositSettings;
