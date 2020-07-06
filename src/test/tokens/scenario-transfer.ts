// Imports
import { assert } from 'chai';
import Web3 from 'web3';

// Transfer tokens
export async function transfer(web3: Web3, token: any, from: string, to: string, amount: string, gas: number) {

    // Transfer
    await token.transfer(to, amount, {from: from, gas: gas});

    // Get & check balance
    let balance = await token.balanceOf(to);
    assert(web3.utils.toBN(balance).eq(web3.utils.toBN(amount)), 'Tokens were not transferred successfully');

}

