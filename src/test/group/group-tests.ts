// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { registerGroup } from './group-scenarios';

// Tests
export default function runContractsTests(web3: Web3, rp: RocketPool): void {
    describe('Group', (): void => {


        // Accounts
        let owner: string;
        let groupOwner: string;

        // Group
        let groupName: string;
        let groupId: string;

        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            owner = accounts[0];
            groupOwner = accounts[1];

        });


        // Public methods
        describe('Public', (): void => {

            it('Can register a group', async () => {
                [groupName, groupId] = await registerGroup(web3, rp, {from: groupOwner});
            });

        });


    });
};
