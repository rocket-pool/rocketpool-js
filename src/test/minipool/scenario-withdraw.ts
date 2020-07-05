// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Withdraw a minipool
export async function withdraw(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {

    // Get node address
    const nodeAddress = await minipool.getNodeAddress();

    // Get initial nETH balance
    let nethBalance1 = await rp.tokens.neth.balanceOf(nodeAddress).then(value => web3.utils.toBN(value));

    // Withdraw
    await minipool.withdraw(options);

    // Get updated nETH balance
    let nethBalance2 = await rp.tokens.neth.balanceOf(nodeAddress).then(value => web3.utils.toBN(value));

    // Check nETH balance
    assert(nethBalance2.gt(nethBalance1), 'Withdrawal was not performed successfully');

}

