// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';


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

