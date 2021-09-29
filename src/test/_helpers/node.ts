// Imports
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { mintRPL } from "../tokens/scenario-rpl-mint";
import { setDAONodeTrustedBootstrapMember } from "../dao/scenario-dao-node-trusted-bootstrap";
import { daoNodeTrustedMemberJoin } from "../dao/scenario-dao-node-trusted";
import { SendOptions } from "web3-eth-contract";

// Get a node's RPL stake
export async function getNodeRPLStake(web3: Web3, rp: RocketPool, nodeAddress: string) {
	return await rp.node.getNodeRPLStake(nodeAddress);
}

export async function setNodeTrusted(web3: Web3, rp: RocketPool, _account: string, id: string, url: string, owner: string) {
	// Get the DAO settings
	const daoNodeSettings = await rp.contracts.get("rocketDAONodeTrustedSettingsMembers");
	// How much RPL is required for a trusted node bond?
	const rplBondAmount = web3.utils.fromWei(await daoNodeSettings.methods.getRPLBond().call());
	// Mint RPL bond required for them to join
	await mintRPL(web3, rp, _account, rplBondAmount, owner);
	// Set allowance for the Vault to grab the bond
	const rocketTokenRPL = await rp.contracts.get("rocketTokenRPL");
	const rocketDAONodeTrustedActions = await rp.contracts.get("rocketDAONodeTrustedActions");
	const _amount = web3.utils.toWei(rplBondAmount.toString(), "ether");
	await rocketTokenRPL.methods.approve(rocketDAONodeTrustedActions.options.address, _amount).send({ from: _account });
	// Create invites for them to become a member
	await setDAONodeTrustedBootstrapMember(web3, rp, id, url, _account, {
		from: owner,
	});
	// Now get them to join
	await daoNodeTrustedMemberJoin(web3, rp, { from: _account });
}

// Get a node's effective RPL stake
export async function getNodeEffectiveRPLStake(web3: Web3, rp: RocketPool, nodeAddress: string) {
	return await rp.node.getNodeEffectiveRPLStake(nodeAddress);
}

// Get a node's minipool RPL stake
export async function getNodeMinimumRPLStake(web3: Web3, rp: RocketPool, nodeAddress: string) {
	return await rp.node.getNodeMinimumRPLStake(nodeAddress);
}

// Get total effective RPL stake
export async function getTotalEffectiveRPLStake(web3: Web3, rp: RocketPool) {
	return await rp.node.getTotalEffectiveRPLStake();
}

// Get calculated effective RPL stake
export async function getCalculatedTotalEffectiveRPLStake(web3: Web3, rp: RocketPool, price: string) {
	return await rp.node.calculateTotalEffectiveRPLStake(0, 0, price);
}

export async function registerNode(web3: Web3, rp: RocketPool, options: SendOptions) {
	await rp.node.registerNode("Australia/Brisbane", options);
}

// Set a withdrawal address for a node
export async function setNodeWithdrawalAddress(web3: Web3, rp: RocketPool, nodeAddress: string, withdrawalAddress: string, options: SendOptions) {
	await rp.node.setWithdrawalAddress(nodeAddress, withdrawalAddress, true, options);
}

// Submit a node RPL stake
export async function nodeStakeRPL(web3: Web3, rp: RocketPool, amount: string, options: SendOptions) {
	const rocketNodeStaking = await rp.contracts.get("rocketNodeStaking");

	options.gasPrice = web3.utils.toBN(web3.utils.toWei("20", "gwei")).toString();
	options.gas = 1000000;

	await rp.tokens.rpl.approve(rocketNodeStaking.options.address, amount, options);
	await rp.node.stakeRPL(amount, options);
}

// Withdraw a node RPL stake
export async function nodeWithdrawRPL(web3: Web3, rp: RocketPool, amount: string, txOptions: SendOptions) {
	await rp.node.withdrawRPL(amount, txOptions);
}

// Make a node deposit
export async function nodeDeposit(web3: Web3, rp: RocketPool, options: SendOptions) {
	await rp.node.deposit(web3.utils.toWei("0", "ether"), options);
}
