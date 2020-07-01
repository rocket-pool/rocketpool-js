// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract/types';
import RocketPool from '../../rocketpool/rocketpool';


// Make a deposit
export async function deposit(web3: Web3, rp: RocketPool, options: SendOptions) {

    // Get balances
    function getBalances() {
        return Promise.all([
            rp.deposit.getBalance().then(value => web3.utils.toBN(value)),
            rp.tokens.reth.balanceOf(options.from).then(value => web3.utils.toBN(value)),
        ]).then(
            ([depositPoolEth, senderReth]) =>
            ({depositPoolEth, senderReth})
        );
    }

    // Get initial balances
    let balances1 = await getBalances();

    // Deposit
    await rp.deposit.deposit(options);

    // Get updated balances
    let balances2 = await getBalances();

    // Check balances
    let txValue = web3.utils.toBN(options.value as string);
    assert(balances2.depositPoolEth.eq(balances1.depositPoolEth.add(txValue)), 'Incorrect deposit pool balance');
    assert(balances2.senderReth.gt(balances1.senderReth), 'Deposit was not made successfully');

}

