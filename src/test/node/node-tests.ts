// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { registerNode } from './node-scenarios';

// Tests
export default function runNodeTests(web3: Web3, rp: RocketPool): void {
    describe('Node', (): void => {


        // Accounts
        let owner: string;


        // Node details
        let nodeOwner: string;
        let nodeContract: string;


        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            owner = accounts[0];

        });


        // Node registration
        describe('Registration', (): void => {

            it('Can register a node', async () => {
                [nodeOwner, nodeContract] = await registerNode(web3, rp, {owner});
            });

        });


    });
};
