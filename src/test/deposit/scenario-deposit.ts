// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import {SendOptions} from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Make a deposit
export async function deposit(web3: Web3, rp: RocketPool, options: SendOptions) {

    // Load contracts
    let rocketDepositPool = await rp.contracts.get('rocketDepositPool');
    let rocketTokenRETH = await rp.contracts.get('rocketTokenRETH');
    let rocketVault = await rp.contracts.get('rocketVault');

    // Get parameters
    let rethExchangeRate = await rocketTokenRETH.methods.getExchangeRate().call().then((value: any) => web3.utils.toBN(value));

    // Get balances
    function getBalances() {
        return Promise.all([
            rp.deposit.getBalance().then((value: any) => web3.utils.toBN(value)),
            web3.eth.getBalance(rocketVault.options.address).then((value: any) => web3.utils.toBN(value)),
            rp.tokens.reth.balanceOf(options.from).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([depositPoolEth, vaultEth, userReth]) =>
                ({depositPoolEth, vaultEth, userReth})
        );
    }

    // Get initial balances
    let balances1 = await getBalances();

    // Deposit
    await rp.deposit.deposit(options);

    // Get updated balances
    let balances2 = await getBalances();

    // Calculate values
    let txValue = web3.utils.toBN((options.value as string));
    let calcBase = web3.utils.toBN(web3.utils.toWei('1', 'ether'));
    let expectedRethMinted = txValue.mul(calcBase).div(rethExchangeRate);

    // Check balances
    assert(balances2.depositPoolEth.eq(balances1.depositPoolEth.add(txValue)), 'Incorrect updated deposit pool ETH balance');
    assert(balances2.vaultEth.eq(balances1.vaultEth.add(txValue)), 'Incorrect updated vault ETH balance');
    assert(balances2.userReth.eq(balances1.userReth.add(expectedRethMinted)), 'Incorrect updated user rETH balance');

}

