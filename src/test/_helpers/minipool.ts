// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';


// Stall a minipool
export async function stallMinipool(web3: Web3, rp: RocketPool, minipoolAddress: string, fromAddress: string) {

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
export async function stakeSingleMinipool(rp: RocketPool, depositorContract: GroupAccessorContract, depositor: string) {

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
        await depositorContract.deposit('3m', {from: depositor, value: selfAssignableDepositSize, gas: 8000000});
    }

}

