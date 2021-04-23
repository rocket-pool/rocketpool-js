// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {
    getNodeEffectiveRPLStake,
    nodeDeposit,
    nodeStakeRPL,
    registerNode,
    setNodeTrusted,
    setNodeWithdrawalAddress
} from '../_helpers/node';
import {mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {
    setDAONetworkBootstrapRewardsClaimer,
    setDAOProtocolBootstrapSetting, setRewardsClaimIntervalBlocks,
    setRPLInflationIntervalBlocks, setRPLInflationIntervalRate,
    setRPLInflationStartBlock
} from '../dao/scenario-dao-protocol-bootstrap';
import {submitPrices} from '../_helpers/network';
import {rewardsClaimersPercTotalGet} from "./scenario-rewards-claim";
import {rewardsClaimNode} from "./scenario-rewards-claim-node";


// Tests
export default function runRewardsTests(web3: Web3, rp: RocketPool) {
    describe('Rewards', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let owner: string;
        let userOne: string;
        let registeredNode1: string;
        let registeredNode2: string;
        let registeredNodeTrusted1: string;
        let registeredNodeTrusted2: string;
        let registeredNodeTrusted3: string;
        let node1WithdrawalAddress: string;
        let daoInvoiceReceipt: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // The testing config
        let claimIntervalBlocks: number = 16;
        // Interval for calculating inflation
        let rewardIntervalBlocks: number = 5

        // Set some RPL inflation scenes
        let rplInflationSetup = async function() {
            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();
            // Starting block for when inflation will begin
            let blockStart = blockCurrent+3;
            // Interval for calculating inflation
            let blockInterval = rewardIntervalBlocks;
            // Yearly inflation target
            let yearlyInflationTarget = 0.05;

            // Set the daily inflation start block
            await setRPLInflationStartBlock(web3, rp, blockStart, { from: owner, gas: gasLimit });
            // Set the daily inflation block count
            await setRPLInflationIntervalBlocks(web3, rp, blockInterval, { from: owner, gas: gasLimit });
            // Set the daily inflation rate
            await setRPLInflationIntervalRate(web3, rp, yearlyInflationTarget, { from: owner, gas: gasLimit });
            // Return the starting block for inflation when it will be available
            return blockStart + blockInterval;
        }

        // Set a rewards claiming contract
        let rewardsContractSetup = async function(_claimContract: string, _claimAmountPerc: number) {
            // Set the amount this contract can claim
            await setDAONetworkBootstrapRewardsClaimer(web3, rp, _claimContract, web3.utils.toWei(_claimAmountPerc.toString(), 'ether'), { from: owner, gas: gasLimit });
            // Set the claim interval blocks
            await setRewardsClaimIntervalBlocks(web3, rp, claimIntervalBlocks, { from: owner, gas: gasLimit });
        }

        before(async () => {

            // Get accounts
            [
                owner, userOne, registeredNode1,
                registeredNode2, registeredNodeTrusted1, registeredNodeTrusted2,
                registeredNodeTrusted3, node1WithdrawalAddress, daoInvoiceReceipt
            ] = await web3.eth.getAccounts();


            // Disable RocketClaimNode claims contract
            await setDAONetworkBootstrapRewardsClaimer(web3, rp,'rocketClaimNode', web3.utils.toWei('0', 'ether'), {from: owner, gas: gasLimit});

            // Register nodes
            await registerNode(web3, rp, {from: registeredNode1, gas: gasLimit});
            await registerNode(web3, rp, {from: registeredNode2, gas: gasLimit});
            await registerNode(web3, rp, {from: registeredNodeTrusted1, gas: gasLimit});
            await registerNode(web3, rp, {from: registeredNodeTrusted2, gas: gasLimit});
            await registerNode(web3, rp, {from: registeredNodeTrusted3, gas: gasLimit});

            // Set node 1 withdrawal address
            await setNodeWithdrawalAddress(web3, rp, node1WithdrawalAddress, {from: registeredNode1, gas: gasLimit});

            // Set nodes as trusted
            await setNodeTrusted(web3, rp, registeredNodeTrusted1, 'saas_1', 'node@home.com', owner);
            await setNodeTrusted(web3, rp, registeredNodeTrusted2, 'saas_2', 'node@home.com', owner);

            // Set max per-minipool stake to 100% and RPL price to 1 ether
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNode', 'node.per.minipool.stake.maximum', web3.utils.toWei('1', 'ether'), {from: owner, gas: gasLimit});
            await submitPrices(web3, rp, 1, web3.utils.toWei('1', 'ether'), {from: registeredNodeTrusted1, gas: gasLimit});
            await submitPrices(web3, rp, 1, web3.utils.toWei('1', 'ether'), {from: registeredNodeTrusted2, gas: gasLimit});

            // Stake RPL against nodes and create minipools to set effective stakes
            await mintRPL(web3, rp, owner, registeredNode1, web3.utils.toWei('32', 'ether'));
            await mintRPL(web3, rp, owner, registeredNode2, web3.utils.toWei('32', 'ether'));
            await nodeStakeRPL(web3, rp, web3.utils.toWei('32', 'ether'), {from: registeredNode1, gas: gasLimit});
            await nodeStakeRPL(web3, rp, web3.utils.toWei('32', 'ether'), {from: registeredNode2, gas: gasLimit});
            await nodeDeposit(web3, rp, {from: registeredNode1, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});
            await nodeDeposit(web3, rp, {from: registeredNode2, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});
            await nodeDeposit(web3, rp, {from: registeredNode2, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});

            // Check node effective stakes
            let node1EffectiveStake = await getNodeEffectiveRPLStake(web3, rp, registeredNode1).then((value: any) => web3.utils.toBN(value));;
            let node2EffectiveStake = await getNodeEffectiveRPLStake(web3, rp, registeredNode2).then((value: any) => web3.utils.toBN(value));;
            assert(node1EffectiveStake.eq(web3.utils.toBN(web3.utils.toWei('16', 'ether'))), 'Incorrect node 1 effective stake');
            assert(node2EffectiveStake.eq(web3.utils.toBN(web3.utils.toWei('32', 'ether'))), 'Incorrect node 2 effective stake');

        });

        it(printTitle('userOne', 'fails to set interval blocks for rewards claim period'), async () => {
            // Set the rewards claims interval in blocks
            await shouldRevert(setRewardsClaimIntervalBlocks(web3, rp, 100, {
                from: userOne,
                gas: gasLimit
            }), 'Non owner set interval blocks for rewards claim period', 'Account is not a temporary guardian');
        });

        it(printTitle('guardian', 'succeeds setting interval blocks for rewards claim period'), async () => {
            // Set the rewards claims interval in blocks
            await setRewardsClaimIntervalBlocks(web3, rp,100, {
                from: owner,
                gas: gasLimit
            });
        });


        it(printTitle('userOne', 'fails to set contract claimer percentage for rewards'), async () => {
            // Set the amount this contract can claim
            await shouldRevert(setDAONetworkBootstrapRewardsClaimer(web3, rp,'myHackerContract', web3.utils.toWei('0.1', 'ether'), {
                from: userOne,
                gas: gasLimit
            }), 'Non owner set contract claimer percentage for rewards', 'Account is not a temporary guardian');
        });

        it(printTitle('guardian', 'set contract claimer percentage for rewards, then update it'), async () => {
            // Set the amount this contract can claim
            await setDAONetworkBootstrapRewardsClaimer(web3, rp,'rocketClaimDAO', web3.utils.toWei('0.0001', 'ether'), {
                from: owner,
                gas: gasLimit
            });
            // Set the amount this contract can claim, then update it
            await setDAONetworkBootstrapRewardsClaimer(web3, rp,'rocketClaimNode', web3.utils.toWei('0.01', 'ether'), {
                from: owner,
                gas: gasLimit
            });
            // Update now
            await setDAONetworkBootstrapRewardsClaimer(web3, rp,'rocketClaimNode', web3.utils.toWei('0.02', 'ether'), {
                from: owner,
                gas: gasLimit
            });
        });

        it(printTitle('guardian', 'set contract claimer percentage for rewards, then update it to zero'), async () => {
            // Get the total current claims amounts
            let totalClaimersPerc = parseFloat(web3.utils.fromWei(await rewardsClaimersPercTotalGet(web3, rp, {
                from: owner,
                gas: gasLimit
            })));
            // Set the amount this contract can claim, then update it
            await setDAONetworkBootstrapRewardsClaimer(web3, rp, 'rocketClaimNode', web3.utils.toWei('0.01', 'ether'), {
                from: owner,
                gas: gasLimit
            });
            // Update now
            await setDAONetworkBootstrapRewardsClaimer(web3, rp, 'rocketClaimNode', web3.utils.toWei('0', 'ether'), {
                from: owner,
                gas: gasLimit
            }, totalClaimersPerc);
        });

        it(printTitle('guardian', 'set contract claimers total percentage to 100%'), async () => {
            // Get the total current claims amounts
            let totalClaimersPerc = parseFloat(web3.utils.fromWei(await rewardsClaimersPercTotalGet(web3, rp, {
                from: owner,
                gas: gasLimit
            })));
            // Get the total % needed to make 100%
            let claimAmount = (1 - totalClaimersPerc).toFixed(4);
            // Set the amount this contract can claim and expect total claimers amount to equal 1 ether (100%)
            await setDAONetworkBootstrapRewardsClaimer(web3, rp, 'rocketClaimNode', web3.utils.toWei(claimAmount.toString(), 'ether'), {
                from: owner,
                gas: gasLimit
            }, 1);
        });

        it(printTitle('guardian', 'fail to set contract claimers total percentage over 100%'), async () => {
            // Get the total current claims amounts
            let totalClaimersPerc = parseFloat(web3.utils.fromWei(await rewardsClaimersPercTotalGet(web3, rp, {
                from: owner,
                gas: gasLimit
            })));
            // Get the total % needed to make 100%
            let claimAmount = ((1 - totalClaimersPerc) + 0.001).toFixed(4);
            // Set the amount this contract can claim and expect total claimers amount to equal 1 ether (100%)
            await shouldRevert(setDAONetworkBootstrapRewardsClaimer(web3, rp, 'rocketClaimNode', web3.utils.toWei(claimAmount.toString(), 'ether'), {
                from: owner,
                gas: gasLimit
            }), "Total claimers percentrage over 100%", 'Claimers cannot total more than 100%');
        });

        it(printTitle('userOne', 'fails to call claim method on rewards pool contract as they are not a registered claimer contract'), async () => {
            // Init rewards pool
            const rocketRewardsPool = await rp.contracts.get('rocketRewardsPool');
            // Try to call the claim method
            await shouldRevert(rocketRewardsPool.methods.claim(userOne, userOne, web3.utils.toWei('0.1')).send({
                from: userOne,
                gas: gasLimit
            }), "Non claimer network contract called claim method", 'Contract not found');
        });


        /*** Regular Nodes **************************/


        it(printTitle('node', 'can claim RPL'), async () => {

            // Initialize RPL inflation & claims contract
            let rplInflationStartBlock = await rplInflationSetup();
            await rewardsContractSetup('rocketClaimNode', 0.5);

            // Move to inflation start plus one claim interval
            let currentBlock = await web3.eth.getBlockNumber();
            assert.isBelow(currentBlock, rplInflationStartBlock, 'Current block should be below RPL inflation start block');
            await mineBlocks(web3, rplInflationStartBlock + claimIntervalBlocks - currentBlock);

            // Claim RPL
            await rewardsClaimNode(web3, rp,{
                from: registeredNode1,
                gas: gasLimit
            });
            await rewardsClaimNode(web3, rp,{
                from: registeredNode2,
                gas: gasLimit
            });

            // Move to next claim interval
            await mineBlocks(web3, claimIntervalBlocks);

            // Claim RPL again
            await rewardsClaimNode(web3, rp,{
                from: registeredNode1,
                gas: gasLimit
            });
            await rewardsClaimNode(web3, rp,{
                from: registeredNode2,
                gas: gasLimit
            });

        });

        it(printTitle('node', 'cannot claim RPL before inflation has begun'), async () => {

            // Initialize claims contract
            await rewardsContractSetup('rocketClaimNode', 0.5);

            // Move ahead one claim interval
            await mineBlocks(web3, claimIntervalBlocks);

            // Attempt to claim RPL
            await shouldRevert(rewardsClaimNode(web3, rp,{
                from: registeredNode1,
                gas: gasLimit
            }), 'Node claimed RPL before RPL inflation began', 'Claiming contract must have an allowance of more than 0');

        });

    });
}
