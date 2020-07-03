// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Refund a minipool
export async function refund(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {

    // Get node address
    const nodeAddress = await minipool.getNodeAddress();

    // Get initial node balance
    let nodeBalance1 = await web3.eth.getBalance(nodeAddress).then(value => web3.utils.toBN(value));

    // Refund
    await minipool.refund(options);

    // Get updated node balance
    let nodeBalance2 = await web3.eth.getBalance(nodeAddress).then(value => web3.utils.toBN(value));

    // Check node balance
    assert(nodeBalance2.gt(nodeBalance1), 'Refund was not performed successfully');

}

