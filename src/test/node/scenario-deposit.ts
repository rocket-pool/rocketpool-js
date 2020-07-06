// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import { getTxContractEvents } from '../_utils/contract';


// Make a node deposit
export async function deposit(web3: Web3, rp: RocketPool, options: SendOptions) {

    // Get contract addresses
    const minipoolManagerAddress = await rp.contracts.address('rocketMinipoolManager');

    // Deposit
    let txReceipt = await rp.node.deposit(0, options);

    // Get minipool created events
    let minipoolCreatedEvents = getTxContractEvents(web3, txReceipt, minipoolManagerAddress, 'MinipoolCreated', [
        {type: 'address', name: 'minipool', indexed: true},
        {type: 'address', name: 'node', indexed: true},
        {type: 'uint256', name: 'created'},
    ]);

    // Check minipool created events
    assert.equal(minipoolCreatedEvents.length, 1, 'Node deposit was not made successfully');

}

