// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { mintRPL } from "../tokens/scenario-rpl-mint";
import { setDAONodeTrustedBootstrapMember } from "../dao/scenario-dao-node-trusted-bootstrap";
import { daoNodeTrustedMemberJoin } from "../dao/scenario-dao-node-trusted";
import { SendOptions } from "web3-eth-contract";
import { getDepositDataRoot, getValidatorPubkey, getValidatorSignature } from "../_utils/beacon";

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
	const before = await rp.node.getNodeRPLStake(options.from).then((value: any) => web3.utils.toBN(value));
	await rp.node.stakeRPL(amount, options);
	const after = await rp.node.getNodeRPLStake(options.from).then((value: any) => web3.utils.toBN(value));
	assert(after.sub(before).eq(web3.utils.toBN(amount)), "Staking balance did not increase by amount staked");
}

// Withdraw a node RPL stake
export async function nodeWithdrawRPL(web3: Web3, rp: RocketPool, amount: string, txOptions: SendOptions) {
	await rp.node.withdrawRPL(amount, txOptions);
}

// Make a node deposit
let minipoolSalt = 0;
export async function nodeDeposit(web3: Web3, rp: RocketPool, options: SendOptions) {
	// Get contract addresses
	const rocketMinipoolManager = await rp.contracts.get("rocketMinipoolManager");
	const rocketStorage = await rp.contracts.get("rocketStorage");

	// Get artifact and bytecode
	const rocketMinipool = require("../../contracts/RocketMinipool.json");
	const contractBytecode = rocketMinipool.bytecode;

	// Get deposit type from tx amount
	// @ts-ignore
	const depositType = await rp.node.getDepositType(options.value.toString());

	// Construct creation code for minipool deploy
	const constructorArgs = web3.eth.abi.encodeParameters(["address", "address", "uint8"], [rocketStorage.options.address, options.from, depositType]);
	const deployCode = contractBytecode + constructorArgs.substr(2);
	const salt = minipoolSalt++;

	// Calculate keccak(nodeAddress, salt)
	const nodeSalt = web3.utils.soliditySha3({ type: "address", value: options.from }, { type: "uint256", value: salt.toString() });

	// Calculate hash of deploy code
	const bytecodeHash = web3.utils.soliditySha3({ type: "bytes", value: deployCode });

	// Construct deterministic minipool address
	const raw = web3.utils.soliditySha3(
		{ type: "bytes1", value: "0xff" },
		{ type: "address", value: rocketMinipoolManager.options.address },
		{ type: "bytes32", value: nodeSalt !== null ? nodeSalt : "" },
		{ type: "bytes32", value: bytecodeHash !== null ? bytecodeHash : "" }
	);

	// @ts-ignore
	const minipoolAddress = "0x" + raw.substr(raw.length - 40);
	const withdrawalCredentials = "0x010000000000000000000000" + minipoolAddress.substr(2);

	// Get validator deposit data
	const depositData = {
		pubkey: getValidatorPubkey(),
		withdrawalCredentials: Buffer.from(withdrawalCredentials.substr(2), "hex"),
		amount: Number(16000000000), // gwei
		signature: getValidatorSignature(),
	};

	const depositDataRoot = getDepositDataRoot(depositData);
	const minimumNodeFee = web3.utils.toWei("0", "ether");

	await rp.node.deposit(minimumNodeFee, depositData.pubkey, depositData.signature, depositDataRoot, salt, minipoolAddress, options);
}
