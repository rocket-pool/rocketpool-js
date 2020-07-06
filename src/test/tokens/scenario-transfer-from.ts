// Imports
import { assert } from 'chai';
import Web3 from 'web3';

// Transfer tokens from an address
export async function transferFrom(web3: Web3, token: any, from: string, to: string, amount: string, gas: number) {

    // Approve allowance
    await token.approve(to, amount, {from: from, gas: gas});

    // Transfer
    await token.transferFrom(from, to, amount, {from: to, gas: gas});

    // Get & check balance
    let balance = await token.balanceOf(to);
    assert(web3.utils.toBN(balance).eq(web3.utils.toBN(amount)), 'Tokens were not transferred successfully');

}

