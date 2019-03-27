// Imports
import { assert } from 'chai';
import RocketPool from '../../rocketpool/rocketpool';


// Transfer RPL to a recipient
export async function transferRpl(rp: RocketPool, {from, to, amountWei}: {from: string, to: string, amountWei: string}) {
    await rp.tokens.rpl.transfer(to, amountWei, {from, gas: 8000000});
}


// Approve an allowance for a spender
export async function approveRplTransfer(rp: RocketPool, {from, spender, amountWei}: {from: string, spender: string, amountWei: string}) {
    await rp.tokens.rpl.approve(spender, amountWei, {from, gas: 8000000});
}


// Transfer RPL from an account to a recipient if approved
export async function transferRplFrom(rp: RocketPool, {from, fromAccount, to, amountWei}: {from: string, fromAccount: string, to: string, amountWei: string}) {
    await rp.tokens.rpl.transferFrom(fromAccount, to, amountWei, {from, gas: 8000000});
}

