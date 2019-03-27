// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';


// Burn RPB for ETH
export async function burnRpbForEth(web3: Web3, rp: RocketPool, {from, amountWei}: {from: string, amountWei: string}) {
    let balance1 = await web3.eth.getBalance(from);
    await rp.tokens.rpb.burnForEth(amountWei, {from, gas: 8000000});
    let balance2 = await web3.eth.getBalance(from);
    assert.equal(parseInt(balance2), parseInt(balance1) + parseInt(amountWei), 'RPB was not burned for ETH successfully');
}

