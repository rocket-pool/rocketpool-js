// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {SendOptions} from 'web3-eth-contract';

export async function burnFixedRPL(web3: Web3, rp: RocketPool, amount: string, options: SendOptions) {

    // Load contracts
    const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
    const rocketTokenDummyRPL = await rp.contracts.get('rocketTokenRPLFixedSupply');

    // Get balances
    function getBalances() {
        return Promise.all([
            rocketTokenDummyRPL.methods.balanceOf(options.from).call(),
            rocketTokenRPL.methods.totalSupply().call(),
            rocketTokenRPL.methods.balanceOf(options.from).call(),
            rocketTokenDummyRPL.methods.balanceOf(rocketTokenDummyRPL.options.address).call(),
            rocketTokenRPL.methods.balanceOf(rocketTokenRPL.options.address).call(),
        ]).then(
            ([rplFixedUserBalance, rplTokenSupply, rplUserBalance, rplContractBalanceOfFixedSupply, rplContractBalanceOfSelf]) =>
                ({
                    rplFixedUserBalance: rplFixedUserBalance,
                    rplTokenSupply: rplTokenSupply,
                    rplUserBalance: web3.utils.toBN(rplUserBalance),
                    rplContractBalanceOfFixedSupply: rplContractBalanceOfFixedSupply,
                    rplContractBalanceOfSelf: web3.utils.toBN(rplContractBalanceOfSelf)})
        );
    }

    // Get initial balances
    let balances1 = await getBalances();

    //console.log(web3.utils.fromWei(amount));
    //console.log(web3.utils.fromWei(balances1.rplFixedUserBalance), web3.utils.fromWei(balances1.rplContractBalanceOfSelf), web3.utils.fromWei(balances1.rplUserBalance));

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();
    options.gas = 1000000;

    // Burn tokens & get tx fee
    let txReceipt = await rp.tokens.rpl.swapTokens(amount, options);
    let txFee = gasPrice.mul(web3.utils.toBN(txReceipt.gasUsed));

    // Get updated balances
    let balances2 = await getBalances();

    //console.log(web3.utils.fromWei(amount));
    //console.log(web3.utils.fromWei(balances2.rplFixedUserBalance), web3.utils.fromWei(balances2.rplContractBalanceOfSelf), web3.utils.fromWei(balances2.rplUserBalance));

    // Calculate values
    let mintAmount = web3.utils.toBN(amount);


    // Check balances
    assert(balances2.rplUserBalance.eq(balances1.rplUserBalance.add(mintAmount)), 'Incorrect updated user token balance');
    assert(balances2.rplContractBalanceOfSelf.eq(balances1.rplContractBalanceOfSelf.sub(mintAmount)), 'RPL contract has not sent the RPL to the user address');


}
