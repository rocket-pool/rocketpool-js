// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Burn nETH for ETH
export async function burnNeth(web3: Web3, rp: RocketPool, amount: string, options: SendOptions) {

    // Load contracts
    const rocketTokenNETH = await rp.contracts.get('rocketTokenNETH');

    // Get balances
    function getBalances() {
        return Promise.all([
            rocketTokenNETH.methods.totalSupply().call().then((value: string) => web3.utils.toBN(value)),
            web3.eth.getBalance(rocketTokenNETH.options.address).then((value: string) => web3.utils.toBN(value)),
            rocketTokenNETH.methods.balanceOf.call(options.from).then((value: string) => web3.utils.toBN(value)),
            web3.eth.getBalance(options.from).then((value: string) => web3.utils.toBN(value)),
        ]).then(
            ([tokenSupply, tokenEthBalance, userTokenBalance, userEthBalance]) =>
                ({tokenSupply, tokenEthBalance, userTokenBalance, userEthBalance})
        );
    }

    // Get initial balances
    let balances1 = await getBalances();

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();

    // Burn tokens & get tx fee
    let txReceipt = await rocketTokenNETH.methods.burn(amount).send(options);
    let txFee = gasPrice.mul(web3.utils.toBN(txReceipt.receipt.gasUsed));

    // Get updated balances
    let balances2 = await getBalances();

    // Calculate values
    let burnAmount = web3.utils.toBN(amount);

    // Check balances
    assert(balances2.tokenSupply.eq(balances1.tokenSupply.sub(burnAmount)), 'Incorrect updated token supply');
    assert(balances2.tokenEthBalance.eq(balances1.tokenEthBalance.sub(burnAmount)), 'Incorrect updated token ETH balance');
    assert(balances2.userTokenBalance.eq(balances1.userTokenBalance.sub(burnAmount)), 'Incorrect updated user token balance');
    assert(balances2.userEthBalance.eq(balances1.userEthBalance.add(burnAmount).sub(txFee)), 'Incorrect updated user ETH balance');

}

