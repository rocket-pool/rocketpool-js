// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import NodeContract from '../../rocketpool/node/node-contract';


// Register node
export async function registerNode(web3: Web3, rp: RocketPool, {timezone, owner}: {timezone: string, owner: string}): Promise<[string, string]> {
    const rocketPoolToken = await rp.contracts.get('rocketPoolToken');

    // Node owner and contract addresses
    let nodeOwnerAddress: string = '';
    let nodeContractAddress: string = '';

    // Generate, seed and unlock node owner account
    nodeOwnerAddress = await web3.eth.personal.newAccount('');
    await web3.eth.sendTransaction({from: owner, to: nodeOwnerAddress, value: web3.utils.toWei('20', 'ether')});
    await web3.eth.personal.unlockAccount(nodeOwnerAddress, '', 0);

    // Add node
    let result = await rp.node.add(timezone, {from: nodeOwnerAddress, gas: 8000000});
    assert.nestedProperty(result, 'events.NodeAdd.returnValues.contractAddress', 'Node was not registered successfully');
    if (result.events !== undefined) nodeContractAddress = result.events.NodeAdd.returnValues.contractAddress;

    // Seed node contract
    await web3.eth.sendTransaction({from: owner, to: nodeContractAddress, value: web3.utils.toWei('5', 'ether')});
    await rocketPoolToken.methods.mint(nodeContractAddress, web3.utils.toWei('1000', 'ether')).send({from: owner, gas: 8000000});

    // Check node contract address
    let nodeContractAddressTest = await rp.node.getContractAddress(nodeOwnerAddress);
    assert.equal(nodeContractAddressTest.toLowerCase(), nodeContractAddress.toLowerCase(), 'Registered node contract address does not match');

    // Check node details
    let nodeContract = await rp.node.getContract(nodeContractAddress);
    let nodeOwnerAddressTest = await nodeContract.getOwner();
    assert.equal(nodeOwnerAddressTest.toLowerCase(), nodeOwnerAddress.toLowerCase(), 'Node contract owner address does not match');

    // Return node owner and contract addresses
    return [nodeOwnerAddress, nodeContractAddress];

}


// Set the node's timezone location
export async function setNodeTimezone(rp: RocketPool, {timezone, from}: {timezone: string, from: string}) {
    await rp.node.setTimezoneLocation(timezone, {from, gas: 8000000});
    let timezoneLocationTest = await rp.node.getTimezoneLocation(from);
    assert.equal(timezoneLocationTest, timezone, 'Node timezone was not updated successfully');
}


// Set the node's rewards address
export async function setNodeRewardsAddress(nodeContract: NodeContract, {rewardsAddress, from}: {rewardsAddress: string, from: string}) {
    await nodeContract.setRewardsAddress(rewardsAddress, {from, gas: 8000000});
    let rewardsAddressTest = await nodeContract.getRewardsAddress();
    assert.equal(rewardsAddressTest.toLowerCase(), rewardsAddress.toLowerCase(), 'Rewards address was not updated successfully');
}


// Make a deposit reservation
export async function reserveNodeDeposit(nodeContract: NodeContract, {durationId, depositInput, from}: {durationId: string, depositInput: Buffer, from: string}) {
    await nodeContract.reserveDeposit(durationId, depositInput, {from, gas: 8000000});
    let details = await nodeContract.getDepositReservation();
    assert.equal(details.durationId, durationId, 'Deposit reservation duration ID does not match');
    assert.equal(details.depositInput, '0x' + depositInput.toString('hex'), 'Deposit reservation DepositInput data does not match');
}


// Cancel a deposit reservation
export async function cancelNodeDepositReservation(nodeContract: NodeContract, {from}: {from: string}) {
    await nodeContract.cancelDepositReservation({from, gas: 8000000});
    let hasDepositReservation = await nodeContract.getHasDepositReservation();
    assert.isFalse(hasDepositReservation, 'Deposit reservation was not cancelled successfully');
}


// Complete a deposit
export async function completeNodeDeposit(nodeContract: NodeContract, {from, value}: {from: string, value: string}) {
    let result = await nodeContract.completeDeposit({from, value, gas: 8000000});
    assert.nestedProperty(result, 'events.NodeDepositMinipool', 'Node deposit was not completed successfully');
}


// Withdraw ETH from the node contract
export async function withdrawNodeEth(nodeContract: NodeContract, {weiAmount, from}: {weiAmount: string, from: string}) {
    await nodeContract.withdrawEth(weiAmount, {from, gas: 8000000});
}


// Withdraw RPL from the node contract
export async function withdrawNodeRpl(nodeContract: NodeContract, {weiAmount, from}: {weiAmount: string, from: string}) {
    await nodeContract.withdrawRpl(weiAmount, {from, gas: 8000000});
}

