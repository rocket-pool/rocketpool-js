// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Register a node
export async function register(web3: Web3, rp: RocketPool, timezoneLocation: string, options: SendOptions) {

    // Load contracts
    const rocketNodeManager = await rp.contracts.get('rocketNodeManager');

    // Get node details
    function getNodeDetails(nodeAddress: string) {
        return Promise.all([
            rp.node.getNodeExists(nodeAddress),
            rp.node.getNodeTimezoneLocation(nodeAddress),
        ]).then(
            ([exists, timezoneLocation]) =>
                ({exists, timezoneLocation})
        );
    }

    // Get initial node index
    let nodeCount1 = await rp.node.getNodeCount().then((value: any) => web3.utils.toBN(value));

    // Register
    await rp.node.registerNode(timezoneLocation, options);

    // Get updated node index & node details
    let nodeCount2 = await rp.node.getNodeCount().then((value: any) => web3.utils.toBN(value));

    let [lastNodeAddress, details] = await Promise.all([
        rp.node.getNodeAt(nodeCount2.sub(web3.utils.toBN(1)).toNumber()),
        getNodeDetails(options.from),
    ]);

    // Check details
    assert(nodeCount2.eq(nodeCount1.add(web3.utils.toBN(1))), 'Incorrect updated node count');
    assert.equal(lastNodeAddress.toLowerCase(), options.from, 'Incorrect updated node index');
    assert.isTrue(details.exists, 'Incorrect node exists flag');
    assert.equal(details.timezoneLocation, timezoneLocation, 'Incorrect node timezone location');

}

