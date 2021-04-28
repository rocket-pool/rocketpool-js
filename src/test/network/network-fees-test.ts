// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot} from '../_utils/evm';
import {printTitle} from '../_utils/formatting';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {getNodeFeeByDemand} from '../_helpers/network';


// Tests
export default function runNetworkFeesTests(web3: Web3, rp: RocketPool) {
    describe('Network Fees', () => {

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

        // Setup
        let minNodeFee: string = web3.utils.toWei('0.00', 'ether');
        let targetNodeFee: string = web3.utils.toWei('0.50', 'ether');
        let maxNodeFee: string = web3.utils.toWei('1.00', 'ether');
        let demandRange: string = web3.utils.toWei('1', 'ether');

        before(async () => {

            // Get accounts
            [owner, node, trustedNode1, trustedNode2, trustedNode3] = await web3.eth.getAccounts();

            // Set network settings
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.node.fee.minimum', minNodeFee, {from: owner, gas: gasLimit});
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.node.fee.target', targetNodeFee, {from: owner, gas: gasLimit});
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.node.fee.maximum', maxNodeFee, {from: owner, gas: gasLimit});
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsNetwork', 'network.node.fee.demand.range', demandRange, {from: owner, gas: gasLimit});

        });

        it(printTitle('network node fee', 'has correct value based on node demand'), async () => {

            // Set expected fees for node demand values
            let values = [
                {demand: web3.utils.toWei('-1.25', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('0', 'ether'))},
                {demand: web3.utils.toWei('-1.00', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('0', 'ether'))},
                {demand: web3.utils.toWei('-0.75', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('0.2890625', 'ether'))},
                {demand: web3.utils.toWei('-0.50', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('0.4375', 'ether'))},
                {demand: web3.utils.toWei('-0.25', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('0.4921875', 'ether'))},
                {demand: web3.utils.toWei( '0.00', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('0.5', 'ether'))},
                {demand: web3.utils.toWei( '0.25', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('0.5078125', 'ether'))},
                {demand: web3.utils.toWei( '0.50', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('0.5625', 'ether'))},
                {demand: web3.utils.toWei( '0.75', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('0.7109375', 'ether'))},
                {demand: web3.utils.toWei( '1.00', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('1', 'ether'))},
                {demand: web3.utils.toWei( '1.25', 'ether'), expectedFee: web3.utils.toBN(web3.utils.toWei('1', 'ether'))},
            ];

            // Check fees
            for (let vi = 0; vi < values.length; ++vi) {
                let v = values[vi];
                let nodeFee = await getNodeFeeByDemand(web3, rp, v.demand).then((value: any) => web3.utils.toBN(value));
                assert(nodeFee.eq(v.expectedFee), 'Node fee does not match expected fee for node demand value');
            }

        });


    });
}
