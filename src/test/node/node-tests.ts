// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { takeSnapshot, revertSnapshot } from '../_utils/evm';

// Tests
export default function runNodeTests(web3: Web3, rp: RocketPool) {
    describe('Node', () => {


        // settings
        const gasLimit: number = 8000000;


        // Accounts
        let owner: string;
        let node1: string;
        let node2: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        before(async () => {

            // Get accounts
            [owner, node1, node2] = await web3.eth.getAccounts();

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

        });


    });
}
