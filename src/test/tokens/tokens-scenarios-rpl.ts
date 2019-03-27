// Imports
import { assert } from 'chai';
import RocketPool from '../../rocketpool/rocketpool';


// Transfer RPL to a recipient
export async function transferRpl(rp: RocketPool, {from, to, amountWei}: {from: string, to: string, amountWei: string}) {
    let balance1 = await rp.tokens.rpl.balanceOf(to);
    await rp.tokens.rpl.transfer(to, amountWei, {from, gas: 8000000});
    let balance2 = await rp.tokens.rpl.balanceOf(to);
    assert.equal(parseInt(balance2), parseInt(balance1) + parseInt(amountWei), 'RPL was not transferred successfully');
}


// Approve an allowance for a spender
export async function approveRplTransfer(rp: RocketPool, {from, spender, amountWei}: {from: string, spender: string, amountWei: string}) {
    await rp.tokens.rpl.approve(spender, amountWei, {from, gas: 8000000});
    let allowance = await rp.tokens.rpl.allowance(from, spender);
    assert.equal(parseInt(allowance), parseInt(amountWei), 'Allowance was not updated successfully');
}


// Transfer RPL from an account to a recipient if approved
export async function transferRplFrom(rp: RocketPool, {from, fromAccount, to, amountWei}: {from: string, fromAccount: string, to: string, amountWei: string}) {
    let balance1 = await rp.tokens.rpl.balanceOf(to);
    await rp.tokens.rpl.transferFrom(fromAccount, to, amountWei, {from, gas: 8000000});
    let balance2 = await rp.tokens.rpl.balanceOf(to);
    assert.equal(parseInt(balance2), parseInt(balance1) + parseInt(amountWei), 'RPL was not transferred successfully');
}

