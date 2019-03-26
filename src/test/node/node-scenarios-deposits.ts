// Imports
import { assert } from 'chai';
import NodeContract from '../../rocketpool/node/node-contract';


// Make a deposit reservation
export async function reserveNodeDeposit(nodeContract: NodeContract, {durationId, depositInput, from}: {durationId: string, depositInput: Buffer, from: string}) {
    await nodeContract.reserveDeposit(durationId, depositInput, {from, gas: 8000000});
    let details = await nodeContract.getDepositReservation();
    assert.equal(details.durationId, durationId, 'Deposit reservation duration ID does not match');
    assert.equal(details.depositInput, '0x' + depositInput.toString('hex'), 'Deposit reservation DepositInput data does not match');
}


// Cancel a deposit reservation
export async function cancelNodeDepositReservation(nodeContract: NodeContract, {from}: {from: string}) {
    await nodeContract.cancelDepositReservation({from, gas: 8000000});
    let hasDepositReservation = await nodeContract.getHasDepositReservation();
    assert.isFalse(hasDepositReservation, 'Deposit reservation was not cancelled successfully');
}


// Complete a deposit
export async function completeNodeDeposit(nodeContract: NodeContract, {from, value}: {from: string, value: string}) {
    let result = await nodeContract.completeDeposit({from, value, gas: 8000000});
    assert.nestedProperty(result, 'events.NodeDepositMinipool', 'Node deposit was not completed successfully');
}

