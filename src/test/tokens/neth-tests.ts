// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {nodeStakeRPL, setNodeTrusted, setNodeWithdrawalAddress} from '../_helpers/node';
import {getNethBalance, mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {getMinipoolSetting} from '../_helpers/settings';
import {
    createMinipool,
    getMinipoolMinimumRPLStake,
    payoutMinipool,
    stakeMinipool,
    submitMinipoolWithdrawable,
    withdrawMinipool
} from '../_helpers/minipool';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {getNodeFee} from '../_helpers/network';
import {getValidatorPubkey} from '../_utils/beacon';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import {burnNeth} from './scenario-burn-neth';


// Tests
export default function runNethTests(web3: Web3, rp: RocketPool) {
    describe('nETH', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let owner: string;
        let node: string;
        let oracleNode: string;

        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });



        // Setup
        let minipool: MinipoolContract;
        let validatorPubkey = getValidatorPubkey();
        let withdrawalBalance = web3.utils.toWei('36', 'ether');
        let nethBalance: any;

        before(async () => {

            // Get accounts
            [owner, node, oracleNode] = await web3.eth.getAccounts();

            // Register node
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});

            // Register trusted nodes
            await rp.node.registerNode('Australia/Brisbane', {from: oracleNode, gas: gasLimit});
            await setNodeTrusted(web3, rp, oracleNode, 'saas_1', 'node@home.com', owner);

            // Stake RPL to cover minipools
            let rplStake = await getMinipoolMinimumRPLStake(web3, rp);
            await mintRPL(web3, rp, owner, node, rplStake);
            await nodeStakeRPL(web3, rp, rplStake, {from: node, gas: gasLimit});

            // Create and withdraw from withdrawable minipool
            minipool = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('32', 'ether'), gas: gasLimit}) as MinipoolContract);
            await stakeMinipool(web3, rp, minipool, validatorPubkey, {from: node, gas: gasLimit});
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), withdrawalBalance, {from: oracleNode, gas: gasLimit});
            await withdrawMinipool(minipool, {from: node, gas: gasLimit});

            // Get & check node nETH balance
            nethBalance = await getNethBalance(web3, rp, node).then((value: any) => web3.utils.toBN(value));
            assert(nethBalance.gt(web3.utils.toBN(0)), 'Incorrect node nETH balance');
        });

        it(printTitle('nETH holder', 'can burn nETH for ETH'), async () => {

            // Send ETH to the minipool to simulate receiving from SWC
            await web3.eth.sendTransaction({
                from: oracleNode,
                to: minipool.address,
                value: withdrawalBalance
            });

            // Run the payout function now
            await payoutMinipool(minipool, {
                from: oracleNode,
                gas: gasLimit
            });

            // Burn nETH
            await burnNeth(web3, rp, nethBalance, {
                from: node,
                gas: gasLimit
            });

        });

    });
}
