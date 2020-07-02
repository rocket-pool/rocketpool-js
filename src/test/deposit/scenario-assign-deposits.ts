// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Assign deposits
export async function assignDeposits(web3: Web3, rp: RocketPool, options: SendOptions) {

	// Get initial minipool queue length
	let queueLength1 = await rp.minipool.getQueueTotalLength();

	// Assign deposits
    await rp.deposit.assignDeposits(options);

    // Get updated minipool queue length
    let queueLength2 = await rp.minipool.getQueueTotalLength();

    // Check minipool queue length
    assert.isBelow(queueLength2, queueLength1, 'Deposits were not assigned successfully');

}

