// Imports
import { takeSnapshot, revertSnapshot } from '../_utils/evm';
import { printTitle } from '../_utils/formatting';
import { shouldRevert } from '../_utils/testing';
import { compressABI } from '../_utils/contract';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {setNodeTrusted} from '../_helpers/node';
import {setDaoNodeTrustedBootstrapMember, setDAONodeTrustedBootstrapSetting} from '../dao/scenario-dao-node-trusted-bootstrap';

export default function runDAONodeTrusted(web3: Web3, rp: RocketPool) {
    describe('DAO Node Trusted', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let guardian: string;
        let userOne: string;
        let registeredNode1: string;
        let registeredNode2: string;
        let registeredNodeTrusted1: string;
        let registeredNodeTrusted2: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        before(async () => {
            // Get accounts
            [guardian, userOne, registeredNode1, registeredNode2, registeredNodeTrusted1, registeredNodeTrusted2] = await web3.eth.getAccounts();

            const rocketStorage = await rp.contracts.get('rocketStorage');

            // Register nodes
            await rp.node.registerNode('Australia/Brisbane', {from: registeredNode1, gas: gasLimit});
            await rp.node.registerNode('Australia/Brisbane', {from: registeredNode2, gas: gasLimit});
            await rp.node.registerNode('Australia/Brisbane', {from: registeredNodeTrusted1, gas: gasLimit});
            await rp.node.registerNode('Australia/Brisbane', {from: registeredNodeTrusted2, gas: gasLimit});

            // Add members to the DAO
            await setNodeTrusted(web3, rp, registeredNodeTrusted1, 'rocketpool_1', 'node@home.com', guardian);
            await setNodeTrusted(web3, rp, registeredNodeTrusted2, 'rocketpool_2', 'node@home.com', guardian);

            // Deploy new contracts
            await rp.contracts.make('rocketMinipoolManager', rocketStorage.options.address);
            await rp.contracts.make('rocketDAONodeTrustedUpgrade', rocketStorage.options.address);

            // Set a small proposal cooldown
            await setDAONodeTrustedBootstrapSetting(web3, rp, 'rocketDAONodeTrustedSettingsProposals', 'proposal.cooldown', 10, {from: guardian});
        });


        //
        // Start Tests
        //
        it(printTitle('userOne', 'fails to be added as a trusted node dao member as they are not a registered node'), async () => {
            // Set as trusted dao member via bootstrapping
            await shouldRevert(setDaoNodeTrustedBootstrapMember(web3, rp,'rocketpool', 'node@home.com', userOne, {
                from: guardian
            }), 'Non registered node added to trusted node DAO', 'Invalid node');
        });

    });
};

