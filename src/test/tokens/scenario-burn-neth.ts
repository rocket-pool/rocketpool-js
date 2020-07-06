// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Burn nETH for ETH
export async function burnNeth(web3: Web3, rp: RocketPool, amount: string, options: SendOptions) {

    // Get initial ETH balance
    let ethBalance1 = await web3.eth.getBalance(options.from).then(value => web3.utils.toBN(value));

    // Burn nETH
    await rp.tokens.neth.burn(amount, options);

    // Get updated ETH balance
    let ethBalance2 = await web3.eth.getBalance(options.from).then(value => web3.utils.toBN(value));

    // Check balance
    assert(ethBalance2.gt(ethBalance1), 'Tokens were not burned for ETH successfully');

}

