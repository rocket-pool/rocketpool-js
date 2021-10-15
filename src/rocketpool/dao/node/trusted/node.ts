// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../../../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../../../utils/transaction";

/**
 * Rocket Pool DAO Trusted Node
 */
class DAONodeTrusted {
	/**
	 * Create a new DAONodeTrusted instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param contracts A Rocket Pool contract manager instance
	 */
	public constructor(private web3: Web3, private contracts: Contracts) {}

	/**
	 * Private accessor use to retrieve the related contract
	 * @returns a Promise<Contract> with a web3.eth.contract instance of the rocketDAONodeTrusted contract
	 */
	private get rocketDAONodeTrusted(): Promise<Contract> {
		return this.contracts.get("rocketDAONodeTrusted");
	}

	/**
	 * Return the member id given an address
	 * @param account A string representing the address you wish to lookup the member id for
	 * @returns a Promise<string> that resolves to a string representing the member id
	 *
	 * @example using Typescript
	 * const account = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * ```ts
	 * const memberID = rp.dao.node.trusted.node.getMemberID(account).then((val: string) => { val };
	 * ```
	 */
	public getMemberID(address: string): Promise<string> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<string> => {
			return rocketDAONodeTrusted.methods.getMemberID(address).call();
		});
	}

	/**
	 * Get the number of DAO Members
	 * @returns a Promise<number> that resolves to a number representing the number of DAO members
	 *
	 * @example using Typescript
	 * ```ts
	 * const memberCount = rp.dao.node.trusted.node.getMemberCount().then((val: number) => { val };
	 * ```
	 */
	public getMemberCount(): Promise<number> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<number> => {
			return rocketDAONodeTrusted.methods.getMemberCount().call();
		});
	}

	/**
	 * Check if Bootstrap Mode is enabled
	 * @returns a Promise<boolean> that resolves to a boolean representing if bootstrap mode is enabled
	 *
	 * @example using Typescript
	 * ```ts
	 * const enabled = rp.dao.node.trusted.node.getBootstrapModeDisabled().then((val: number) => { val };
	 * ```
	 */
	public getBootstrapModeDisabled(): Promise<boolean> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<boolean> => {
			return rocketDAONodeTrusted.methods.getBootstrapModeDisabled().call();
		});
	}

	/**
	 * Get the number of votes needed for a proposal to pass
	 * @returns a Promise<number> that resolves to a number representing the number of votes needed for a proposal to pass
	 *
	 * @example using Typescript
	 * ```ts
	 * const votes = rp.dao.node.trusted.node.getProposalQuorumVotesRequired().then((val: number) => { val };
	 * ```
	 */
	public getProposalQuorumVotesRequired(): Promise<number> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<number> => {
			return rocketDAONodeTrusted.methods.getProposalQuorumVotesRequired().call();
		});
	}

	/**
	 * Check if a member is valid
	 * @param address A string representing the address you wish to check if a member is valid
	 * @returns a Promise<boolean> that resolves to a boolean representing if a member is valid
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const valid = rp.dao.node.trusted.node.getMemberIsValid(address).then((val: boolean) => { val };
	 * ```
	 */
	public getMemberIsValid(address: string): Promise<boolean> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<boolean> => {
			return rocketDAONodeTrusted.methods.getMemberIsValid(address).call();
		});
	}

	/**
	 * Get a member's RPL bond amount
	 * @param address A string representing the address you wish to lookup
	 * @returns a Promise<string> that resolves to a string representing if a member is valid
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const bondAmount = rp.dao.node.trusted.node.getMemberRPLBondAmount(address).then((val: string) => { val };
	 * ```
	 */
	public getMemberRPLBondAmount(address: string): Promise<string> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<string> => {
			return rocketDAONodeTrusted.methods.getMemberRPLBondAmount(address).call();
		});
	}

	/**
	 * Check if a member has been challenged
	 * @param address A string representing the address you wish to lookup
	 * @returns a Promise<boolean> that resolves to a boolean representing if a member is valid
	 *
	 * @example using Typescript
	 * ```ts
	 * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const challenged = rp.dao.node.trusted.node.getMemberRPLBondAmount(address).then((val: boolean) => { val };
	 * ```
	 */
	public getMemberIsChallenged(address: string): Promise<boolean> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<boolean> => {
			return rocketDAONodeTrusted.methods.getMemberIsChallenged(address).call();
		});
	}

	/**
	 * Bootstrap a DAO Member
	 * @param id A string representing the id or name of the member
	 * @param url A string representing the url for the member
	 * @param nodeAddress A string representing the address of the member you are adding
	 * @param options An optional object of web3.eth.Contract SendOptions
	 * @param onConfirmation An optional confirmation handler object
	 * @returns a Promise<TransactionReceipt> that resolves to a TransactionReceipt object representing the receipt of the transaction
	 *
	 * @example using Typescript
	 * ```ts
	 * const id = "kermit";
	 * const url = "https://kermit.xyz";
	 * const guardian = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
	 * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
	 * const options = {
	 *		from: guardian, // bootstrap can only be performed by guardian and if bootstrap mode is enabled
	 *		gas: 1000000
	 * };
	 * const txReceipt = rp.dao.node.trusted.bootstrapMember(id, url, nodeAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
	 * ```
	 */
	public bootstrapMember(
		id: string,
		url: string,
		nodeAddress: string,
		options?: SendOptions,
		onConfirmation?: ConfirmationHandler
	): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrusted.methods.bootstrapMember(id, url, nodeAddress).send(options), onConfirmation);
		});
	}

	// Bootstrap a Boolean Setting
	public bootstrapSettingBool(
		settingContractInstance: string,
		settingPath: string,
		value: boolean,
		options?: SendOptions,
		onConfirmation?: ConfirmationHandler
	): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrusted.methods.bootstrapSettingBool(settingContractInstance, settingPath, value).send(options), onConfirmation);
		});
	}

	// Bootstrap disable
	public bootstrapDisable(value: boolean, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrusted.methods.bootstrapDisable(value).send(options), onConfirmation);
		});
	}

	// Bootstrap disable
	public memberJoinRequired(id: string, url: string, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
		return this.rocketDAONodeTrusted.then((rocketDAONodeTrusted: Contract): Promise<TransactionReceipt> => {
			return handleConfirmations(rocketDAONodeTrusted.methods.memberJoinRequired(id, url).send(options), onConfirmation);
		});
	}
}

// Exports
export default DAONodeTrusted;
