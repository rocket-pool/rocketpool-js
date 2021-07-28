// Imports
import Web3 from 'web3';
import {SendOptions} from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import {getValidatorPubkey, getValidatorSignature, getDepositDataRoot} from '../_utils/beacon';
import {getTxContractEvents} from '../_utils/contract';


// Get the number of minipools a node has
export async function getNodeMinipoolCount(web3: Web3, rp: RocketPool, nodeAddress: string) {
    return await rp.minipool.getNodeMinipoolCount(nodeAddress);
}

// Get the number of minipools a node has in Staking status
export async function getNodeStakingMinipoolCount(web3: Web3, rp: RocketPool, nodeAddress: string) {
    return await rp.minipool.getNodeStakingMinipoolCount(nodeAddress);
}


// Get the minimum required RPL stake for a minipool
export async function getMinipoolMinimumRPLStake(web3: Web3, rp: RocketPool) {

    // Load contracts
    const rocketDAOProtocolSettingsMinipool = await rp.contracts.get('rocketDAOProtocolSettingsMinipool');
    const rocketDAOProtocolSettingsNode = await rp.contracts.get('rocketDAOProtocolSettingsNode');

    // Load data
    let [depositUserAmount, minMinipoolStake, rplPrice] = await Promise.all([
        rocketDAOProtocolSettingsMinipool.methods.getHalfDepositUserAmount().call().then((value: any) => web3.utils.toBN(value)),
        rocketDAOProtocolSettingsNode.methods.getMinimumPerMinipoolStake().call().then((value: any) => web3.utils.toBN(value)),
        rp.network.getRPLPrice().then((value: any) => web3.utils.toBN(value)),
    ]);

    // Calculate & return
    return depositUserAmount.mul(minMinipoolStake).div(rplPrice);

}


// Create a minipool
export async function createMinipool(web3: Web3, rp: RocketPool, options: SendOptions): Promise<MinipoolContract | null> {

    // Get contract addresses
    const minipoolManagerAddress = await rp.contracts.address('rocketMinipoolManager');

    // Make node deposit
    let txReceipt = await rp.node.deposit(web3.utils.toWei('0', 'ether'), options);

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
    const withdrawalCredentials = await minipool.getWithdrawalCredentials();

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


// Submit a minipool withdrawable event
export async function submitMinipoolWithdrawable(web3: Web3, rp: RocketPool, minipoolAddress: string, options: SendOptions) {
    await rp.minipool.submitMinipoolWithdrawable(minipoolAddress, options);
}


// Send validator balance to a minipool
export async function payoutMinipool(minipool: MinipoolContract, confirm: boolean = false, options: SendOptions) {
    await minipool.contract.methods.payout(confirm).send(options);
}


// Withdraw node balances & rewards from a minipool and destroy it
export async function withdrawMinipool(minipool: MinipoolContract, options: SendOptions) {
    await minipool.withdraw(options);
}


// Dissolve a minipool
export async function dissolveMinipool(minipool: MinipoolContract, options: SendOptions) {
    await minipool.dissolve(options);
}


// Close a dissolved minipool and destroy it
export async function closeMinipool(minipool: MinipoolContract, options: SendOptions) {
    await minipool.close(options);
}
