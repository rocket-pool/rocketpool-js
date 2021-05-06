// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {getNodeEffectiveRPLStake, getNodeMinimumRPLStake, getNodeRPLStake, nodeDeposit, nodeStakeRPL, registerNode, setNodeTrusted, setNodeWithdrawalAddress} from '../_helpers/node';
import {mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {setDAONetworkBootstrapRewardsClaimer, setDAOProtocolBootstrapSetting, setRewardsClaimIntervalBlocks, setRPLInflationIntervalBlocks, setRPLInflationIntervalRate, setRPLInflationStartBlock, spendRewardsClaimTreasury} from '../dao/scenario-dao-protocol-bootstrap';
import {submitPrices} from '../_helpers/network';
import {rewardsClaimersPercTotalGet} from "./scenario-rewards-claim";
import {rewardsClaimNode} from "./scenario-rewards-claim-node";
import {rewardsClaimTrustedNode} from "./scenario-rewards-claim-trusted-node";
import {getRewardsDAOTreasuryBalance, rewardsClaimDAO} from "./scenario-rewards-claim-dao";


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
        let daoInvoiceRecipient: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // The testing config
        let claimIntervalBlocks: number = 16;
        // Interval for calculating inflation
        let rewardIntervalBlocks: number = 5;

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
                registeredNodeTrusted3, node1WithdrawalAddress, daoInvoiceRecipient
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
            await setNodeWithdrawalAddress(web3, rp, registeredNode1, node1WithdrawalAddress, {from: registeredNode1, gas: gasLimit});

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
            let node1EffectiveStake = await getNodeEffectiveRPLStake(web3, rp, registeredNode1).then((value: any) => web3.utils.toBN(value));
            let node2EffectiveStake = await getNodeEffectiveRPLStake(web3, rp, registeredNode2).then((value: any) => web3.utils.toBN(value));
            assert(node1EffectiveStake.eq(web3.utils.toBN(web3.utils.toWei('16', 'ether'))), 'Incorrect node 1 effective stake');
            assert(node2EffectiveStake.eq(web3.utils.toBN(web3.utils.toWei('32', 'ether'))), 'Incorrect node 2 effective stake');

        });

        // it(printTitle('userOne', 'fails to set interval blocks for rewards claim period'), async () => {
        //     // Set the rewards claims interval in blocks
        //     await shouldRevert(setRewardsClaimIntervalBlocks(web3, rp, 100, {
        //         from: userOne,
        //         gas: gasLimit
        //     }), 'Non owner set interval blocks for rewards claim period', 'Account is not a temporary guardian');
        // });
        //
        // it(printTitle('guardian', 'succeeds setting interval blocks for rewards claim period'), async () => {
        //     // Set the rewards claims interval in blocks
        //     await setRewardsClaimIntervalBlocks(web3, rp,100, {
        //         from: owner,
        //         gas: gasLimit
        //     });
        // });
        //
        //
        // it(printTitle('userOne', 'fails to set contract claimer percentage for rewards'), async () => {
        //     // Set the amount this contract can claim
        //     await shouldRevert(setDAONetworkBootstrapRewardsClaimer(web3, rp,'myHackerContract', web3.utils.toWei('0.1', 'ether'), {
        //         from: userOne,
        //         gas: gasLimit
        //     }), 'Non owner set contract claimer percentage for rewards', 'Account is not a temporary guardian');
        // });
        //
        // it(printTitle('guardian', 'set contract claimer percentage for rewards, then update it'), async () => {
        //     // Set the amount this contract can claim
        //     await setDAONetworkBootstrapRewardsClaimer(web3, rp,'rocketClaimDAO', web3.utils.toWei('0.0001', 'ether'), {
        //         from: owner,
        //         gas: gasLimit
        //     });
        //     // Set the amount this contract can claim, then update it
        //     await setDAONetworkBootstrapRewardsClaimer(web3, rp,'rocketClaimNode', web3.utils.toWei('0.01', 'ether'), {
        //         from: owner,
        //         gas: gasLimit
        //     });
        //     // Update now
        //     await setDAONetworkBootstrapRewardsClaimer(web3, rp,'rocketClaimNode', web3.utils.toWei('0.02', 'ether'), {
        //         from: owner,
        //         gas: gasLimit
        //     });
        // });
        //
        // it(printTitle('guardian', 'set contract claimer percentage for rewards, then update it to zero'), async () => {
        //     // Get the total current claims amounts
        //     let totalClaimersPerc = parseFloat(web3.utils.fromWei(await rewardsClaimersPercTotalGet(web3, rp, {
        //         from: owner,
        //         gas: gasLimit
        //     })));
        //     // Set the amount this contract can claim, then update it
        //     await setDAONetworkBootstrapRewardsClaimer(web3, rp, 'rocketClaimNode', web3.utils.toWei('0.01', 'ether'), {
        //         from: owner,
        //         gas: gasLimit
        //     });
        //     // Update now
        //     await setDAONetworkBootstrapRewardsClaimer(web3, rp, 'rocketClaimNode', web3.utils.toWei('0', 'ether'), {
        //         from: owner,
        //         gas: gasLimit
        //     }, totalClaimersPerc);
        // });
        //
        // it(printTitle('guardian', 'set contract claimers total percentage to 100%'), async () => {
        //     // Get the total current claims amounts
        //     let totalClaimersPerc = parseFloat(web3.utils.fromWei(await rewardsClaimersPercTotalGet(web3, rp, {
        //         from: owner,
        //         gas: gasLimit
        //     })));
        //     // Get the total % needed to make 100%
        //     let claimAmount = (1 - totalClaimersPerc).toFixed(4);
        //     // Set the amount this contract can claim and expect total claimers amount to equal 1 ether (100%)
        //     await setDAONetworkBootstrapRewardsClaimer(web3, rp, 'rocketClaimNode', web3.utils.toWei(claimAmount.toString(), 'ether'), {
        //         from: owner,
        //         gas: gasLimit
        //     }, 1);
        // });
        //
        // it(printTitle('guardian', 'fail to set contract claimers total percentage over 100%'), async () => {
        //     // Get the total current claims amounts
        //     let totalClaimersPerc = parseFloat(web3.utils.fromWei(await rewardsClaimersPercTotalGet(web3, rp, {
        //         from: owner,
        //         gas: gasLimit
        //     })));
        //     // Get the total % needed to make 100%
        //     let claimAmount = ((1 - totalClaimersPerc) + 0.001).toFixed(4);
        //     // Set the amount this contract can claim and expect total claimers amount to equal 1 ether (100%)
        //     await shouldRevert(setDAONetworkBootstrapRewardsClaimer(web3, rp, 'rocketClaimNode', web3.utils.toWei(claimAmount.toString(), 'ether'), {
        //         from: owner,
        //         gas: gasLimit
        //     }), "Total claimers percentrage over 100%", 'Claimers cannot total more than 100%');
        // });
        //
        // it(printTitle('userOne', 'fails to call claim method on rewards pool contract as they are not a registered claimer contract'), async () => {
        //     // Init rewards pool
        //     const rocketRewardsPool = await rp.contracts.get('rocketRewardsPool');
        //     // Try to call the claim method
        //     await shouldRevert(rocketRewardsPool.methods.claim(userOne, userOne, web3.utils.toWei('0.1')).send({
        //         from: userOne,
        //         gas: gasLimit
        //     }), "Non claimer network contract called claim method", 'Contract not found');
        // });


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

        // it(printTitle('node', 'cannot claim RPL before inflation has begun'), async () => {
        //
        //     // Initialize claims contract
        //     await rewardsContractSetup('rocketClaimNode', 0.5);
        //
        //     // Move ahead one claim interval
        //     await mineBlocks(web3, claimIntervalBlocks);
        //
        //     // Attempt to claim RPL
        //     await shouldRevert(rewardsClaimNode(web3, rp,{
        //         from: registeredNode1,
        //         gas: gasLimit
        //     }), 'Node claimed RPL before RPL inflation began', 'Claiming contract must have an allowance of more than 0');
        //
        // });
        //
        // it(printTitle('node', 'cannot claim RPL while the node claim contract is disabled'), async () => {
        //
        //     // Initialize RPL inflation & claims contract
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     await rewardsContractSetup('rocketClaimNode', 0.5);
        //
        //     // Move to inflation start plus one claim interval
        //     let currentBlock = await web3.eth.getBlockNumber();
        //     assert.isBelow(currentBlock, rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     await mineBlocks(web3, rplInflationStartBlock + claimIntervalBlocks - currentBlock);
        //
        //     // Disable RocketClaimNode claims contract
        //     await setDAONetworkBootstrapRewardsClaimer(web3, rp,'rocketClaimNode', web3.utils.toWei('0', 'ether'), {from: owner, gas: gasLimit});
        //
        //     // Attempt to claim RPL
        //     await shouldRevert(rewardsClaimNode(web3, rp, {
        //         from: registeredNode1,
        //         gas: gasLimit
        //     }), 'Node claimed RPL while node claim contract was disabled', 'The node is currently unable to claim');
        //
        // });
        //
        // it(printTitle('node', 'cannot claim RPL twice in the same interval'), async () => {
        //
        //     // Initialize RPL inflation & claims contract
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     await rewardsContractSetup('rocketClaimNode', 0.5);
        //
        //     // Move to inflation start plus one claim interval
        //     let currentBlock = await web3.eth.getBlockNumber();
        //     assert.isBelow(currentBlock, rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     await mineBlocks(web3, rplInflationStartBlock + claimIntervalBlocks - currentBlock);
        //
        //     // Claim RPL
        //     await rewardsClaimNode(web3, rp,{
        //         from: registeredNode1,
        //         gas: gasLimit
        //     });
        //
        //     // Attempt to claim RPL again
        //     await shouldRevert(rewardsClaimNode(web3, rp,{
        //         from: registeredNode1,
        //         gas: gasLimit
        //     }), 'Node claimed RPL twice in the same interval', 'Claimer is not entitled to tokens, they have already claimed in this interval or they are claiming more rewards than available to this claiming contract.');
        //
        // });
        //
        // it(printTitle('node', 'cannot claim RPL while their node is undercollateralized'), async () => {
        //
        //     // Initialize RPL inflation & claims contract
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     await rewardsContractSetup('rocketClaimNode', 0.5);
        //
        //     // Move to inflation start plus one claim interval
        //     let currentBlock = await web3.eth.getBlockNumber();
        //     assert.isBelow(currentBlock, rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     await mineBlocks(web3, rplInflationStartBlock + claimIntervalBlocks - currentBlock);
        //
        //     // Decrease RPL price to undercollateralize node
        //     await submitPrices(web3, rp, 10, web3.utils.toWei('0.01', 'ether'), {from: registeredNodeTrusted1, gas: gasLimit});
        //     await submitPrices(web3, rp, 10, web3.utils.toWei('0.01', 'ether'), {from: registeredNodeTrusted2, gas: gasLimit});
        //
        //     // Get & check node's current and minimum RPL stakes
        //     let [currentRplStake, minimumRplStake] = await Promise.all([
        //         getNodeRPLStake(web3, rp, registeredNode1).then((value: any) => web3.utils.toBN(value)),
        //         getNodeMinimumRPLStake(web3, rp, registeredNode1).then((value: any) => web3.utils.toBN(value))
        //     ]);
        //     assert(currentRplStake.lt(minimumRplStake), 'Node\'s current RPL stake should be below their minimum RPL stake');
        //
        //     // Attempt to claim RPL
        //     await shouldRevert(rewardsClaimNode(web3, rp, {
        //         from: registeredNode1, gas: gasLimit,
        //     }), 'Node claimed RPL while undercollateralized', 'The node is currently unable to claim');
        //
        // });
        //
        // /*** Trusted Node **************************/
        //
        // it(printTitle('trustedNode1', 'fails to call claim before RPL inflation has begun'), async () => {
        //     // Setup RPL inflation for occuring every 10 blocks at 5%
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     // Init this claiming contract on the rewards pool
        //     await rewardsContractSetup('rocketClaimTrustedNode', 0.5);
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //     // Can this trusted node claim before there is any inflation available?
        //     assert(blockCurrent < rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     // Now make sure we can't claim yet
        //     await shouldRevert(rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
        //         from: registeredNodeTrusted1,
        //         gas: gasLimit
        //     }), "Made claim before RPL inflation started", "This trusted node is not able to claim yet and must wait until a full claim interval passes");
        // });
        //
        // it(printTitle('trustedNode1', 'makes a claim, then fails to make another in the same claim interval'), async () => {
        //     // Setup RPL inflation for occuring every 10 blocks at 5%
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     // Init this claiming contract on the rewards pool
        //     await rewardsContractSetup('rocketClaimTrustedNode', 0.1);
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //     // Can this trusted node claim before there is any inflation available?
        //     assert(blockCurrent < rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     // Move to start of RPL inflation and ahead one claim interval
        //     await mineBlocks(web3, (rplInflationStartBlock-blockCurrent)+claimIntervalBlocks);
        //     // Make a claim now
        //     await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
        //         from: registeredNodeTrusted1,
        //         gas: gasLimit
        //     });
        //     // Should fail
        //     await shouldRevert(rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
        //         from: registeredNodeTrusted1,
        //         gas: gasLimit
        //     }), "Made claim again before next interval", "Claimer is not entitled to tokens, they have already claimed in this interval or they are claiming more rewards than available to this claiming contract");
        // });
        //
        // it(printTitle('trustedNode3', 'fails to claim rewards as they have not waited one claim interval'), async () => {
        //     // Setup RPL inflation for occuring every 10 blocks at 5%
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     // Init this claiming contract on the rewards pool
        //     await rewardsContractSetup('rocketClaimTrustedNode', 0.15);
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //     // Can this trusted node claim before there is any inflation available?
        //     assert(blockCurrent < rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     // Move to start of RPL inflation
        //     await mineBlocks(web3, rplInflationStartBlock-blockCurrent);
        //     // Make node 4 trusted now
        //     await setNodeTrusted(web3, rp, registeredNodeTrusted3, 'saas_3', 'node@home.com', owner);
        //     // Get the current block
        //     blockCurrent = await web3.eth.getBlockNumber();
        //     // Make a claim now
        //     await shouldRevert(rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted3, {
        //         from: registeredNodeTrusted3,
        //         gas: gasLimit
        //     }), "Made claim before next interval", "This trusted node is not able to claim yet and must wait until a full claim interval passes");
        // });
        //
        // it(printTitle('trustedNode1', 'fails to make a claim when trusted node contract claim perc is set to 0'), async () => {
        //     // Setup RPL inflation for occuring every 10 blocks at 5%
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     // Init this claiming contract on the rewards pool
        //     await rewardsContractSetup('rocketClaimTrustedNode', 0);
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //     // Can this trusted node claim before there is any inflation available?
        //     assert(blockCurrent < rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     // Move to start of RPL inflation and ahead one claim interval
        //     await mineBlocks(web3, (rplInflationStartBlock-blockCurrent)+claimIntervalBlocks);
        //     // Make a claim now
        //     await shouldRevert(rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
        //         from: registeredNodeTrusted1,
        //         gas: gasLimit
        //     }), "Made claim again before next interval", "This trusted node is not able to claim yet and must wait until a full claim interval passes");
        // });
        //
        // it(printTitle('trustedNode1+4', 'trusted node 1 makes a claim after RPL inflation has begun and newly registered trusted node 4 claim in next interval'), async () => {
        //     // Setup RPL inflation for occuring every 10 blocks at 5%
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     // Init this claiming contract on the rewards pool
        //     await rewardsContractSetup('rocketClaimTrustedNode', 0.0123);
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //     // Can this trusted node claim before there is any inflation available?
        //     assert(blockCurrent < rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     // Move to start of RPL inflation
        //     await mineBlocks(web3, (rplInflationStartBlock-blockCurrent)+claimIntervalBlocks);
        //     // Make a claim now
        //     await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
        //         from: registeredNodeTrusted1,
        //         gas: gasLimit
        //     });
        //     // Make node 3 trusted now
        //     await setNodeTrusted(web3, rp, registeredNodeTrusted3, 'saas_3', 'node@home.com', owner);
        //     // Move to next claim interval
        //     await mineBlocks(web3, claimIntervalBlocks);
        //     // Attempt claim in the next interval
        //     await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted3, {
        //         from: registeredNodeTrusted3,
        //         gas: gasLimit
        //     });
        // });
        //
        // it(printTitle('trustedNode1+2+3', 'trusted node 1 makes a claim after RPL inflation has begun, claim rate is changed, then trusted node 2 makes a claim and newly registered trusted node 3 claim in next interval'), async () => {
        //     // Setup RPL inflation for occuring every 10 blocks at 5%
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     // Set the contracts perc it can claim 1 =100%
        //     let claimPercOrig = 0.1;
        //     // Init this claiming contract on the rewards pool
        //     await rewardsContractSetup('rocketClaimTrustedNode', claimPercOrig);
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //     // Can this trusted node claim before there is any inflation available?
        //     assert(blockCurrent < rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     // Move to start of RPL inflation
        //     await mineBlocks(web3, (rplInflationStartBlock-blockCurrent)+claimIntervalBlocks);
        //     // Make a claim now
        //     await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted1, {
        //         from: registeredNodeTrusted1,
        //         gas: gasLimit
        //     });
        //     // Change inflation rate now, should only kick in on the next interval
        //     let claimPercChange = 0.2;
        //     // Update it
        //     await rewardsContractSetup('rocketClaimTrustedNode', claimPercChange);
        //     // Make a claim now and pass it the expected contract claim percentage
        //     await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted2, {
        //         from: registeredNodeTrusted2,
        //         gas: gasLimit
        //     });
        //     // Make node 3 trusted now
        //     await setNodeTrusted(web3, rp, registeredNodeTrusted3, 'saas_3', 'node@home.com', owner);
        //     // Move to 2 claim intervals ahead
        //     await mineBlocks(web3, claimIntervalBlocks+claimIntervalBlocks);
        //     // Attempt claim in the next interval with new inflation rate
        //     await rewardsClaimTrustedNode(web3, rp, registeredNodeTrusted3, {
        //         from: registeredNodeTrusted3,
        //         gas: gasLimit
        //     });
        // });
        //
        // /*** DAO ***************************/
        // it(printTitle('daoClaim', 'trusted node makes a claim and the DAO receives its automatic share of rewards correctly on its claim contract, then protocol DAO spends some'), async () => {
        //     // Setup RPL inflation for occuring every 10 blocks at 5%
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     // Init this claiming contract on the rewards pool
        //     await rewardsContractSetup('rocketClaimTrustedNode', 0.1);
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //     // Can this trusted node claim before there is any inflation available?
        //     assert(blockCurrent < rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     // Move to start of RPL inflation and ahead a few claim intervals to simulate some being missed
        //     await mineBlocks(web3, (rplInflationStartBlock-blockCurrent)+(claimIntervalBlocks*3));
        //     // Make a claim now from a trusted node and verify the DAO collected it's perc
        //     await rewardsClaimDAO(web3, rp, {
        //         from: registeredNodeTrusted1,
        //         gas: gasLimit
        //     });
        //     // Make a claim now from another trusted node
        //     await rewardsClaimDAO(web3, rp, {
        //         from: registeredNodeTrusted2,
        //         gas: gasLimit
        //     });
        //     // Get the balance of the DAO treasury and spend it
        //     let daoTreasuryBalance = await getRewardsDAOTreasuryBalance(web3, rp, { from: registeredNodeTrusted1, gas: gasLimit});
        //     // Now spend some via the protocol DAO in bootstrap mode
        //     await spendRewardsClaimTreasury(web3, rp, 'invoice123', daoInvoiceRecipient, daoTreasuryBalance, {
        //         from: owner,
        //         gas: gasLimit
        //     })
        // });
        //
        // it(printTitle('daoClaim', 'trusted node makes a claim and the DAO receives its automatic share of rewards correctly on its claim contract, then fails to spend more than it has'), async () => {
        //     // Setup RPL inflation for occuring every 10 blocks at 5%
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     // Init this claiming contract on the rewards pool
        //     await rewardsContractSetup('rocketClaimTrustedNode', 0.1);
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //     // Can this trusted node claim before there is any inflation available?
        //     assert(blockCurrent < rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     // Move to start of RPL inflation and ahead a few claim intervals to simulate some being missed
        //     await mineBlocks(web3, (rplInflationStartBlock-blockCurrent)+(claimIntervalBlocks*3));
        //     // Make a claim now from another trusted node
        //     await rewardsClaimDAO(web3, rp,{
        //         from: registeredNodeTrusted2,
        //         gas: gasLimit
        //     });
        //     // Get the balance of the DAO treasury and spend it
        //     let daoTreasuryBalance = await getRewardsDAOTreasuryBalance(web3, rp, {
        //         from: registeredNodeTrusted2,
        //         gas: gasLimit
        //     });
        //     // Now spend some via the protocol DAO in bootstrap mode
        //     await shouldRevert(spendRewardsClaimTreasury(web3, rp, 'invoice123', daoInvoiceRecipient, daoTreasuryBalance+"1", {
        //         from: owner,
        //         gas: gasLimit
        //     }), "Protocol DAO spent more RPL than it had in its treasury", "You cannot send 0 RPL or more than the DAO has in its account");
        // });
        //
        // it(printTitle('daoClaim', 'trusted node make a claim and the DAO claim rate is set to 0, trusted node makes another 2 claims'), async () => {
        //     // Setup RPL inflation for occuring every 10 blocks at 5%
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     // Init this claiming contract on the rewards pool
        //     await rewardsContractSetup('rocketClaimTrustedNode', 0.1);
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //     // Can this trusted node claim before there is any inflation available?
        //     assert(blockCurrent < rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     // Move to start of RPL inflation and ahead a few claim intervals to simulate some being missed
        //     await mineBlocks(web3, (rplInflationStartBlock-blockCurrent)+claimIntervalBlocks);
        //     // Make a claim now from a trusted node and verify the DAO collected it's perc
        //     await rewardsClaimDAO(web3, rp, {
        //         from: registeredNodeTrusted1,
        //         gas: gasLimit
        //     });
        //     // Forward to next interval, set claim amount to 0, should kick in the interval after next
        //     await rewardsContractSetup('rocketClaimDAO', 0);
        //     // Make a claim now from another trusted node
        //     await rewardsClaimDAO(web3, rp, {
        //         from: registeredNodeTrusted2,
        //         gas: gasLimit
        //     });
        //     await rewardsContractSetup('rocketClaimTrustedNode', 0.2);
        //     // Next interval
        //     await mineBlocks(web3, claimIntervalBlocks);
        //     // Make another claim, dao shouldn't receive anything
        //     await rewardsClaimDAO (web3, rp, {
        //         from: registeredNodeTrusted2,
        //         gas: gasLimit
        //     });
        // });
        //
        // it(printTitle('daoClaim', 'trusted nodes make multiples claims, rewards sent to dao claims contract, DAO rewards address is set and next claims send its balance to its rewards address'), async () => {
        //     // Setup RPL inflation for occuring every 10 blocks at 5%
        //     let rplInflationStartBlock = await rplInflationSetup();
        //     // Init this claiming contract on the rewards pool
        //     await rewardsContractSetup('rocketClaimTrustedNode', 0.1);
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //     // Can this trusted node claim before there is any inflation available?
        //     assert(blockCurrent < rplInflationStartBlock, 'Current block should be below RPL inflation start block');
        //     // Move to start of RPL inflation and ahead one claim interval
        //     await mineBlocks(web3, (rplInflationStartBlock-blockCurrent)+claimIntervalBlocks);
        //     // Make a claim now from a trusted node and verify the DAO collected it's perc
        //     await rewardsClaimDAO(web3, rp,{
        //         from: registeredNodeTrusted1,
        //         gas: gasLimit
        //     });
        //     await rewardsClaimDAO(web3, rp,{
        //         from: registeredNodeTrusted2,
        //         gas: gasLimit
        //     });
        //     // Next interval
        //     await mineBlocks(web3, claimIntervalBlocks);
        //     // Node claim again
        //     await rewardsClaimDAO(web3, rp,{
        //         from: registeredNodeTrusted1,
        //         gas: gasLimit
        //     });
        //     // Node claim again
        //     await rewardsClaimDAO(web3, rp,{
        //         from: registeredNodeTrusted2,
        //         gas: gasLimit
        //     });
        // });

    });
}
