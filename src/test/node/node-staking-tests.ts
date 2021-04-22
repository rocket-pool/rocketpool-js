// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {nodeDeposit, nodeStakeRPL, setNodeTrusted, setNodeWithdrawalAddress} from '../_helpers/node';
import {approveRPL, mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {getMinipoolSetting} from '../_helpers/settings';
import {getMinipoolMinimumRPLStake} from '../_helpers/minipool';
import {deposit} from './scenario-deposit';
import {setDAOProtocolBootstrapSetting, setRewardsClaimIntervalBlocks} from '../dao/scenario-dao-protocol-bootstrap';
import {register} from './scenario-register';
import {setWithdrawalAddress} from './scenario-set-withdrawal-address';
import {setTimezoneLocation} from './scenario-set-timezone';
import {Contract} from 'web3-eth-contract';
import {stakeRpl} from './scenario-stake-rpl';
import {withdrawRpl} from './scenario-withdraw-rpl';


// Tests
export default function runNodeStakingTests(web3: Web3, rp: RocketPool) {
    describe('Node Staking', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let owner: string;
        let node: string;
        let random: string;

        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        let rocketNodeStaking: Contract;
        // Setup
        before(async () => {

            // Get accounts
            [owner, node, random] = await web3.eth.getAccounts();

            // Register node
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});

            // Mint RPL to accounts
            const rplAmount = web3.utils.toWei('10000', 'ether');
            await mintRPL(web3, rp, owner, node, rplAmount);
            await mintRPL(web3, rp, owner, random, rplAmount);

            rocketNodeStaking = await rp.contracts.get('rocketNodeStaking');

        });

        it(printTitle('node operator', 'can stake RPL'), async () => {

            // Set parameters
            const rplAmount = web3.utils.toWei('5000', 'ether');

            // Approve transfer & stake RPL once
            await approveRPL(web3, rp, rocketNodeStaking.options.address, rplAmount, {from: node, gas: gasLimit});
            await stakeRpl(web3, rp, rplAmount, {
                from: node,
                gas: gasLimit
            });

            // Make node deposit / create minipool
            await nodeDeposit(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});

            // Approve transfer & stake RPL twice
            await approveRPL(web3, rp, rocketNodeStaking.options.address, rplAmount, {from: node, gas: gasLimit});
            await stakeRpl(web3, rp, rplAmount, {
                from: node,
                gas: gasLimit
            });

        });

        it(printTitle('random address', 'cannot stake RPL'), async () => {

            // Set parameters
            const rplAmount = web3.utils.toWei('10000', 'ether');

            // Approve transfer & attempt to stake RPL
            await approveRPL(web3, rp, rocketNodeStaking.options.address, rplAmount, {from: node, gas: gasLimit});
            await shouldRevert(stakeRpl(web3, rp, rplAmount, {
                from: random,
                gas: gasLimit
            }), 'Random address staked RPL', 'Invalid node');

        });

        it(printTitle('node operator', 'can withdraw staked RPL'), async () => {

            // Set parameters
            const rplAmount = web3.utils.toWei('10000', 'ether');

            // Remove withdrawal cooldown period
            await setRewardsClaimIntervalBlocks(web3, rp, 0, {from: owner, gas: gasLimit});

            // Stake RPL
            await nodeStakeRPL(web3, rp, rplAmount, {from: node, gas: gasLimit});

            // Withdraw staked RPL
            await withdrawRpl(web3, rp, rplAmount, {
                from: node, gas: gasLimit
            });

        });

        it(printTitle('node operator', 'cannot withdraw staked RPL during the cooldown period'), async () => {

            // Set parameters
            const rplAmount = web3.utils.toWei('10000', 'ether');

            // Stake RPL
            await nodeStakeRPL(web3, rp, rplAmount, {from: node, gas: gasLimit});

            // Withdraw staked RPL
            await shouldRevert(withdrawRpl(web3, rp, rplAmount, {
                from: node,
                gas: gasLimit
            }), 'Withdrew staked RPL during the cooldown period', 'The withdrawal cooldown period has not passed');

        });

        it(printTitle('node operator', 'cannot withdraw more RPL than they have staked'), async () => {

            // Set parameters
            const stakeAmount = web3.utils.toWei('10000', 'ether');
            const withdrawAmount = web3.utils.toWei('20000', 'ether');

            // Remove withdrawal cooldown period
            await setRewardsClaimIntervalBlocks(web3, rp,0, {from: owner, gas: gasLimit});

            // Stake RPL
            await nodeStakeRPL(web3, rp, stakeAmount, {from: node, gas: gasLimit});

            // Withdraw staked RPL
            await shouldRevert(withdrawRpl(web3, rp, withdrawAmount, {
                from: node,
                gas: gasLimit
            }), 'Withdrew more RPL than was staked', 'Withdrawal amount exceeds node\'s staked RPL balance');

        });

        it(printTitle('node operator', 'cannot withdraw RPL leaving the node undercollateralized'), async () => {

            // Set parameters
            const rplAmount = web3.utils.toWei('10000', 'ether');

            // Remove withdrawal cooldown period
            await setRewardsClaimIntervalBlocks(web3, rp,0, {from: owner, gas: gasLimit});

            // Stake RPL
            await nodeStakeRPL(web3, rp, rplAmount, {from: node, gas: gasLimit});

            // Make node deposit / create minipool
            await nodeDeposit(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});

            // Withdraw staked RPL
            await shouldRevert(withdrawRpl(web3, rp, rplAmount, {
                from: node,
                gas: gasLimit
            }), 'Withdrew RPL leaving the node undercollateralized', 'Node\'s staked RPL balance after withdrawal is less than minimum balance');

        });

        it(printTitle('random address', 'cannot withdraw staked RPL'), async () => {

            // Set parameters
            const rplAmount = web3.utils.toWei('10000', 'ether');

            // Remove withdrawal cooldown period
            await setRewardsClaimIntervalBlocks(web3, rp, 0, {from: owner, gas: gasLimit});

            // Stake RPL
            await nodeStakeRPL(web3, rp, rplAmount, {from: node, gas: gasLimit});

            // Withdraw staked RPL
            await shouldRevert(withdrawRpl(web3, rp, rplAmount, {
                from: random, gas: gasLimit
            }), 'Random address withdrew staked RPL', 'Invalid node');

        });

    });
}
