// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';


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

