// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {nodeStakeRPL, setNodeTrusted, setNodeWithdrawalAddress} from '../_helpers/node';
import {mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {submitBalances} from './scenario-submit-balances';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {getNodeFeeByDemand} from '../_helpers/network';


// Tests
export default function runNetworkPricesTests(web3: Web3, rp: RocketPool) {
    describe('Network Prices', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let owner: string;
        let node: string;
        let trustedNode1: string;
        let trustedNode2: string;
        let trustedNode3: string;

        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        before(async () => {

            // Get accounts
            [owner, node, trustedNode1, trustedNode2, trustedNode3] = await web3.eth.getAccounts();

            // Register node
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});

            // Register trusted nodes
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode1, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode1, 'saas_1', 'node@home.com', owner);
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode2, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode2, 'saas_2', 'node@home.com', owner);
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode3, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode3, 'saas_3', 'node@home.com', owner);

        });

        it(printTitle('trusted nodes', 'can submit network prices'), async () => {

            // Set parameters
            let block = 1;
            let rplPrice = web3.utils.toWei('0.02', 'ether');

            // Submit different prices
            await submitPrices(web3, rp, block, web3.utils.toWei('0.03', 'ether'), {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitPrices(web3, rp, block, web3.utils.toWei('0.04', 'ether'), {
                from: trustedNode2,
                gas: gasLimit
            });
            await submitPrices(web3, rp, block, web3.utils.toWei('0.05', 'ether'), {
                from: trustedNode3,
                gas: gasLimit
            });

            // Set parameters
            block = 2;

            // Submit identical prices to trigger update
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitPrices(web3, rp, block, rplPrice, {
                from: trustedNode2,
                gas: gasLimit
            });

        });



    });
}
