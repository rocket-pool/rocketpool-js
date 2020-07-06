// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Process a validator withdrawal
export async function processWithdrawal(web3: Web3, rp: RocketPool, validatorPubkey: Buffer, options: SendOptions) {

    // Process withdrawal
    await rp.network.processWithdrawal(validatorPubkey, options);

    // Get & check minipool withdrawal processed status
    let minipoolAddress = await rp.minipool.getMinipoolByPubkey(validatorPubkey);
    let withdrawalProcessed = await rp.minipool.getMinipoolWithdrawalProcessed(minipoolAddress);
    assert.isTrue(withdrawalProcessed, 'Withdrawal was not processed successfully');

}

