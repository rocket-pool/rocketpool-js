// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {createMinipool, getMinipoolMinimumRPLStake, stakeMinipool} from '../_helpers/minipool';
import { setMinipoolSetting } from '../_helpers/settings';
import { close } from './scenario-close';
import { dissolve } from './scenario-dissolve';
import { refund } from './scenario-refund';
import { stake } from './scenario-stake';
import {withdrawValidatorBalance} from './scenario-withdraw-validator-balance';
import { withdraw } from './scenario-withdraw';
import {nodeStakeRPL, setNodeTrusted, setNodeWithdrawalAddress} from '../_helpers/node';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {userDeposit} from '../_helpers/deposit';
import {mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {getValidatorPubkey} from '../_utils/beacon';
import {submitWithdrawable} from './scenario-submit-withdrawal';

// Tests
export default function runMinipoolStatusTests(web3: Web3, rp: RocketPool) {
    describe('Minipool Status Tests', () => {

        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let node: string;
        let trustedNode1: string;
        let trustedNode2: string;
        let trustedNode3: string;
        let staker: string;
        let random: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        let stakingMinipool1: MinipoolContract;
        let stakingMinipool2: MinipoolContract;
        let stakingMinipool3: MinipoolContract;

        before(async () => {

            // Get accounts
            [owner, node, trustedNode1, trustedNode2, trustedNode3, staker, random] = await web3.eth.getAccounts();

            // Register node & set withdrawal address
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});

            // Register trusted node
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode1, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode1, 'saas_1', 'node@home.com', owner);
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode2, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode2, 'saas_2', 'node@home.com', owner);
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode3, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode3, 'saas_3', 'node@home.com', owner);


            // Stake RPL to cover minipools
            let minipoolRplStake = await getMinipoolMinimumRPLStake(web3, rp);
            let rplStake = minipoolRplStake.mul(web3.utils.toBN(3));
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node, gas: gasLimit});

            // Create minipools
            stakingMinipool1 = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);
            stakingMinipool2 = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);
            stakingMinipool3 = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);


            // Make and assign deposits to minipools
            await userDeposit(web3, rp, {from: staker, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});
            await userDeposit(web3, rp,{from: staker, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});
            await userDeposit(web3, rp,{from: staker, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});

            // Stake minipools
            await stakeMinipool(web3, rp, stakingMinipool1, null, {from: node, gas: gasLimit});
            await stakeMinipool(web3, rp, stakingMinipool2, null, {from: node, gas: gasLimit});
            await stakeMinipool(web3, rp, stakingMinipool3, null, {from: node, gas: gasLimit});

            // Check minipool statuses
            let stakingStatus1 = await stakingMinipool1.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            let stakingStatus2 = await stakingMinipool2.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            let stakingStatus3 = await stakingMinipool3.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value));
            assert(stakingStatus1.eq(web3.utils.toBN(2)), 'Incorrect staking minipool status');
            assert(stakingStatus2.eq(web3.utils.toBN(2)), 'Incorrect staking minipool status');
            assert(stakingStatus3.eq(web3.utils.toBN(2)), 'Incorrect staking minipool status');

        });


        //
        // Submit withdrawable
        //
        it(printTitle('trusted nodes', 'can submit a withdrawable event for a staking minipool'), async () => {

            // Set parameters
            let startBalance1 = web3.utils.toWei('32', 'ether');
            let endBalance1 = web3.utils.toWei('36', 'ether');
            let startBalance2 = web3.utils.toWei('32', 'ether');
            let endBalance2 = web3.utils.toWei('28', 'ether');
            let startBalance3 = web3.utils.toWei('32', 'ether');
            let endBalance3 = web3.utils.toWei('14', 'ether');

            // Submit different withdrawable events
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance1, web3.utils.toWei('37', 'ether'), {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance1, web3.utils.toWei('38', 'ether'), {
                from: trustedNode2,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance1, web3.utils.toWei('39', 'ether'), {
                from: trustedNode3,
                gas: gasLimit
            });

            // Submit identical withdrawable events to trigger update:

            // Minipool 1 - rewards earned
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance1, endBalance1, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool1.address, startBalance1, endBalance1, {
                from: trustedNode2,
                gas: gasLimit
            });

            // Minipool 2 - penalties applied
            await submitWithdrawable(web3, rp, stakingMinipool2.address, startBalance2, endBalance2, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool2.address, startBalance2, endBalance2, {
                from: trustedNode2,
                gas: gasLimit
            });

            // Minipool 3 - penalties applied & RPL slashed
            await submitWithdrawable(web3, rp, stakingMinipool3.address, startBalance3, endBalance3, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitWithdrawable(web3, rp, stakingMinipool3.address, startBalance3, endBalance3, {
                from: trustedNode2,
                gas: gasLimit
            });

        });


    });
};
