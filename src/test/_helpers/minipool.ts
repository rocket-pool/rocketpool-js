// Imports
import Web3 from 'web3';
import { Contract, SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import { getValidatorPubkey, getValidatorSignature, getDepositDataRoot } from '../_utils/beacon';
import { getTxContractEvents } from '../_utils/contract';


// Create a minipool
export async function createMinipool(web3: Web3, rp: RocketPool, options: SendOptions): Promise<MinipoolContract | null> {

    // Get contract addresses
    const minipoolManagerAddress: string = await rp.contracts.rocketStorage.then((rocketStorage: Contract): Promise<string> => {
        return rocketStorage.methods.getAddress(web3.utils.soliditySha3('contract.name', 'rocketMinipoolManager')).call();
    });

    // Make node deposit
    let txReceipt = await rp.node.deposit(0, options);

    // Get minipool created events
    let minipoolCreatedEvents = getTxContractEvents(web3, txReceipt, minipoolManagerAddress, 'MinipoolCreated', [
        {type: 'address', name: 'minipool', indexed: true},
        {type: 'address', name: 'node', indexed: true},
        {type: 'uint256', name: 'created'},
    ]);

    // Return minipool instance
    if (!minipoolCreatedEvents.length) return null;
    return rp.minipool.getMinipoolContract(minipoolCreatedEvents[0].minipool);

}


// Progress a minipool to staking
export async function stakeMinipool(web3: Web3, rp: RocketPool, minipool: MinipoolContract, validatorPubkey: Buffer | null, options: SendOptions) {

    // Create validator pubkey
    if (!validatorPubkey) validatorPubkey = getValidatorPubkey();

    // Get withdrawal credentials
    const withdrawalCredentials = await rp.network.getWithdrawalCredentials();

    // Get validator deposit data
    let depositData = {
        pubkey: validatorPubkey,
        withdrawalCredentials: Buffer.from(withdrawalCredentials.substr(2), 'hex'),
        amount: BigInt(32000000000), // gwei
        signature: getValidatorSignature(),
    };
    let depositDataRoot = getDepositDataRoot(depositData);

    // Stake
    await minipool.stake(depositData.pubkey, depositData.signature, depositDataRoot, options);

}

