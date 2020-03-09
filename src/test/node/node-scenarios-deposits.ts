// Imports
import Web3 from 'web3';
import { assert } from 'chai';
import NodeContract from '../../rocketpool/node/node-contract';


// Make a deposit reservation
export async function reserveNodeDeposit(nodeContract: NodeContract, {durationId, from}: {durationId: string, from: string}) {

    // Reserve deposit
    await nodeContract.reserveDeposit(durationId, {from, gas: 8000000});

    // Check reservation details
    let details = await nodeContract.getDepositReservation();
    assert.equal(details.durationId, durationId, 'Deposit reservation duration ID does not match');

}


// Cancel a deposit reservation
export async function cancelNodeDepositReservation(nodeContract: NodeContract, {from}: {from: string}) {
    await nodeContract.cancelDepositReservation({from, gas: 8000000});
    let hasDepositReservation = await nodeContract.getHasDepositReservation();
    assert.isFalse(hasDepositReservation, 'Deposit reservation was not cancelled successfully');
}


// Complete a deposit
export async function completeNodeDeposit(nodeContract: NodeContract, {from, value}: {from: string, value: string}): Promise<string> {

    // Complete deposit
    let result = await nodeContract.completeDeposit({from, value, gas: 8000000});
    assert.nestedProperty(result, 'events.NodeDepositMinipool', 'Node deposit was not completed successfully');

    // Return created minipool address
    if (result.events !== undefined) {
        let nodeDepositEvent = Array.isArray(result.events.NodeDepositMinipool) ? result.events.NodeDepositMinipool[0] : result.events.NodeDepositMinipool;
        return nodeDepositEvent.returnValues._minipool;
    }
    return '';

}

