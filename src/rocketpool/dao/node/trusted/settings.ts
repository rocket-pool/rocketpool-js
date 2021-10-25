// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../../../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../../../utils/transaction";

/**
 * Rocket Pool DAO Trusted Node Settings
 */
class DAONodeTrustedSettings {
	/**
	 * Create a new DAONodeTrustedSettings instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketDAONodeTrustedSettingsProposals contract
	 */
	private get rocketDAONodeTrustedSettingsProposals(): Promise<Contract> {
		return this.contracts.get("rocketDAONodeTrustedSettingsProposals");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketDAONodeTrustedSettingsMembers contract
	 */
	private get rocketDAONodeTrustedSettingsMembers(): Promise<Contract> {
		return this.contracts.get("rocketDAONodeTrustedSettingsMembers");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketDAOProtocolSettingsDeposit contract
	 */
	private get rocketDAOProtocolSettingsDeposit(): Promise<Contract> {
		return this.contracts.get("rocketDAOProtocolSettingsDeposit");
	}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketDAOProtocolSettingsMinipool contract
	 */
	private get rocketDAOProtocolSettingsMinipool(): Promise<Contract> {
		return this.contracts.get("rocketDAOProtocolSettingsMinipool");
	}

	/**
	 * Get the maximum deposit assignments
	 * @returns a Promise<string> that resolves to a string representing the maximum deposit assignments
	 *
	 * @example using Typescript
	 * ```ts
	 * const maxDepositsAssignments = rp.dao.node.trusted.getMaximumDepositAssignments().then((val: string) => { val };
	 * ```
	 */
	public getMaximumDepositAssignments(): Promise<string> {
		return this.rocketDAOProtocolSettingsDeposit.then((rocketDAOProtocolSettingsDeposit: Contract): Promise<string> => {
			return rocketDAOProtocolSettingsDeposit.methods.getMaximumDepositAssignments().call();
		});
	}

	/**
	 * Get the cost of a challenge (How much it costs a non-member to challenge a members node. It's free for current members to challenge other members.)
	 * @returns a Promise<string> that resolves to a string representing the inflation intervals that have passed (in time)
	 *
	 * @example using Typescript
	 * ```ts
	 * const maxDepositsAssignments = rp.dao.node.trusted.getMaximumDepositAssignments().then((val: string) => { val };
	 * ```
	 */
	public getChallengeCost(): Promise<string> {
		return this.rocketDAONodeTrustedSettingsMembers.then((rocketDAONodeTrustedSettingsMembers: Contract): Promise<string> => {
			return rocketDAONodeTrustedSettingsMembers.methods.getChallengeCost().call();
		});
	}
}

// Exports
export default DAONodeTrustedSettings;
