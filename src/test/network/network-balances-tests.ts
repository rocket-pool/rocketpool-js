// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot} from '../_utils/evm';
import {setNodeTrusted} from '../_helpers/node';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {submitBalances} from './scenario-submit-balances';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';


// Tests
export default function runNetworkBalancesTests(web3: Web3, rp: RocketPool) {
    describe('Network Balances', () => {

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


        it(printTitle('trusted nodes', 'can submit network balances'), async () => {

            // Set parameters
            let block = 1;
            let totalBalance = web3.utils.toWei('10', 'ether');
            let stakingBalance = web3.utils.toWei('9', 'ether');
            let rethSupply = web3.utils.toWei('8', 'ether');

            // Submit different balances
            await submitBalances(web3, rp, block, totalBalance, stakingBalance, web3.utils.toWei('7', 'ether'), {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitBalances(web3, rp, block, totalBalance, stakingBalance, web3.utils.toWei('6', 'ether'), {
                from: trustedNode2,
                gas: gasLimit
            });
            await submitBalances(web3, rp, block, totalBalance, stakingBalance, web3.utils.toWei('5', 'ether'), {
                from: trustedNode3,
                gas: gasLimit
            });

            // Set parameters
            block = 2;

            // Submit identical balances to trigger update
            await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
                from: trustedNode2,
                gas: gasLimit
            });
        });


        it(printTitle('trusted nodes', 'cannot submit network balances while balance submissions are disabled'), async () => {

            // Set parameters
            let block = 1;
            let totalBalance = web3.utils.toWei('10', 'ether');
            let stakingBalance = web3.utils.toWei('9', 'ether');
            let rethSupply = web3.utils.toWei('8', 'ether');

            // Disable submissions
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.submit.balances.enabled', false, {from: owner});

            // Attempt to submit balances
            await shouldRevert(submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted balances while balance submissions were disabled', 'Submitting balances is currently disabled');

        });


        it(printTitle('trusted nodes', 'cannot submit network balances for the current block or lower'), async () => {

            // Set parameters
            let block = 2;
            let totalBalance = web3.utils.toWei('10', 'ether');
            let stakingBalance = web3.utils.toWei('9', 'ether');
            let rethSupply = web3.utils.toWei('8', 'ether');

            // Submit balances for block to trigger update
            await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
                from: trustedNode1,
                gas: gasLimit
            });
            await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
                from: trustedNode2,
                gas: gasLimit
            });

            // Attempt to submit balances for current block
            await shouldRevert(submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
                from: trustedNode3,
                gas: gasLimit
            }), 'Submitted balances for the current block', 'Network balances for an equal or higher block are set');

            // Attempt to submit balances for lower block
            await shouldRevert(submitBalances(web3, rp, block - 1, totalBalance, stakingBalance, rethSupply, {
                from: trustedNode3,
                gas: gasLimit
            }), 'Submitted balances for a lower block', 'Network balances for an equal or higher block are set');

        });


        it(printTitle('trusted nodes', 'cannot submit invalid network balances'), async () => {

            // Set parameters
            let block = 1;
            let totalBalance = web3.utils.toWei('9', 'ether');
            let stakingBalance = web3.utils.toWei('10', 'ether');
            let rethSupply = web3.utils.toWei('8', 'ether');

            // Submit balances for block
            await shouldRevert(submitBalances(web3,rp, block, totalBalance, stakingBalance, rethSupply, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted invalid balances', 'Invalid network balances');

        });


        it(printTitle('trusted nodes', 'cannot submit the same network balances twice'), async () => {

            // Set parameters
            let block = 1;
            let totalBalance = web3.utils.toWei('10', 'ether');
            let stakingBalance = web3.utils.toWei('9', 'ether');
            let rethSupply = web3.utils.toWei('8', 'ether');

            // Submit balances for block
            await submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
                from: trustedNode1,
                gas: gasLimit
            });

            // Attempt to submit balances for block again
            await shouldRevert(submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
                from: trustedNode1,
                gas: gasLimit
            }), 'Submitted the same network balances twice', 'Duplicate submission from node');

        });


        it(printTitle('regular nodes', 'cannot submit network balances'), async () => {

            // Set parameters
            let block = 1;
            let totalBalance = web3.utils.toWei('10', 'ether');
            let stakingBalance = web3.utils.toWei('9', 'ether');
            let rethSupply = web3.utils.toWei('8', 'ether');

            // Attempt to submit balances
            await shouldRevert(submitBalances(web3, rp, block, totalBalance, stakingBalance, rethSupply, {
                from: node,
                gas: gasLimit
            }), 'Regular node submitted network balances', 'Invalid trusted node');

        });

    });
}
