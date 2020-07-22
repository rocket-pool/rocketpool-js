// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import { getValidatorPubkey } from '../_utils/beacon';
import { takeSnapshot, revertSnapshot } from '../_utils/evm';
import { createMinipool, stakeMinipool } from '../_helpers/minipool';
import { setMinipoolSetting } from '../_helpers/settings';
import { burnNeth } from './scenario-burn-neth';
import { burnReth } from './scenario-burn-reth';
import { transfer } from './scenario-transfer';
import { transferFrom } from './scenario-transfer-from';

// Tests
export default function runNodeTests(web3: Web3, rp: RocketPool) {
    describe('Tokens', () => {


        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let node: string;
        let trustedNode: string;
        let staker: string;
        let random: string;


        // Minipool validator keys
        const minipoolPubkey = getValidatorPubkey();


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        let nodeDepositAmount = web3.utils.toWei('16', 'ether');
        let userDepositAmount = web3.utils.toWei('16', 'ether');
        let withdrawalAmount = web3.utils.toWei('32', 'ether');
        before(async () => {

            // Get accounts
            [owner, node, trustedNode, staker, random] = await web3.eth.getAccounts();

            // Set settings
            await setMinipoolSetting(rp, 'WithdrawalDelay', 0, {from: owner, gas: gasLimit});

            // Register nodes
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode, gas: gasLimit});
            await rp.node.setNodeTrusted(trustedNode, true, {from: owner, gas: gasLimit});

            // Create minipool
            let minipool = (await createMinipool(web3, rp, {from: node, value: nodeDepositAmount, gas: gasLimit}) as MinipoolContract);

            // Deposit to minipool
            await rp.deposit.deposit({from: staker, value: userDepositAmount, gas: gasLimit});

            // Stake and withdraw from minipool
            await stakeMinipool(web3, rp, minipool, minipoolPubkey, {from: node, gas: gasLimit});
            await rp.minipool.submitMinipoolWithdrawable(minipool.address, withdrawalAmount, 0, 1, 0, {from: trustedNode, gas: gasLimit});
            await minipool.withdraw({from: node, gas: gasLimit});

            // Process minipool withdrawal
            let withdrawalAddress = await rp.contracts.address('rocketNetworkWithdrawal');
            await web3.eth.sendTransaction({from: owner, to: withdrawalAddress, value: withdrawalAmount, gas: gasLimit});
            await rp.network.processWithdrawal(minipoolPubkey, {from: trustedNode, gas: gasLimit});

            // Set network balances
            await rp.network.submitETHBalances(1, userDepositAmount, userDepositAmount, {from: trustedNode, gas: gasLimit});

        });


        describe('Tokens', () => {

            it('Can get token balance', async () => {

                // Get & check balance
                let rethBalance = await rp.tokens.reth.balanceOf(staker);
                assert(web3.utils.toBN(rethBalance).eq(web3.utils.toBN(userDepositAmount)), 'Incorrect token balance');

            });

            it('Can get token transfer allowance', async () => {

                // Set allowance
                await rp.tokens.reth.approve(random, userDepositAmount, {from: staker, gas: gasLimit});

                // Get & check allowance
                let allowance = await rp.tokens.reth.allowance(staker, random);
                assert(web3.utils.toBN(allowance).eq(web3.utils.toBN(userDepositAmount)), 'Incorrect token allowance');

            });

            it('Can transfer tokens', async () => {
                await transfer(web3, rp.tokens.reth, staker, random, userDepositAmount, gasLimit);
            });

            it('Can transfer tokens from an address', async () => {
                await transferFrom(web3, rp.tokens.reth, staker, random, userDepositAmount, gasLimit);
            });

        });


        describe('nETH', () => {

            it('Can burn nETH for ETH', async () => {
                await burnNeth(web3, rp, nodeDepositAmount, {
                    from: node,
                    gas: gasLimit,
                });
            });

        });


        describe('rETH', () => {

            it('Can get the ETH exchange rate', async () => {

                // Get & check rate
                let exchangeRate = await rp.tokens.reth.getExchangeRate();
                assert.equal(exchangeRate, 1, 'Incorrect rETH exchange rate');

            });

            it('Can get the collateralization rate', async () => {

                // Get & check rate
                let collateralRate = await rp.tokens.reth.getCollateralRate();
                assert.equal(collateralRate, 1, 'Incorrect rETH contract collateralization rate');

            });

            it('Can burn rETH for ETH', async () => {
                await burnReth(web3, rp, userDepositAmount, {
                    from: staker,
                    gas: gasLimit,
                });
            });

        });


    });
}
