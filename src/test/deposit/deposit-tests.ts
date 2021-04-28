// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot} from '../_utils/evm';
import {getDepositSetting} from '../_helpers/settings';
import {deposit} from './scenario-deposit';
import {assignDeposits} from './scenario-assign-deposits';
import {nodeDeposit, nodeStakeRPL, setNodeTrusted} from "../_helpers/node";
import {shouldRevert} from '../_utils/testing';
import {printTitle} from '../_utils/formatting';
import {getRethExchangeRate, getRethTotalSupply, mintRPL} from '../_helpers/tokens';
import {submitBalances} from '../_helpers/network';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {userDeposit} from '../_helpers/deposit';
import {getMinipoolMinimumRPLStake} from '../_helpers/minipool';

// Tests
export default function runDepositTests(web3: Web3, rp: RocketPool) {
    describe('Deposit', () => {

        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let node: string;
        let trustedNode: string;
        let staker: string;
        let random: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        before(async () => {

            // Get accounts
            [owner, node, trustedNode, staker, random] = await web3.eth.getAccounts();

            // Register node
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});

            // Register trusted node
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode, 'saas_1', 'node@home.com', owner);

        });

        //
        // Deposit
        //

        it(printTitle('staker', 'can make a deposit'), async () => {

            // Deposit
            await deposit(web3, rp,{
                from: staker,
                value: web3.utils.toWei('10', 'ether'),
                gas: gasLimit
            });

            // Get current rETH exchange rate
            let exchangeRate1 = await getRethExchangeRate(web3, rp).then((value: any) => web3.utils.toBN(value));

            // Update network ETH total to 130% to alter rETH exchange rate
            let totalBalance = web3.utils.toWei('13', 'ether');
            let rethSupply = await getRethTotalSupply(web3, rp);
            await submitBalances(web3, rp, 1, totalBalance, 0, rethSupply, {from: trustedNode, gas: gasLimit});

            // Get & check updated rETH exchange rate
            let exchangeRate2 = await getRethExchangeRate(web3, rp).then((value: any) => web3.utils.toBN(value));
            assert(!exchangeRate1.eq(exchangeRate2), 'rETH exchange rate has not changed');

            // Deposit again with updated rETH exchange rate
            await deposit(web3, rp,{
                from: staker,
                value: web3.utils.toWei('10', 'ether'),
                gas: gasLimit
            });

        });

        it(printTitle('staker', 'cannot make a deposit while deposits are disabled'), async () => {

            // Disable deposits
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsDeposit', 'deposit.enabled', false, {from: owner});

            // Attempt deposit
            await shouldRevert(deposit(web3, rp, {
                from: staker,
                value: web3.utils.toWei('10', 'ether'),
                gas: gasLimit
            }), 'Made a deposit while deposits are disabled', 'Deposits into Rocket Pool are currently disabled');

        });

        it(printTitle('staker', 'cannot make a deposit below the minimum deposit amount'), async () => {

            // Get & check deposit amount
            let minimumDeposit = await getDepositSetting(rp, 'MinimumDeposit').then((value: any) => web3.utils.toBN(value));
            let depositAmount = minimumDeposit.div(web3.utils.toBN(2));
            assert(depositAmount.lt(minimumDeposit), 'Deposit amount is not less than the minimum deposit');

            // Attempt deposit
            await shouldRevert(deposit(web3, rp,{
                from: staker,
                value: depositAmount,
                gas: gasLimit
            }), 'Made a deposit below the minimum deposit amount', ' The deposited amount is less than the minimum deposit size');

        });

        it(printTitle('staker', 'cannot make a deposit which would exceed the maximum deposit pool size'), async () => {

            // Set max deposit pool size
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsDeposit', 'deposit.pool.maximum', web3.utils.toWei('100', 'ether'), {from: owner});

            // Attempt deposit
            await shouldRevert(deposit(web3, rp,{
                from: staker,
                value: web3.utils.toWei('101', 'ether'),
                gas: gasLimit
            }), 'Made a deposit which exceeds the maximum deposit pool size', 'The deposit pool size after depositing exceeds the maximum size');

        });

        //
        // Assign deposits
        //
        it(printTitle('random address', 'can assign deposits'), async () => {

            // Assign deposits with no assignable deposits
            await assignDeposits(web3, rp,{
                from: staker,
                gas: gasLimit
            });

            // Disable deposit assignment
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsDeposit', 'deposit.assign.enabled', false, {from: owner});

            // Stake RPL to cover minipools
            let minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
            let rplStake = minipoolRplStake.mul(web3.utils.toBN(3));
            await mintRPL(web3, rp, owner, trustedNode, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: trustedNode, gas: gasLimit});

            // Make user & node deposits
            await userDeposit(web3, rp, {from: staker, value: web3.utils.toWei('100', 'ether'), gas: gasLimit});
            await nodeDeposit(web3, rp, {from: trustedNode, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});
            await nodeDeposit(web3, rp, {from: trustedNode, value: web3.utils.toWei('32', 'ether'), gas: gasLimit});
            await nodeDeposit(web3, rp, {from: trustedNode, value: web3.utils.toWei('0', 'ether'), gas: gasLimit});

            // Re-enable deposit assignment & set limit
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsDeposit', 'deposit.assign.enabled', true, {from: owner, gas: gasLimit});
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsDeposit', 'deposit.assign.maximum', 3, {from: owner, gas: gasLimit});

            // Assign deposits with assignable deposits
            await assignDeposits(web3, rp, {
                from: staker,
                gas: gasLimit,
            });

        });

        it(printTitle('random address', 'cannot assign deposits while deposit assignment is disabled'), async () => {

            // Disable deposit assignment
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsDeposit', 'deposit.assign.enabled', false, {from: owner});

            // Attempt to assign deposits
            await shouldRevert(assignDeposits(web3, rp,{
                from: staker,
            }), 'Assigned deposits while deposit assignment is disabled', 'Deposit assignments are currently disabled');

        });

    });
};
