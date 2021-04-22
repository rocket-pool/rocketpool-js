// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {nodeStakeRPL, setNodeTrusted, setNodeWithdrawalAddress} from '../_helpers/node';
import {mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {getMinipoolSetting} from '../_helpers/settings';
import {getMinipoolMinimumRPLStake} from '../_helpers/minipool';
import {deposit} from './scenario-deposit';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {register} from './scenario-register';
import {setWithdrawalAddress} from './scenario-set-withdrawal-address';
import {setTimezoneLocation} from './scenario-set-timezone';


// Tests
export default function runNodeManagerTests(web3: Web3, rp: RocketPool) {
    describe('Node Manager', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let owner: string;
        let node: string;
        let registeredNode: string;
        let withdrawalAddress: string;
        let random: string;

        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        // Setup
        before(async () => {

            // Get accounts
            [owner, node, registeredNode, withdrawalAddress, random] = await web3.eth.getAccounts();

            // Register node
            await rp.node.registerNode('Australia/Brisbane', {from: registeredNode, gas: gasLimit});

        });

        //
        // Registration
        //
        it(printTitle('node operator', 'can register a node'), async () => {

            // Register node
            await register(web3, rp, 'Australia/Brisbane', {
                from: node,
                gas: gasLimit
            });

        });

        it(printTitle('node operator', 'cannot register a node while registrations are disabled'), async () => {

            // Disable registrations
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNode', 'node.registration.enabled', false, {from: owner});

            // Attempt registration
            await shouldRevert(register(web3, rp, 'Australia/Brisbane', {
                from: node,
                gas: gasLimit
            }), 'Registered a node while registrations were disabled', 'Rocket Pool node registrations are currently disabled');

        });

        it(printTitle('node operator', 'cannot register a node with an invalid timezone location'), async () => {

            // Attempt to register node
            await shouldRevert(register(web3, rp,'a', {
                from: node,
                gas: gasLimit
            }), 'Registered a node with an invalid timezone location', 'The timezone location is invalid');

        });

        it(printTitle('node operator', 'cannot register a node which is already registered'), async () => {

            // Register
            await register(web3, rp,'Australia/Brisbane', {from: node, gas: gasLimit});

            // Attempt second registration
            await shouldRevert(register(web3, rp,'Australia/Brisbane', {
                from: node,
                gas: gasLimit
            }), 'Registered a node which is already registered', 'The node is already registered in the Rocket Pool network');

        });


        //
        // Withdrawal address
        //
        it(printTitle('node operator', 'can set their withdrawal address'), async () => {

            // Set withdrawal address
            await setWithdrawalAddress(web3, rp, withdrawalAddress, {
                from: registeredNode,
            });

        });

        it(printTitle('node operator', 'cannot set their withdrawal address to an invalid address'), async () => {

            // Attempt to set withdrawal address
            await shouldRevert(setWithdrawalAddress(web3, rp, '0x0000000000000000000000000000000000000000', {
                from: registeredNode,
                gas: gasLimit
            }), 'Set a withdrawal address to an invalid address', 'Invalid withdrawal address');

        });


        it(printTitle('random address', 'cannot set a withdrawal address'), async () => {

            // Attempt to set withdrawal address
            await shouldRevert(setWithdrawalAddress(web3, rp, withdrawalAddress, {
                from: random,
                gas: gasLimit
            }), 'Random address set a withdrawal address', 'Invalid node');

        });


        //
        // Timezone location
        //
        it(printTitle('node operator', 'can set their timezone location'), async () => {

            // Set timezone location
            await setTimezoneLocation(web3, rp, 'Australia/Sydney', {
                from: registeredNode,
                gas: gasLimit
            });

        });


        it(printTitle('node operator', 'cannot set their timezone location to an invalid value'), async () => {

            // Attempt to set timezone location
            await shouldRevert(setTimezoneLocation(web3, rp, 'a', {
                from: registeredNode,
                gas: gasLimit
            }), 'Set a timezone location to an invalid value', 'The timezone location is invalid');

        });


        it(printTitle('random address', 'cannot set a timezone location'), async () => {

            // Attempt to set timezone location
            await shouldRevert(setTimezoneLocation(web3, rp, 'Australia/Brisbane', {
                from: random,
                gas: gasLimit
            }), 'Random address set a timezone location', 'Invalid node');

        });


    });
}
