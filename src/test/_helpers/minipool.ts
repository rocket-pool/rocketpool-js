// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';
import NodeContract from '../../rocketpool/node/node-contract';
import { getValidatorPubkey, getValidatorSignature } from '../../utils/casper';
import { getValidatorDepositDataRoot } from './casper';


// Stall a minipool
export async function stallMinipool(web3: Web3, rp: RocketPool, {minipoolAddress, fromAddress}: {minipoolAddress: string, fromAddress: string}) {

    // Get minipool timeout time
    let minipoolTimeout = await rp.settings.minipool.getMinipoolTimeout();

    // Advance EVM time
    await new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'evm_increaseTime',
            params: [minipoolTimeout],
            id: new Date().getSeconds(),
        }, (err?: any, result?: any): void => {
            if (err) reject(err);
            if (result) resolve(result.result);
        });
    });

    // Update minipool status
    await rp.contracts.make('rocketMinipool', minipoolAddress).then(minipool => {
        return minipool.methods.updateStatus().send({from: fromAddress, gas: 8000000});
    });

}


// Make a single minipool begin staking
export async function stakeSingleMinipool(rp: RocketPool,
    {minipoolAddress, nodeContract, nodeOwner, depositorContract, depositor, stakingDurationId}:
    {minipoolAddress: string, nodeContract: NodeContract, nodeOwner: string, depositorContract: GroupAccessorContract, depositor: string, stakingDurationId: string}
) {

    // Get deposit settings
    let chunkSize = await rp.settings.deposit.getDepositChunkSize();
    let chunksPerDepositTx = await rp.settings.deposit.getChunkAssignMax();

    // Get minipool settings
    let miniPoolLaunchAmount = await rp.settings.minipool.getMinipoolLaunchAmount();
    let miniPoolAssignAmount = Math.floor(parseInt(miniPoolLaunchAmount) / 2);

    // Parameters to fill initial minipool and leave change in deposit queue
    let selfAssignableDepositSize = parseInt(chunkSize) * chunksPerDepositTx;
    let selfAssignableDepositsPerMinipool = Math.floor(miniPoolAssignAmount / selfAssignableDepositSize);

    // Fill minipool
    for (let di = 0; di < selfAssignableDepositsPerMinipool; ++di) {
        await depositorContract.deposit(stakingDurationId, {from: depositor, value: selfAssignableDepositSize, gas: 8000000});
    }

    // Get RP withdrawal credentials
    const rocketNodeAPI = await rp.contracts.get('rocketNodeAPI');
    let withdrawalCredentials = await rocketNodeAPI.methods.getWithdrawalCredentials().call();

    // Get deposit data
    let depositData = {
        pubkey: getValidatorPubkey(),
        withdrawal_credentials: Buffer.from(withdrawalCredentials.substr(2), 'hex'),
        amount: 32000000000, //gwei
        signature: getValidatorSignature(),
    };
    let depositDataRoot = getValidatorDepositDataRoot(depositData);

    // Stake minipool
    await nodeContract.stakeMinipool(minipoolAddress, depositData.pubkey, depositData.signature, depositDataRoot, {from: nodeOwner, gas: 8000000});

}


// Make minipool withdraw with balance
export async function withdrawMinipool(rp: RocketPool, {minipoolAddress, balance, nodeOperator, owner}: {minipoolAddress: string, balance: string, nodeOperator: string, owner: string}) {
    const rocketNodeWatchtower = await rp.contracts.get('rocketNodeWatchtower');
    const rocketAdmin = await rp.contracts.get('rocketAdmin');

    // Set node status
    let nodeTrusted = await rp.node.getTrusted(nodeOperator);
    if (!nodeTrusted) await rocketAdmin.methods.setNodeTrusted(nodeOperator, true).send({from: owner, gas: 8000000});

    // Logout & withdraw minipool
    await rocketNodeWatchtower.methods.logoutMinipool(minipoolAddress).send({from: nodeOperator, gas: 8000000});
    await rocketNodeWatchtower.methods.withdrawMinipool(minipoolAddress, balance).send({from: nodeOperator, gas: 8000000});

}

