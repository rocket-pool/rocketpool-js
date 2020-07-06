// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { takeSnapshot, revertSnapshot } from '../_utils/evm';
import { deposit } from './scenario-deposit';
import { register } from './scenario-register';
import { setTimezoneLocation } from './scenario-set-timezone';
import { setNodeTrusted } from './scenario-set-trusted';

// Tests
export default function runNodeTests(web3: Web3, rp: RocketPool) {
    describe('Node', () => {


        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let node1: string;
        let node2: string;
        let node3: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        before(async () => {

            // Get accounts
            [owner, node1, node2, node3] = await web3.eth.getAccounts();

            // Register nodes
            await rp.node.registerNode('Australia/Brisbane', {from: node1, gas: gasLimit});
            await rp.node.registerNode('Australia/Brisbane', {from: node2, gas: gasLimit});
            await rp.node.setNodeTrusted(node2, true, {from: owner, gas: gasLimit});

        });


        describe('Manager', () => {

            it('Can get node details', async () => {

                // Get details
                let allNodes = await rp.node.getNodes();
                let trustedNodes = await rp.node.getTrustedNodes();

                // Check node indexes
                assert.equal(allNodes.length, 2, 'Incorrect total node count');
                assert.equal(trustedNodes.length, 1, 'Incorrect trusted node count');

                // Check node details
                assert.equal(allNodes[0].address, node1, 'Incorrect node address');
                assert.equal(allNodes[1].address, node2, 'Incorrect node address');
                assert.isTrue(allNodes[0].exists, 'Incorrect node exists status');
                assert.isTrue(allNodes[1].exists, 'Incorrect node exists status');
                assert.isFalse(allNodes[0].trusted, 'Incorrect node trusted status');
                assert.isTrue(allNodes[1].trusted, 'Incorrect node trusted status');
                assert.equal(allNodes[0].timezoneLocation, 'Australia/Brisbane', 'Incorrect node timezone location');
                assert.equal(allNodes[1].timezoneLocation, 'Australia/Brisbane', 'Incorrect node timezone location');

            });

            it('Can register a node', async () => {
                await register(web3, rp, 'Australia/Brisbane', {
                    from: node3,
                    gas: gasLimit,
                });
            });

            it('Can set a node\'s timezone location', async () => {
                await setTimezoneLocation(web3, rp, 'Australia/Sydney', {
                    from: node1,
                    gas: gasLimit,
                });
            });

            it('Can set a node\'s trusted status', async () => {
                await setNodeTrusted(web3, rp, node1, true, {
                    from: owner,
                    gas: gasLimit,
                });
            });

        });


        describe('Deposit', () => {

            it('Can make a node deposit', async () => {
                await deposit(web3, rp, {
                    from: node1,
                    value: web3.utils.toWei('32', 'ether'),
                    gas: gasLimit,
                });
            });

        });


    });
}
