// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {mintRPL} from '../tokens/scenario-rpl-mint';
import {setDaoNodeTrustedBootstrapMember} from '../dao/scenario-dao-node-trusted-bootstrap';
import {daoNodeTrustedMemberJoin} from '../dao/scenario-dao-node-trusted';
import {SendOptions} from 'web3-eth-contract';


// Get a node's RPL stake
export async function getNodeRPLStake(web3: Web3, rp: RocketPool, nodeAddress: string) {
    let rocketNodeStaking = await rp.contracts.get('rocketNodeStaking');
    let stake = await rocketNodeStaking.methods.getNodeRPLStake(nodeAddress).call();
    return stake;
}

export async function setNodeTrusted(web3: Web3, rp: RocketPool, _account: string, id: string, email: string, owner:string) {
    // Get the DAO settings
    let daoNodeSettings = await rp.contracts.get('rocketDAONodeTrustedSettingsMembers');
    // How much RPL is required for a trusted node bond?
    let rplBondAmount = web3.utils.fromWei(await daoNodeSettings.methods.getRPLBond().call());
    // Mint RPL bond required for them to join
    await mintRPL(web3, rp,_account, rplBondAmount, owner);
    // Set allowance for the Vault to grab the bond
    let rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
    let rocketDAONodeTrustedActions = await rp.contracts.get('rocketDAONodeTrustedActions');
    let _amount = web3.utils.toWei(rplBondAmount.toString(), 'ether');
    await rocketTokenRPL.methods.approve(rocketDAONodeTrustedActions.options.address, _amount).send({ from: _account });
    // Create invites for them to become a member
    await setDaoNodeTrustedBootstrapMember(web3, rp, id, email, _account, {from: owner});
    // Now get them to join
    await daoNodeTrustedMemberJoin(web3, rp,{from: _account});
}

// Get a node's effective RPL stake
export async function getNodeEffectiveRPLStake(web3: Web3, rp: RocketPool, nodeAddress: string) {
    let rocketNodeStaking = await rp.contracts.get('rocketNodeStaking');
    let effectiveStake = await rocketNodeStaking.methods.getNodeEffectiveRPLStake(nodeAddress).call();
    return effectiveStake;
}

// Get a node's minipool RPL stake
export async function getNodeMinimumRPLStake(web3: Web3, rp: RocketPool, nodeAddress: string) {
    let rocketNodeStaking = await rp.contracts.get('rocketNodeStaking');
    let minimumStake = await rocketNodeStaking.methods.getNodeMinimumRPLStake(nodeAddress).call();
    return minimumStake;
}

export async function registerNode(web3: Web3, rp: RocketPool, options: SendOptions) {
    let rocketNodeManager = await rp.contracts.get('rocketNodeManager');
    await rocketNodeManager.methods.registerNode('Australia/Brisbane').send(options);
}

// Set a withdrawal address for a node
export async function setNodeWithdrawalAddress(web3: Web3, rp: RocketPool, withdrawalAddress: string, options: SendOptions) {
    let rocketNodeManager = await rp.contracts.get('rocketNodeManager');
    await rocketNodeManager.methods.setWithdrawalAddress(withdrawalAddress).send(options);
}

// Submit a node RPL stake
export async function nodeStakeRPL(web3: Web3, rp: RocketPool, amount: string, options: SendOptions) {
    let rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
    let rocketNodeStaking = await rp.contracts.get('rocketNodeStaking');

    options.gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei')).toString();
    options.gas = 1000000;

    await rocketTokenRPL.methods.approve(rocketNodeStaking.options.address, amount).send(options);
    await rocketNodeStaking.methods.stakeRPL(amount).send(options);
}

// Make a node deposit
export async function nodeDeposit(web3: Web3, rp: RocketPool, options: SendOptions) {
    let rocketNodeDeposit = await rp.contracts.get('rocketNodeDeposit');
    await rocketNodeDeposit.methods.deposit(web3.utils.toWei('0', 'ether')).send(options);
}
