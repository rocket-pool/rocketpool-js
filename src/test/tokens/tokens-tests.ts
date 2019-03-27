// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { transferRpl, approveRplTransfer, transferRplFrom } from './tokens-scenarios-rpl';

// Tests
export default function runTokensTests(web3: Web3, rp: RocketPool): void {
    describe('Tokens', (): void => {


        // Accounts
        let owner: string;
        let user1: string;
        let user2: string;
        let user3: string;


        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            owner = accounts[0];
            user1 = accounts[1];
            user2 = accounts[2];
            user3 = accounts[3];

            // Mint tokens
            let rocketPoolToken = await rp.contracts.get('rocketPoolToken');
            await rocketPoolToken.methods.mint(user1, web3.utils.toWei('2', 'ether')).send({from: owner, gas: 8000000});

        });


        // RPL token
        describe('RPL', (): void => {

            it('Can transfer tokens to a recipient', async () => {
                await transferRpl(rp, {from: user1, to: user3, amountWei: web3.utils.toWei('1', 'ether')});
            });

            it('Can approve an allowance for a spender', async () => {
                await approveRplTransfer(rp, {from: user1, spender: user2, amountWei: web3.utils.toWei('1', 'ether')});
            });

            it('Can transfer tokens from an account to a recipient', async () => {
                await transferRplFrom(rp, {from: user2, fromAccount: user1, to: user3, amountWei: web3.utils.toWei('1', 'ether')});
            });

        });


    });
};
