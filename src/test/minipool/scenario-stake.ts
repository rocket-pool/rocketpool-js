// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import { getValidatorPubkey, getValidatorSignature, getDepositDataRoot } from '../_utils/beacon';


// Stake a minipool
export async function stake(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {

    // Get withdrawal credentials
    const withdrawalCredentials = await rp.network.getWithdrawalCredentials();

    // Get validator deposit data
    let depositData = {
        pubkey: getValidatorPubkey(),
        withdrawalCredentials: Buffer.from(withdrawalCredentials.substr(2), 'hex'),
        amount: BigInt(32000000000), // gwei
        signature: getValidatorSignature(),
    };
    let depositDataRoot = getDepositDataRoot(depositData);

    // Stake
    await minipool.stake(depositData.pubkey, depositData.signature, depositDataRoot, options);

    // Check status
    let status = await minipool.getStatus();
    assert.equal(status, 2, 'Incorrect minipool status');

}

