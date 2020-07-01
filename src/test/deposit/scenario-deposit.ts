// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract/types';
import RocketPool from '../../rocketpool/rocketpool';


// Make a deposit
export async function deposit(rp: RocketPool, options?: SendOptions) {
    await rp.deposit.deposit(options);
}

