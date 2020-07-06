// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import { takeSnapshot, revertSnapshot } from '../_utils/evm';
import { setNetworkSetting } from '../_helpers/settings';

// Tests
export default function runNetworkTests(web3: Web3, rp: RocketPool) {
    describe('Network', () => {


        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let trustedNode: string;
        let staker: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        before(async () => {

            // Get accounts
            [owner, trustedNode, staker] = await web3.eth.getAccounts();

            // Register node
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode, gas: gasLimit});
            await rp.node.setNodeTrusted(trustedNode, true, {from: owner, gas: gasLimit});

        });


        describe('Balances', () => {

            it('Can get network balances', async () => {

                // Set parameters
                let balancesEpoch = 1;
                let totalEthBalance = web3.utils.toWei('100', 'ether');
                let stakingEthBalance = web3.utils.toWei('90', 'ether');

                // Submit balances
                await rp.network.submitETHBalances(balancesEpoch, totalEthBalance, stakingEthBalance, {from: trustedNode, gas: gasLimit});

                // Get balances
                let [totalEth, stakingEth, epoch, utilizationRate] = await Promise.all([
                    rp.network.getTotalETHBalance(),
                    rp.network.getStakingETHBalance(),
                    rp.network.getETHBalancesEpoch(),
                    rp.network.getETHUtilizationRate(),
                ]);

                // Check balances
                assert(web3.utils.toBN(totalEth).eq(web3.utils.toBN(totalEthBalance)), 'Incorrect total ETH balance');
                assert(web3.utils.toBN(stakingEth).eq(web3.utils.toBN(stakingEthBalance)), 'Incorrect staking ETH balance');
                assert.equal(epoch, balancesEpoch, 'Incorrect balances epoch');
                assert.equal(utilizationRate, 0.9, 'Incorrect ETH utilization rate');

            });

        });


        describe('Fees', () => {

            it('Can get network fees', async () => {

                // Set parameters
                let targetNodeFee = web3.utils.toWei('0.5', 'ether');
                let maximumNodeFee = web3.utils.toWei('1', 'ether');
                let nodeFeeDemandRange = web3.utils.toWei('100', 'ether');

                // Set settings
                await setNetworkSetting(rp, 'TargetNodeFee', targetNodeFee, {from: owner, gas: gasLimit});
                await setNetworkSetting(rp, 'MaximumNodeFee', maximumNodeFee, {from: owner, gas: gasLimit});
                await setNetworkSetting(rp, 'NodeFeeDemandRange', nodeFeeDemandRange, {from: owner, gas: gasLimit});

                // Fill deposit RocketPool
                await rp.deposit.deposit({from: staker, value: nodeFeeDemandRange, gas: gasLimit});

                // Get fees
                let [demand, currentFee, feeByDemand] = await Promise.all([
                    rp.network.getNodeDemand(),
                    rp.network.getNodeFee(),
                    rp.network.getNodeFeeByDemand(web3.utils.toWei('0', 'ether')),
                ]);

                // Check fees
                assert(web3.utils.toBN(demand).eq(web3.utils.toBN(nodeFeeDemandRange)), 'Incorrect node demand');
                assert.equal(currentFee, parseFloat(web3.utils.fromWei(maximumNodeFee, 'ether')), 'Incorrect current node fee');
                assert.equal(feeByDemand, parseFloat(web3.utils.fromWei(targetNodeFee, 'ether')), 'Incorrect node fee by demand');

            });

        });


        describe('Withdrawal', () => {

            it('Can get the withdrawal pool balance', async () => {

                // Set parameters
                let amount = web3.utils.toWei('10', 'ether');

                // Get withdrawal pool address
                let withdrawalAddress = await rp.contracts.address('rocketNetworkWithdrawal');

                // Deposit to withdrawal pool
                await web3.eth.sendTransaction({from: staker, to: withdrawalAddress, value: amount, gas: gasLimit});

                // Get & check balance
                let balance = await rp.network.getWithdrawalBalance();
                assert(web3.utils.toBN(balance).eq(web3.utils.toBN(amount)), 'Incorrect withdrawal pool balance');

            });

        });


    });
};
