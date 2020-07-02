// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract/types';
import RocketPool from '../../rocketpool/rocketpool';


// Make a deposit
export async function deposit(web3: Web3, rp: RocketPool, options: SendOptions) {

    // Get initial rETH balance
    let rethBalance1 = await rp.tokens.reth.balanceOf(options.from).then(value => web3.utils.toBN(value));

    // Deposit
    await rp.deposit.deposit(options);

    // Get updated rETH balance
    let rethBalance2 = await rp.tokens.reth.balanceOf(options.from).then(value => web3.utils.toBN(value));

    // Check rETH balance
    assert(rethBalance2.gt(rethBalance1), 'Deposit was not made successfully');

}

