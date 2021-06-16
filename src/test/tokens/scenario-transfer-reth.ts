// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {SendOptions} from 'web3-eth-contract';

export async function transferReth(web3: Web3, rp: RocketPool, to: string, amount: string, options: SendOptions) {

    // Get balances
    function getBalances() {
        return Promise.all([
            rp.tokens.reth.balanceOf(options.from).then((value: any) => web3.utils.toBN(value)),
            rp.tokens.reth.balanceOf(to).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([userFromTokenBalance, userToTokenBalance]) =>
                ({userFromTokenBalance, userToTokenBalance})
        );
    }

    // Get initial balances
    let balances1 = await getBalances();

    // Transfer tokens
    await rp.tokens.reth.transfer(to, amount, options);

    // Get updated balances
    let balances2 = await getBalances();

    // Check balances
    assert(balances2.userFromTokenBalance.eq(balances1.userFromTokenBalance.sub(web3.utils.toBN(amount))), 'Incorrect updated user token balance');
    assert(balances2.userToTokenBalance.eq(balances1.userToTokenBalance.add(web3.utils.toBN(amount))), 'Incorrect updated user token balance');

}
