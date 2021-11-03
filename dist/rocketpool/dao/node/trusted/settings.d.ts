import Web3 from "web3";
import Contracts from "../../../contracts/contracts";
/**
 * Rocket Pool DAO Trusted Node Settings
 */
declare class DAONodeTrustedSettings {
    private web3;
    private contracts;
    /**
     * Create a new DAONodeTrustedSettings instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAONodeTrustedSettingsProposals contract
     */
    private get rocketDAONodeTrustedSettingsProposals();
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAONodeTrustedSettingsMembers contract
     */
    private get rocketDAONodeTrustedSettingsMembers();
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsDeposit contract
     */
    private get rocketDAOProtocolSettingsDeposit();
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsMinipool contract
     */
    private get rocketDAOProtocolSettingsMinipool();
    /**
     * Get the maximum deposit assignments
     * @returns a Promise<string\> that resolves to a string representing the maximum deposit assignments
     *
     * @example using Typescript
     * ```ts
     * const maxDepositsAssignments = rp.dao.node.trusted.getMaximumDepositAssignments().then((val: string) => { val };
     * ```
     */
    getMaximumDepositAssignments(): Promise<string>;
    /**
     * Get the cost of a challenge (How much it costs a non-member to challenge a members node. It's free for current members to challenge other members.)
     * @returns a Promise<string\> that resolves to a string representing the inflation intervals that have passed (in time)
     *
     * @example using Typescript
     * ```ts
     * const maxDepositsAssignments = rp.dao.node.trusted.getMaximumDepositAssignments().then((val: string) => { val };
     * ```
     */
    getChallengeCost(): Promise<string>;
}
export default DAONodeTrustedSettings;
