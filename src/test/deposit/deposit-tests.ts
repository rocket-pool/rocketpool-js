// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';

// Tests
export default function runDepositTests(web3: Web3, rp: RocketPool): void {
    describe('Deposit', (): void => {


        // Accounts
        let depositor: string;


        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            depositor = accounts[2];

        });


        // Queued deposits
        describe('Queued Deposits', (): void => {

            // :TODO: implement
            it('Can get a user\'s queued deposits');

        });


    });
};
