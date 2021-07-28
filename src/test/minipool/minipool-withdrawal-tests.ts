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
        let penaltyTestContract: MinipoolContract;
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

            // Make user deposit to refund first prelaunch minipool
            let refundAmount = web3.utils.toWei('16', 'ether');
            await userDeposit(web3, rp, {from: random, value: refundAmount, gas: gasLimit});

            // Stake RPL to cover minipools
            let minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
            let rplStake = minipoolRplStake.mul(web3.utils.toBN(6));
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node, gas: gasLimit});


        });




    });
};
