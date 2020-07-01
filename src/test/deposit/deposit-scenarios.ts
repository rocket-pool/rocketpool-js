// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract/types';
import RocketPool from '../../rocketpool/rocketpool';


// Make a deposit
export async function deposit(web3: Web3, rp: RocketPool, options: SendOptions) {
    let rethBalance1 = web3.utils.toBN(await rp.tokens.reth.balanceOf(options.from));
    await rp.deposit.deposit(options);
    let rethBalance2 = web3.utils.toBN(await rp.tokens.reth.balanceOf(options.from));
    assert(rethBalance2.gt(rethBalance1), 'Deposit was not made successfully');
}

