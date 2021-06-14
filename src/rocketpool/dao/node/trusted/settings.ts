// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Contracts from '../../../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../../../utils/transaction';


/**
 * Rocket Pool DAO Trusted Node Settings
 */
class DAONodeTrustedSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDAONodeTrustedSettingsProposals(): Promise<Contract> {
        return this.contracts.get('rocketDAONodeTrustedSettingsProposals');
    }


    private get rocketDAONodeTrustedSettingsMembers(): Promise<Contract> {
        return this.contracts.get('rocketDAONodeTrustedSettingsMembers');
    }


    private get rocketDAOProtocolSettingsDeposit(): Promise<Contract> {
        return this.contracts.get('rocketDAOProtocolSettingsDeposit');
    }


    private get rocketDAOProtocolSettingsMinipool(): Promise<Contract> {
        return this.contracts.get('rocketDAOProtocolSettingsMinipool');
    }


    /**
     * Getters
     */
    // Get member id given an address
    public getMaximumDepositAssignments(): Promise<string> {
        return this.rocketDAOProtocolSettingsDeposit.then((rocketDAOProtocolSettingsDeposit: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsDeposit.methods.getMaximumDepositAssignments().call();
        });
    }


    // How much it costs a non-member to challenge a members node. It's free for current members to challenge other members.
    public getChallengeCost(): Promise<string> {
        return this.rocketDAONodeTrustedSettingsMembers.then((rocketDAONodeTrustedSettingsMembers: Contract): Promise<string> => {
            return rocketDAONodeTrustedSettingsMembers.methods.getChallengCost().call();
        });
    }


    /**
     * Mutators - Public
     */



}


// Exports
export default DAONodeTrustedSettings;
