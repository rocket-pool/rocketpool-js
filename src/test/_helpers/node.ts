// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import NodeContract from '../../rocketpool/node/node-contract';
import { getValidatorPubkey, getValidatorSignature } from '../../utils/casper';


// Register a node
export async function registerNode(web3: Web3, rp: RocketPool, {owner}: {owner: string}): Promise<[string, string]> {
    const rocketPoolToken = await rp.contracts.get('rocketPoolToken');

    // Node owner and contract addresses
    let nodeOwnerAddress: string = '';
    let nodeContractAddress: string = '';

    // Generate, seed and unlock node owner account
    nodeOwnerAddress = await web3.eth.personal.newAccount('');
    await web3.eth.sendTransaction({from: owner, to: nodeOwnerAddress, value: web3.utils.toWei('20', 'ether')});
    await web3.eth.personal.unlockAccount(nodeOwnerAddress, '', 0);

    // Add node
    let result = await rp.node.add('foo/bar', {from: nodeOwnerAddress, gas: 8000000});
    if (result.events !== undefined) nodeContractAddress = result.events.NodeAdd.returnValues.contractAddress;

    // Seed node contract
    await web3.eth.sendTransaction({from: owner, to: nodeContractAddress, value: web3.utils.toWei('60', 'ether')});
    await rocketPoolToken.methods.mint(nodeContractAddress, web3.utils.toWei('1000', 'ether')).send({from: owner, gas: 8000000});

    // Return node owner and contract addresses
    return [nodeOwnerAddress, nodeContractAddress];

}


// Create minipools under a node
export async function createNodeMinipool(web3: Web3, {nodeContract, nodeOwner, stakingDurationId}: {nodeContract: NodeContract, nodeOwner: string, stakingDurationId: string}): Promise<string> {

    // Make deposit reservation
    await nodeContract.reserveDeposit(stakingDurationId, getValidatorPubkey(), getValidatorSignature(), {from: nodeOwner, gas: 8000000});

    // Complete deposit
    let result = await nodeContract.completeDeposit({from: nodeOwner, gas: 8000000});

    // Return created minipool address
    if (result.events !== undefined) {
        let nodeDepositEvent = Array.isArray(result.events.NodeDepositMinipool) ? result.events.NodeDepositMinipool[0] : result.events.NodeDepositMinipool;
        return nodeDepositEvent.returnValues._minipool;
    }
    return '';

}

