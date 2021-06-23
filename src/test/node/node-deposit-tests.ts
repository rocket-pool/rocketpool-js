// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot} from '../_utils/evm';
import {nodeStakeRPL, setNodeTrusted} from '../_helpers/node';
import {mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {getMinipoolSetting} from '../_helpers/settings';
import {getMinipoolMinimumRPLStake} from '../_helpers/minipool';
import {deposit} from './scenario-deposit';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {getNodeFee} from "../_helpers/network";
import {userDeposit} from "../_helpers/deposit";


// Tests
export default function runNodeDepositTests(web3: Web3, rp: RocketPool) {
    describe('Node Deposits', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let owner: string;
        let node: string;
        let trustedNode: string;
        let random: string;

        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        let noMinimumNodeFee = web3.utils.toWei('0', 'ether');
        let fullDepositNodeAmount: string;
        let halfDepositNodeAmount: string;
        let emptyDepositNodeAmount: string;
        before(async () => {

            // Get accounts
            [owner, node, trustedNode, random] = await web3.eth.getAccounts();

            // Register node
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});

            // Register trusted nodes
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode, 'saas_1', 'node@home.com', owner);

            // Get settings
            fullDepositNodeAmount = await getMinipoolSetting(rp,'FullDepositNodeAmount');
            halfDepositNodeAmount = await getMinipoolSetting(rp,'HalfDepositNodeAmount');
            emptyDepositNodeAmount = await getMinipoolSetting(rp,'EmptyDepositNodeAmount');

        });


        it(printTitle('node operator', 'can make a deposit to create a minipool'), async () => {

            // Stake RPL to cover minipools
            let minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
            let rplStake = minipoolRplStake.mul(web3.utils.toBN(2));
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node, gas: gasLimit});

            // Deposit
            await deposit(web3, rp, noMinimumNodeFee, {
                from: node,
                value: fullDepositNodeAmount,
                gas: gasLimit,
            });

            // Deposit
            await deposit(web3, rp, noMinimumNodeFee, {
                from: node,
                value: halfDepositNodeAmount,
                gas: gasLimit,
            });

        });


        it(printTitle('node operator', 'cannot make a deposit while deposits are disabled'), async () => {

            // Stake RPL to cover minipool
            let rplStake = await getMinipoolMinimumRPLStake(web3, rp);
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node, gas: gasLimit});

            // Disable deposits
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNode', 'node.deposit.enabled', false, {from: owner, gas: gasLimit});

            // Attempt deposit
            await shouldRevert(deposit(web3, rp, noMinimumNodeFee, {
                from: node,
                value: fullDepositNodeAmount,
                gas: gasLimit
            }), 'Made a deposit while deposits were disabled', 'Node deposits are currently disabled');

            // Attempt deposit
            await shouldRevert(deposit(web3, rp, noMinimumNodeFee, {
                from: node,
                value: halfDepositNodeAmount,
                gas: gasLimit
            }), 'Made a deposit while deposits were disabled', 'Node deposits are currently disabled');

        });


        it(printTitle('node operator', 'cannot make a deposit with a minimum node fee exceeding the current network node fee'), async () => {

            // Stake RPL to cover minipool
            let rplStake = await getMinipoolMinimumRPLStake(web3, rp);
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node, gas: gasLimit});

            // Settings
            let nodeFee = await getNodeFee(web3, rp).then((value: any) => web3.utils.toBN(value));
            let minimumNodeFee = nodeFee.add(web3.utils.toBN(web3.utils.toWei('0.01', 'ether')));

            // Attempt deposit
            await shouldRevert(deposit(web3, rp, minimumNodeFee.toString(), {
                from: node,
                value: fullDepositNodeAmount,
                gas: gasLimit
            }), 'Made a deposit with a minimum node fee exceeding the current network node fee', 'Minimum node fee exceeds current network node fee');

            // Attempt deposit
            await shouldRevert(deposit(web3, rp, minimumNodeFee.toString(), {
                from: node,
                value: halfDepositNodeAmount,
                gas: gasLimit
            }), 'Made a deposit with a minimum node fee exceeding the current network node fee', 'Minimum node fee exceeds current network node fee');

        });


        it(printTitle('node operator', 'cannot make a deposit with an invalid amount'), async () => {

            // Stake RPL to cover minipool
            let rplStake = await getMinipoolMinimumRPLStake(web3, rp);
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node});

            // Get deposit amount
            let depositAmount = web3.utils.toBN(web3.utils.toWei('10', 'ether'));
            assert(!depositAmount.eq(web3.utils.toBN(fullDepositNodeAmount)), 'Deposit amount is not invalid');
            assert(!depositAmount.eq(web3.utils.toBN(halfDepositNodeAmount)), 'Deposit amount is not invalid');
            assert(!depositAmount.eq(web3.utils.toBN(emptyDepositNodeAmount)), 'Deposit amount is not invalid');

            // Attempt deposit
            await shouldRevert(deposit(web3, rp, noMinimumNodeFee, {
                from: node,
                value: depositAmount,
                gas: gasLimit
            }), 'Made a deposit with an invalid deposit amount', 'Invalid node deposit amount');

        });


        it(printTitle('node operator', 'cannot make a deposit with insufficient RPL staked'), async () => {

            // Attempt deposit with no RPL staked
            await shouldRevert(deposit(web3, rp, noMinimumNodeFee, {
                from: node,
                value: fullDepositNodeAmount,
                gas: gasLimit
            }), 'Made a deposit with insufficient RPL staked', 'Minipool count after deposit exceeds limit based on node RPL stake');

            // Stake insufficient RPL amount
            let minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
            let rplStake = minipoolRplStake.div(web3.utils.toBN(2));
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node, gas: gasLimit});

            // Attempt deposit with insufficient RPL staked
            await shouldRevert(deposit(web3, rp, noMinimumNodeFee, {
                from: node,
                value: fullDepositNodeAmount,
                gas: gasLimit
            }), 'Made a deposit with insufficient RPL staked', 'Minipool count after deposit exceeds limit based on node RPL stake');

        });


        it(printTitle('trusted node operator', 'can make a deposit to create an empty minipool'), async () => {

            // Deposit enough unassigned ETH to increase the fee above 80% of max
            await userDeposit(web3, rp,{from: random, value: web3.utils.toWei('900', 'ether'), gas: gasLimit });

            // Stake RPL to cover minipool
            let rplStake = await getMinipoolMinimumRPLStake(web3, rp);
            await mintRPL(web3, rp, owner, trustedNode, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: trustedNode, gas: gasLimit});

            // Deposit
            await deposit(web3, rp, noMinimumNodeFee, {
                from: trustedNode,
                value: emptyDepositNodeAmount,
                gas: gasLimit
            });

        });


        it(printTitle('regular node operator', 'cannot make a deposit to create an empty minipool'), async () => {

            // Stake RPL to cover minipool
            let rplStake = await getMinipoolMinimumRPLStake(web3, rp);
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node});

            // Attempt deposit
            await shouldRevert(deposit(web3, rp, noMinimumNodeFee, {
                from: node,
                value: emptyDepositNodeAmount,
                gas: gasLimit,
            }), 'Regular node created an empty minipool', 'Only members of the trusted node DAO may create unbonded minipools');

        });


        it(printTitle('random address', 'cannot make a deposit'), async () => {

            // Attempt deposit
            await shouldRevert(deposit(web3, rp, noMinimumNodeFee, {
                from: random,
                value: fullDepositNodeAmount,
                gas: gasLimit
            }), 'Random address made a deposit', 'Invalid node');

            // Attempt deposit
            await shouldRevert(deposit(web3, rp, noMinimumNodeFee, {
                from: random,
                value: halfDepositNodeAmount,
                gas: gasLimit
            }), 'Random address made a deposit', 'Invalid node');

        });

    });
}
