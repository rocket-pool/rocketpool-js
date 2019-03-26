// Imports
import NodeContract from '../../rocketpool/node/node-contract';


// Withdraw a deposit from a timed out or withdrawn minipool
export async function withdrawNodeMinipoolDeposit(nodeContract: NodeContract, {minipoolAddress, from}: {minipoolAddress: string, from: string}) {
    await nodeContract.withdrawMinipoolDeposit(minipoolAddress, {from, gas: 8000000});
}


// Withdraw ETH from the node contract
export async function withdrawNodeEth(nodeContract: NodeContract, {weiAmount, from}: {weiAmount: string, from: string}) {
    await nodeContract.withdrawEth(weiAmount, {from, gas: 8000000});
}


// Withdraw RPL from the node contract
export async function withdrawNodeRpl(nodeContract: NodeContract, {weiAmount, from}: {weiAmount: string, from: string}) {
    await nodeContract.withdrawRpl(weiAmount, {from, gas: 8000000});
}

