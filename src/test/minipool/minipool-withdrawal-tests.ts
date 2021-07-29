// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import {takeSnapshot, revertSnapshot, mineBlocks, increaseTime} from '../_utils/evm';
import {
    createMinipool,
    getMinipoolMinimumRPLStake,
    stakeMinipool,
    submitMinipoolWithdrawable
} from '../_helpers/minipool';
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
import {setDaoNodeTrustedBootstrapUpgrade} from "../dao/scenario-dao-node-trusted-bootstrap";
import {Contract} from "web3-eth-contract";

// Tests
export default function runMinipoolWithdrawalTests(web3: Web3, rp: RocketPool) {
    describe('Minipool Withdrawal Tests', () => {

        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let node: string;
        let nodeWithdrawalAddress: string;
        let trustedNode: string;
        let random: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        let launchTimeout = 20;
        let withdrawalDelay = 20;
        let minipool: MinipoolContract;
        let penaltyTestContract: Contract;
        let maxPenaltyRate = web3.utils.toWei('0.5', 'ether');
        before(async () => {

            // Get accounts
            [owner, node, nodeWithdrawalAddress, trustedNode, random] = await web3.eth.getAccounts();

            // Register node & set withdrawal address
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});
            await setNodeWithdrawalAddress(web3, rp, node, nodeWithdrawalAddress, {from: node, gas: gasLimit});

            // Register trusted node
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode, 'saas_1', 'node@home.com', owner);

            // Set settings
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsMinipool', 'minipool.launch.timeout', launchTimeout, {from: owner, gas: gasLimit});
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsMinipool', 'minipool.withdrawal.delay', withdrawalDelay, {from: owner, gas: gasLimit});

            // Set rETH collateralisation target to a value high enough it won't cause excess ETH to be funneled back into deposit pool and mess with our calcs
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.reth.collateral.target', web3.utils.toWei('50', 'ether'), {from: owner, gas: gasLimit});

            // Add penalty helper contract
            const penaltyTest = await rp.contracts.get('penaltyTest');
            console.log(penaltyTest);
            const penaltyTestAbi = await rp.contracts.abi('penaltyTest');
            await setDaoNodeTrustedBootstrapUpgrade(web3, rp,'addContract', 'rocketPenaltyTest', penaltyTestAbi, penaltyTest.options.address, {
                from: owner,
                gas: gasLimit
            });

            // Enable penalties
            const rocketMinipoolPenalty = await rp.contracts.get('rocketMinipoolPenalty');
            await rocketMinipoolPenalty.methods.setMaxPenaltyRate(maxPenaltyRate).send({from: owner, gas: gasLimit});

            // Hard code fee to 50%
            const fee = web3.utils.toWei('0.5', 'ether');
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.node.fee.minimum', fee, {from: owner, gas: gasLimit});
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.node.fee.target', fee, {from: owner, gas: gasLimit});
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.node.fee.maximum', fee, {from: owner, gas: gasLimit});

            // Deposit some user funds to assign to pool
            let userDepositAmount = web3.utils.toWei('16', 'ether');
            await userDeposit(web3, rp, {from: random, value: userDepositAmount, gas: gasLimit});

            // Stake RPL to cover minipools
            let minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
            let rplStake = minipoolRplStake.mul(web3.utils.toBN(8));
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node, gas: gasLimit});

            // Create minipools
            minipool = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);
            await stakeMinipool(web3, rp, minipool, null, {from: node, gas: gasLimit});


        });

        async function withdrawAndCheck(withdrawalBalance: string, from: string, destroy: boolean, expectedUser: string, expectedNode: string) {
            const withdrawalBalanceBN = web3.utils.toBN(web3.utils.toWei(withdrawalBalance, 'ether'));
            const expectedUserBN = web3.utils.toBN(web3.utils.toWei(expectedUser, 'ether'));
            const expectedNodeBN = web3.utils.toBN(web3.utils.toWei(expectedNode, 'ether'));

            // Process withdrawal
            const {
                nodeBalanceChange,
                rethBalanceChange
            }
                = await withdrawValidatorBalance(web3, rp, minipool, withdrawalBalanceBN.toString(), nodeWithdrawalAddress, destroy);

            // Check results
            assert(expectedUserBN.eq(rethBalanceChange), "User balance was incorrect");
            assert(expectedNodeBN.eq(nodeBalanceChange), "Node balance was incorrect");
        }


        it(printTitle('node operator withdrawal address', 'can process withdrawal when balance is greater than 32 ETH and marked as withdrawable'), async () => {
            // Mark minipool withdrawable
            await submitMinipoolWithdrawable(web3, rp, minipool.address, {from: trustedNode, gas: gasLimit});
            // Process withdraw
            await withdrawAndCheck('36', nodeWithdrawalAddress, true, '17', '19');
        });


        it(printTitle('random user', 'can process withdrawal when balance is greater than 32 ETH and marked as withdrawable'), async () => {
            // Mark minipool withdrawable
            await submitMinipoolWithdrawable(web3, rp, minipool.address, {from: trustedNode, gas: gasLimit});
            // Process withdraw
            await withdrawAndCheck('36', random, false, '17', '19');
        });


        it(printTitle('node operator withdrawal address', 'can process withdrawal when balance is greater than 32 ETH and not marked as withdrawable'), async () => {
            // Process withdraw
            await withdrawAndCheck('36', nodeWithdrawalAddress, false, '17', '19');
        });


        it(printTitle('random user', 'can process withdrawal when balance is greater than 32 ETH and not marked as withdrawable'), async () => {
            // Process withdraw
            await withdrawAndCheck('36', random, false, '17', '19');
        });


        it(printTitle('node operator withdrawal address', 'can process withdrawal when balance is greater than 16 ETH, less than 32 ETH and marked as withdrawable'), async () => {
            // Mark minipool withdrawable
            await submitMinipoolWithdrawable(web3, rp, minipool.address, {from: trustedNode, gas: gasLimit});
            // Process withdraw
            await withdrawAndCheck('28', nodeWithdrawalAddress, true, '16', '12');
        });


        it(printTitle('random user', 'can process withdrawal when balance is greater than 16 ETH, less than 32 ETH and marked as withdrawable'), async () => {
            // Mark minipool withdrawable
            await submitMinipoolWithdrawable(web3, rp, minipool.address, {from: trustedNode, gas: gasLimit});
            // Process withdraw
            await withdrawAndCheck('28', random, false, '16', '12');
        });


        it(printTitle('node operator withdrawal address', 'can process withdrawal when balance is greater than 16 ETH, less than 32 ETH and not marked as withdrawable'), async () => {
            // Process withdraw
            await withdrawAndCheck('28', nodeWithdrawalAddress, false, '16', '12');
        });


        it(printTitle('random user', 'can process withdrawal when balance is greater than 16 ETH, less than 32 ETH and not marked as withdrawable'), async () => {
            // Process withdraw
            await withdrawAndCheck('28', random, false, '16', '12');
        });


        it(printTitle('node operator withdrawal address', 'can process withdrawal when balance is less than 16 ETH and marked as withdrawable'), async () => {
            // Mark minipool withdrawable
            await submitMinipoolWithdrawable(web3, rp, minipool.address, {from: trustedNode, gas: gasLimit});
            // Process withdraw
            await withdrawAndCheck('15', nodeWithdrawalAddress, true, '15', '0');
        });


        it(printTitle('random address', 'can process withdrawal when balance is less than 16 ETH and marked as withdrawable after 14 days'), async () => {
            // Mark minipool withdrawable
            await submitMinipoolWithdrawable(web3, rp, minipool.address, {from: trustedNode, gas: gasLimit});
            // Wait 14 days
            await increaseTime(web3, 60 * 60 * 24 * 14 + 1)
            // Process withdraw
            await withdrawAndCheck('15', random, false, '15', '0');
        });


        it(printTitle('random address', 'cannot process withdrawal when balance is less than 16 ETH and marked as withdrawable before 14 days'), async () => {
            // Mark minipool withdrawable
            await submitMinipoolWithdrawable(web3, rp, minipool.address, {from: trustedNode, gas: gasLimit});
            // Process withdraw
            const withdrawalBalance = web3.utils.toWei('15', 'ether');
            await shouldRevert(withdrawValidatorBalance(web3, rp, minipool, withdrawalBalance, random, false), 'Processed withdrawal before 14 days have passed', 'Non-owner must wait 14 days after withdrawal to distribute balance');
        });


        it(printTitle('node operator withdrawal address', 'cannot process withdrawal and destroy minipool while not marked as withdrawable'), async () => {
            // Process withdraw
            const withdrawalBalance = web3.utils.toWei('32', 'ether');
            await shouldRevert(withdrawValidatorBalance(web3, rp, minipool, withdrawalBalance, nodeWithdrawalAddress, true), 'Processed withdrawal and destroyed pool while status was not withdrawable', 'Minipool must be withdrawable to destroy');
        });


        it(printTitle('node operator withdrawal address', 'can process withdrawal when balance is less than 16 ETH and not marked as withdrawable'), async () => {
            // Process withdraw
            await withdrawAndCheck('15', nodeWithdrawalAddress, false, '15', '0');
        });


        it(printTitle('node operator withdrawal address', 'cannot process withdrawal and destroy pool when balance is less than 16 ETH and not marked as withdrawable'), async () => {
            // Process withdraw
            const withdrawalBalance = web3.utils.toWei('15', 'ether');
            await shouldRevert(withdrawValidatorBalance(web3, rp, minipool, withdrawalBalance, nodeWithdrawalAddress, true), 'Processed withdrawal and destroyed pool while status was not withdrawable', 'Minipool must be withdrawable to destroy');
        });


        // ETH penalty events
        it(printTitle('node operator withdrawal address', 'can process withdrawal and destroy pool when penalised by DAO'), async () => {
            // Penalise the minipool 50% of it's ETH
            await penaltyTestContract.methods.setPenaltyRate(minipool.address, maxPenaltyRate).call();
            // Mark minipool withdrawable
            await submitMinipoolWithdrawable(web3, rp, minipool.address, {from: trustedNode, gas: gasLimit});
            // Process withdraw - 36 ETH would normally give node operator 19 and user 17 but with a 50% penalty, and extra 9.5 goes to the user
            await withdrawAndCheck('36', nodeWithdrawalAddress, true, '26.5', '9.5');
        });


        it(printTitle('node operator withdrawal address', 'cannot be penalised greater than the max penalty rate set by DAO'), async () => {
            // Try to penalise the minipool 75% of it's ETH (max is 50%)
            await penaltyTestContract.methods.setPenaltyRate(minipool.address, web3.utils.toWei('0.75'));
            // Mark minipool withdrawable
            await submitMinipoolWithdrawable(web3, rp, minipool.address, {from: trustedNode});
            // Process withdraw - 36 ETH would normally give node operator 19 and user 17 but with a 50% penalty, and extra 9.5 goes to the user
            await withdrawAndCheck('36', nodeWithdrawalAddress, true, '26.5', '9.5');
        });


        it(printTitle('guardian', 'can disable penalising all together'), async () => {
            // Disable penalising by setting rate to 0
            const rocketMinipoolPenalty = await rp.contracts.get('rocketMinipoolPenalty');
            await rocketMinipoolPenalty.methods.setMaxPenaltyRate('0').send({from: owner});
            // Try to penalise the minipool 50%
            await penaltyTestContract.methods.setPenaltyRate(minipool.address, web3.utils.toWei('0.5')).call();
            // Mark minipool withdrawable
            await submitMinipoolWithdrawable(web3, rp, minipool.address, {from: trustedNode, gas: gasLimit});
            // Process withdraw
            await withdrawAndCheck('36', nodeWithdrawalAddress, true, '17', '19');
        });


    });
};
