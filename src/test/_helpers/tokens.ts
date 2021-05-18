// Imports
import Web3 from 'web3';
import {SendOptions} from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';

// Get the RPL balance of an address
export async function getRplBalance(web3: Web3, rp:RocketPool, address: string) {
    return await rp.tokens.rpl.balanceOf(address);
}


// Get the rETH balance of an address
export async function getRethBalance(web3: Web3, rp:RocketPool, address: string) {
    return await rp.tokens.reth.balanceOf(address);
}


// Get the current rETH exchange rate
export async function getRethExchangeRate(web3: Web3, rp:RocketPool) {
    return rp.tokens.reth.getExchangeRate();
}


// Get the current rETH token supply
export async function getRethTotalSupply(web3: Web3, rp:RocketPool) {
    return await rp.tokens.reth.getTotalSupply();
}


// Mint RPL to an address
export async function mintRPL(web3: Web3, rp:RocketPool, owner:string, toAddress:string, amount:string) {
    const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
    const rocketTokenDummyRPL = await rp.contracts.get('rocketTokenRPLFixedSupply');

    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei')).toString();
    let gas = 10000000;

    // Mint dummy RPL to address
    await rocketTokenDummyRPL.methods.mint(toAddress, amount).send({from: owner, gasPrice: gasPrice, gas: gas});

    // Swap dummy RPL for RPL
    await rocketTokenDummyRPL.methods.approve(rocketTokenRPL.options.address, amount).send({from: toAddress, gasPrice: gasPrice, gas: gas});
    await rocketTokenRPL.methods.swapTokens(amount).send({from: toAddress, gasPrice: gasPrice, gas: gas});
}


// Approve RPL to be spend by an address
export async function approveRPL(web3: Web3, rp:RocketPool, spender:string, amount:string, options:SendOptions) {
    await rp.tokens.rpl.approve(spender, amount, options);
}
