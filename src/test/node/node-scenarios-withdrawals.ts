// Imports
import { assert } from 'chai';
import NodeContract from '../../rocketpool/node/node-contract';


// Withdraw a deposit from a timed out or withdrawn minipool
export async function withdrawNodeMinipoolDeposit(nodeContract: NodeContract, {minipoolAddress, from}: {minipoolAddress: string, from: string}) {
    // :TODO: add assertions
    await nodeContract.withdrawMinipoolDeposit(minipoolAddress, {from, gas: 8000000});
}


// Withdraw ETH from the node contract
export async function withdrawNodeEth(nodeContract: NodeContract, {weiAmount, from}: {weiAmount: string, from: string}) {
    let balance1 = await nodeContract.getEthBalance();
    await nodeContract.withdrawEth(weiAmount, {from, gas: 8000000});
    let balance2 = await nodeContract.getEthBalance();
    assert.equal(parseInt(balance2), parseInt(balance1) - parseInt(weiAmount), 'Node contract ETH balance was not updated successfully');
}


// Withdraw RPL from the node contract
export async function withdrawNodeRpl(nodeContract: NodeContract, {weiAmount, from}: {weiAmount: string, from: string}) {
    let balance1 = await nodeContract.getRplBalance();
    await nodeContract.withdrawRpl(weiAmount, {from, gas: 8000000});
    let balance2 = await nodeContract.getRplBalance();
    assert.equal(parseInt(balance2), parseInt(balance1) - parseInt(weiAmount), 'Node contract RPL balance was not updated successfully');
}

