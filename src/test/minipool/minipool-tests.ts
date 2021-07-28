// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {createMinipool, getMinipoolMinimumRPLStake, stakeMinipool} from '../_helpers/minipool';
import {close} from './scenario-close';
import {dissolve} from './scenario-dissolve';
import {refund } from './scenario-refund';
import {stake} from './scenario-stake';
import {withdrawValidatorBalance} from './scenario-withdraw-validator-balance';
import {withdraw} from './scenario-withdraw';
import {nodeStakeRPL, setNodeTrusted, setNodeWithdrawalAddress} from '../_helpers/node';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {userDeposit} from '../_helpers/deposit';
import {mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {getValidatorPubkey} from '../_utils/beacon';
import {getNetworkSetting} from "../_helpers/settings";
import {getNodeFee} from "../_helpers/network";

// Tests
export default function runMinipoolTests(web3: Web3, rp: RocketPool) {
    describe('Minipool', () => {

        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let node: string;
        let nodeWithdrawalAddress: string;
        let trustedNode: string;
        let dummySwc: string;
        let random: string;

        // Minipool validator keys
        const stakingMinipoolPubkey = getValidatorPubkey();
        const withdrawableMinipoolPubkey = getValidatorPubkey();


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        let launchTimeout = 20;
        let withdrawalDelay = 20;
        let initializedMinipool: MinipoolContract;
        let prelaunchMinipool: MinipoolContract;
        let prelaunchMinipool2: MinipoolContract;
        let stakingMinipool: MinipoolContract;
        let withdrawableMinipool: MinipoolContract;
        let dissolvedMinipool: MinipoolContract;
        let withdrawalBalance = web3.utils.toWei('36', 'ether');
        let withdrawableMinipoolStartBalance = web3.utils.toWei('32', 'ether');
        let withdrawableMinipoolEndBalance = web3.utils.toWei('36', 'ether');
        before(async () => {

            // Get accounts
            [owner, node, nodeWithdrawalAddress, trustedNode, dummySwc, random] = await web3.eth.getAccounts();

            // Register node & set withdrawal address
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});
            await setNodeWithdrawalAddress(web3, rp, node, nodeWithdrawalAddress, {from: node, gas: gasLimit});

            // Register trusted node
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode, 'saas_1', 'node@home.com', owner);

            // Set settings
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsMinipool', 'minipool.launch.timeout', launchTimeout, {from: owner, gas: gasLimit});
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsMinipool', 'minipool.withdrawal.delay', withdrawalDelay, {from: owner, gas: gasLimit});

            // Make user deposit to refund first prelaunch minipool
            let refundAmount = web3.utils.toWei('16', 'ether');
            await userDeposit(web3, rp, {from: random, value: refundAmount, gas: gasLimit});

            // Stake RPL to cover minipools
            let minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
            let rplStake = minipoolRplStake.mul(web3.utils.toBN(6));
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node, gas: gasLimit});

            // Create minipools
            prelaunchMinipool = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('32', 'ether'), gas: gasLimit}) as MinipoolContract);
            prelaunchMinipool2 = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('32', 'ether'), gas: gasLimit}) as MinipoolContract);
            stakingMinipool = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('32', 'ether'), gas: gasLimit}) as MinipoolContract);
            withdrawableMinipool = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('32', 'ether'), gas: gasLimit}) as MinipoolContract);
            initializedMinipool = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);
            dissolvedMinipool = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);

            // Stake minipools
            await stakeMinipool(web3, rp, stakingMinipool, stakingMinipoolPubkey, {from: node, gas: gasLimit});
            await stakeMinipool(web3, rp, withdrawableMinipool, withdrawableMinipoolPubkey, {from: node, gas: gasLimit});

            // Set minipool to withdrawable
            await rp.minipool.submitMinipoolWithdrawable(withdrawableMinipool.address, {from: trustedNode, gas: gasLimit});

            // Dissolve minipool
            await dissolvedMinipool.dissolve({from: node, gas: gasLimit});

            // Check minipool statuses
            let initializedStatus = await initializedMinipool.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            let prelaunchStatus = await prelaunchMinipool.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            let prelaunch2Status = await prelaunchMinipool2.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            let stakingStatus = await stakingMinipool.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            let withdrawableStatus = await withdrawableMinipool.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            let dissolvedStatus = await dissolvedMinipool.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            assert(initializedStatus.eq(web3.utils.toBN(0)), 'Incorrect initialized minipool status');
            assert(prelaunchStatus.eq(web3.utils.toBN(1)), 'Incorrect prelaunch minipool status');
            assert(prelaunch2Status.eq(web3.utils.toBN(1)), 'Incorrect prelaunch minipool status');
            assert(stakingStatus.eq(web3.utils.toBN(2)), 'Incorrect staking minipool status');
            assert(withdrawableStatus.eq(web3.utils.toBN(3)), 'Incorrect withdrawable minipool status');
            assert(dissolvedStatus.eq(web3.utils.toBN(4)), 'Incorrect dissolved minipool status');

            // Check minipool refund balances
            let prelaunchRefundBalance = await prelaunchMinipool.contract.methods.getNodeRefundBalance().call().then((value: any) => web3.utils.toBN(value));
            let prelaunch2RefundBalance = await prelaunchMinipool2.contract.methods.getNodeRefundBalance().call().then((value: any) => web3.utils.toBN(value));
            assert(prelaunchRefundBalance.eq(web3.utils.toBN(refundAmount)), 'Incorrect prelaunch minipool refund balance');
            assert(prelaunch2RefundBalance.eq(web3.utils.toBN(0)), 'Incorrect prelaunch minipool refund balance');

        });


        //
        // General
        //
        it(printTitle('random address', 'cannot send ETH to non-payable minipool delegate methods'), async () => {

            // Attempt to send ETH to view method
            await shouldRevert(prelaunchMinipool.contract.methods.getStatus().send({
                from: random,
                value: web3.utils.toWei('1', 'ether'),
                gas: gasLimit,
            }), 'Sent ETH to a non-payable minipool delegate view method', '');

            // Attempt to send ETH to mutator method
            await shouldRevert(refund(web3, rp, prelaunchMinipool, {
                from: node,
                value: web3.utils.toWei('1', 'ether'),
                gas: gasLimit
            }), 'Sent ETH to a non-payable minipool delegate mutator method', '');

        });


        it(printTitle('minipool', 'has correct withdrawal credentials'), async () => {

            // Withdrawal credentials settings
            const withdrawalPrefix = '01';
            const padding = '0000000000000000000000';

            // Get minipool withdrawal credentials
            let withdrawalCredentials = await initializedMinipool.contract.methods.getWithdrawalCredentials().call();

            // Check withdrawal credentials
            let expectedWithdrawalCredentials = ('0x' + withdrawalPrefix + padding + initializedMinipool.address.substr(2));
            assert.equal(withdrawalCredentials.toLowerCase(), expectedWithdrawalCredentials.toLowerCase(), 'Invalid minipool withdrawal credentials');

        });


        //
        // Refund
        //
        it(printTitle('node operator', 'can refund a refinanced node deposit balance'), async () => {

            // Refund from minipool with refund balance
            await refund(web3, rp, prelaunchMinipool, {
                from: node,
                gas: gasLimit
            });

        });


        it(printTitle('node operator', 'cannot refund with no refinanced node deposit balance'), async () => {

            // Refund
            await refund(web3, rp, prelaunchMinipool, {from: node, gas: gasLimit});

            // Attempt refund from minipools with no refund balance
            await shouldRevert(refund(web3, rp, prelaunchMinipool, {
                from: node,
                gas: gasLimit
            }), 'Refunded from a minipool which was already refunded from', 'No amount of the node deposit is available for refund');

            await shouldRevert(refund(web3, rp, prelaunchMinipool2, {
                from: node,
                gas: gasLimit
            }), 'Refunded from a minipool with no refund balance', 'No amount of the node deposit is available for refund');

        });


        it(printTitle('random address', 'cannot refund a refinanced node deposit balance'), async () => {

            // Attempt refund from minipool with refund balance
            await shouldRevert(refund(web3, rp, prelaunchMinipool, {
                from: random,
                gas: gasLimit
            }), 'Random address refunded from a minipool', 'Invalid minipool owner');

        });


        //
        // Dissolve
        //
        it(printTitle('node operator', 'can dissolve their own minipools'), async () => {

            // Dissolve minipools
            await dissolve(web3, rp, initializedMinipool, {
                from: node,
                gas: gasLimit
            });
            await dissolve(web3, rp, prelaunchMinipool, {
                from: node,
                gas: gasLimit
            });

        });


        it(printTitle('node operator', 'cannot dissolve their own staking minipools'), async () => {

            // Attempt to dissolve staking minipool
            await shouldRevert(dissolve(web3, rp, stakingMinipool, {
                from: node,
                gas: gasLimit
            }), 'Dissolved a staking minipool', 'The minipool can only be dissolved while initialized or in prelaunch');

        });


        it(printTitle('random address', 'can dissolve a timed out minipool at prelaunch'), async () => {

            // Time prelaunch minipool out
            await mineBlocks(web3, launchTimeout);

            // Dissolve prelaunch minipool
            await dissolve(web3, rp, prelaunchMinipool, {
                from: random,
                gas: gasLimit
            });

        });


        it(printTitle('random address', 'cannot dissolve a minipool which is not at prelaunch'), async () => {

            // Time prelaunch minipool out
            await mineBlocks(web3, launchTimeout);

            // Attempt to dissolve initialized minipool
            await shouldRevert(dissolve(web3, rp, initializedMinipool, {
                from: random,
                gas: gasLimit
            }), 'Random address dissolved a minipool which was not at prelaunch', 'The minipool can only be dissolved by its owner unless it has timed out');

        });


        it(printTitle('random address', 'cannot dissolve a minipool which has not timed out'), async () => {

            // Attempt to dissolve prelaunch minipool
            await shouldRevert(dissolve(web3, rp, prelaunchMinipool, {
                from: random,
            }), 'Random address dissolved a minipool which has not timed out', 'The minipool can only be dissolved by its owner unless it has timed out');

        });

        //
        // Stake
        //
        it(printTitle('node operator', 'can stake a minipool at prelaunch'), async () => {

            // Stake prelaunch minipool
            await stake(web3, rp, prelaunchMinipool, getValidatorPubkey(), "", {
                from: node,
                gas: gasLimit
            });

        });


        it(printTitle('node operator', 'cannot stake a minipool which is not at prelaunch'), async () => {

            // Attempt to stake initialized minipool
            await shouldRevert(stake(web3, rp, initializedMinipool, getValidatorPubkey(), "", {
                from: node,
                gas: gasLimit
            }), 'Staked a minipool which was not at prelaunch', 'The minipool can only begin staking while in prelaunch');

        });


        it(printTitle('node operator', 'cannot stake a minipool with a reused validator pubkey'), async () => {

            // Get pubkey
            let pubkey = getValidatorPubkey();

            // Stake prelaunch minipool
            await stake(web3, rp, prelaunchMinipool, pubkey, "", {from: node, gas: gasLimit});

            // Attempt to stake second prelaunch minipool with same pubkey
            await shouldRevert(stake(web3, rp, prelaunchMinipool2, pubkey, "", {
                from: node,
                gas: gasLimit
            }), 'Staked a minipool with a reused validator pubkey', 'Validator pubkey is already in use');

        });


        it(printTitle('node operator', 'cannot stake a minipool with incorrect withdrawal credentials'), async () => {

            // Get withdrawal credentials
            let invalidWithdrawalCredentials = '0x1111111111111111111111111111111111111111111111111111111111111111';

            // Attempt to stake prelaunch minipool
            await shouldRevert(stake(web3, rp, prelaunchMinipool, getValidatorPubkey(), invalidWithdrawalCredentials, {
                from: node,
                gas: gasLimit
            }), 'Staked a minipool with incorrect withdrawal credentials', 'Transaction reverted silently');

        });


        it(printTitle('random address', 'cannot stake a minipool'), async () => {

            // Attempt to stake prelaunch minipool
            await shouldRevert(stake(web3, rp, prelaunchMinipool, getValidatorPubkey(), "", {
                from: random,
                gas: gasLimit
            }), 'Random address staked a minipool', 'Invalid minipool owner');

        });


        //
        // Withdraw validator balance
        //
        it(printTitle('node operator', 'cannot send withdraw balance to a minipool which is not withdrawable'), async () => {

            // Attempt to send validator balance
            await shouldRevert(withdrawValidatorBalance(web3, rp, stakingMinipool, true, {
                from: node,
                value: withdrawalBalance,
                gas: gasLimit
            }), 'Withdrew validator balance to a minipool which was not withdrawable', 'The minipool\'s validator balance can only be sent while withdrawable');

        });


        it(printTitle('node', 'cannot run payout method while processing withdrawals is disabled'), async () => {

            // Disable processing withdrawals
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.process.withdrawals.enabled', false, {from: owner});

            // Attempt to send validator balance
            await shouldRevert(withdrawValidatorBalance(web3, rp, withdrawableMinipool, true, {
                from: nodeWithdrawalAddress,
                value: withdrawalBalance,
                gas: gasLimit
            }), 'Payout method was run while withdrawals was disabled', "Processing withdrawals is currently disabled");

        });


        it(printTitle('random', 'random address cannot withdraw a node operators minipool balance'), async () => {

            // Attempt to send validator balance
            await shouldRevert(withdrawValidatorBalance(web3, rp, withdrawableMinipool, true, {
                from: random,
                value: withdrawalBalance,
                gas: gasLimit
            }), 'Random address withdrew validator balance from a node operators minipool', "The payout function must be called by the current node operators withdrawal address");

        });


        it(printTitle('node operator', 'cannot withdraw their ETH once it is received if they do not confirm they wish to do so'), async () => {

            // Send validator balance and withdraw
            await shouldRevert(withdrawValidatorBalance(web3, rp, withdrawableMinipool, false, {
                from: nodeWithdrawalAddress,
                value: withdrawalBalance,
                gas: gasLimit
            }), 'Random address withdrew validator balance from a node operators minipool', "Node operator did not confirm they wish to payout now");

        });


        it(printTitle('node operator withdrawal address', 'can withdraw their ETH once it is received, then distribute ETH to the rETH contract / deposit pool and destroy the minipool'), async () => {

            // Send validator balance and withdraw
            await withdrawValidatorBalance(web3, rp, withdrawableMinipool, true, {
                from: nodeWithdrawalAddress,
                value: withdrawalBalance,
                gas: gasLimit
            });

        });


        it(printTitle('node operator account', 'can also withdraw their ETH once it is received, then distribute ETH to the rETH contract / deposit pool and destroy the minipool'), async () => {

            // Send validator balance and withdraw
            await withdrawValidatorBalance(web3, rp, withdrawableMinipool, true, {
                from: node,
                value: withdrawalBalance,
                gas: gasLimit
            });

        });


        it(printTitle('random address', 'can send validator balance to a withdrawable minipool in one transaction'), async () => {

            await web3.eth.sendTransaction({
                from: random,
                to: withdrawableMinipool.address,
                value: withdrawalBalance,
            });

            // Process validator balance
            await withdrawValidatorBalance(web3, rp, withdrawableMinipool, true, {
                from: nodeWithdrawalAddress,
                value: 0,
                gas: gasLimit
            });

        });


        it(printTitle('random address', 'can send validator balance to a withdrawable minipool across multiple transactions'), async () => {

            // Get tx amount (half of withdrawal balance)
            let amount = web3.utils.toBN(withdrawalBalance).div(web3.utils.toBN(2));

            await web3.eth.sendTransaction({
                from: random,
                to: withdrawableMinipool.address,
                value: amount,
            });

            await web3.eth.sendTransaction({
                from: owner,
                to: withdrawableMinipool.address,
                value: amount,
            });

            // Process payout
            await withdrawValidatorBalance(web3, rp, withdrawableMinipool, true, {
                from: nodeWithdrawalAddress,
                value: 0,
                gas: gasLimit
            });


        });


        //
        // Close
        //
        it(printTitle('node operator', 'can close a dissolved minipool'), async () => {

            // Close dissolved minipool
            await close(web3, rp, dissolvedMinipool, {
                from: node,
                gas: gasLimit
            });

        });


        it(printTitle('node operator', 'cannot close a minipool which is not dissolved'), async () => {

            // Attempt to close staking minipool
            await shouldRevert(close(web3, rp, stakingMinipool, {
                from: node,
                gas: gasLimit,
            }), 'Closed a minipool which was not dissolved', 'The minipool can only be closed while dissolved');

        });


        it(printTitle('random address', 'cannot close a dissolved minipool'), async () => {

            // Attempt to close dissolved minipool
            await shouldRevert(close(web3, rp, dissolvedMinipool, {
                from: random,
                gas: gasLimit,
            }), 'Random address closed a minipool', 'Invalid minipool owner');

        });


        //
        // Unbonded minipools
        //
        it(printTitle('trusted node', 'cannot create an unbonded minipool if node fee is < 80% of maximum'), async () => {
            // Sanity check that current node fee is less than 80% of maximum
            let nodeFee = await getNodeFee(web3, rp).then((value: any) => web3.utils.toBN(value));
            let maximumNodeFee = await getNetworkSetting(rp, 'MaximumNodeFee').then((value: any) => web3.utils.toBN(value));
            assert(nodeFee.lt(maximumNodeFee.muln(0.8)), 'Node fee is greater than 80% of maximum fee');

            // Stake RPL to cover minipool
            let minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
            let rplStake = minipoolRplStake.mul(web3.utils.toBN(6));
            await mintRPL(web3, rp, owner, trustedNode, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: trustedNode, gas: gasLimit});

            // Creating an unbonded minipool should revert
            await shouldRevert(createMinipool(web3, rp, {from: trustedNode, value: '0', gas: gasLimit}),
                'Trusted node was able to create unbonded minipool with fee < 80% of max',
                'Current commission rate is not high enough to create unbonded minipools'
            );
        });


        it(printTitle('trusted node', 'can create an unbonded minipool if node fee is > 80% of maximum'), async () => {
            // Deposit enough unassigned ETH to increase the fee above 80% of max
            await userDeposit(web3, rp, {from: random, value: web3.utils.toWei('900', 'ether'), gas: gasLimit});

            // Sanity check that current node fee is greater than 80% of maximum
            let nodeFee = await getNodeFee(web3, rp).then((value: any) => web3.utils.toBN(value));
            let maximumNodeFee = await getNetworkSetting(rp, 'MaximumNodeFee').then((value: any) => web3.utils.toBN(value));
            assert(nodeFee.gt(maximumNodeFee.muln(0.8)), 'Node fee is not greater than 80% of maximum fee');

            // Stake RPL to cover minipool
            let minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
            let rplStake = minipoolRplStake.mul(web3.utils.toBN(6));
            await mintRPL(web3, rp, owner, trustedNode, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: trustedNode, gas: gasLimit});

            // Creating the unbonded minipool
            await createMinipool(web3, rp,{from: trustedNode, value: '0', gas: gasLimit});
        });


    });
};
