// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Set a node's timezone location
export async function setTimezoneLocation(web3: Web3, rp: RocketPool, timezoneLocation: string, options: SendOptions) {

    // Set timezone location
    await rp.node.setTimezoneLocation(timezoneLocation, options);

    // Check node's timezone location
    let nodeTimezoneLocation = await rp.node.getNodeTimezoneLocation(options.from);
    assert.equal(nodeTimezoneLocation, timezoneLocation, 'Incorrect updated timezone location');

}

