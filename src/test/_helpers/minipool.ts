// Imports
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { getValidatorPubkey, getValidatorSignature, getDepositDataRoot } from "../_utils/beacon";
import { getTxContractEvents } from "../_utils/contract";

// Get the number of minipools a node has
export async function getNodeMinipoolCount(web3: Web3, rp: RocketPool, nodeAddress: string) {
	return await rp.minipool.getNodeMinipoolCount(nodeAddress);
}

// Get the number of minipools a node has in Staking status
export async function getNodeStakingMinipoolCount(web3: Web3, rp: RocketPool, nodeAddress: string) {
	return await rp.minipool.getNodeStakingMinipoolCount(nodeAddress);
}

// Get the number of minipools a node has in that are active
export async function getNodeActiveMinipoolCount(web3: Web3, rp: RocketPool, nodeAddress: string) {
	return await rp.minipool.getNodeActiveMinipoolCount(nodeAddress);
}

// Get the minimum required RPL stake for a minipool
export async function getMinipoolMinimumRPLStake(web3: Web3, rp: RocketPool) {
	// Load contracts
	const rocketDAOProtocolSettingsMinipool = await rp.contracts.get("rocketDAOProtocolSettingsMinipool");
	const rocketDAOProtocolSettingsNode = await rp.contracts.get("rocketDAOProtocolSettingsNode");

	// Load data
	const [depositUserAmount, minMinipoolStake, rplPrice] = await Promise.all([
		rocketDAOProtocolSettingsMinipool.methods
			.getHalfDepositUserAmount()
			.call()
			.then((value: any) => web3.utils.toBN(value)),
		rocketDAOProtocolSettingsNode.methods
			.getMinimumPerMinipoolStake()
			.call()
			.then((value: any) => web3.utils.toBN(value)),
		rp.network.getRPLPrice().then((value: any) => web3.utils.toBN(value)),
	]);

	// Calculate & return
	return depositUserAmount.mul(minMinipoolStake).div(rplPrice);
}

// Create a minipool
let minipoolSalt = 1;
export async function createMinipool(web3: Web3, rp: RocketPool, options: SendOptions, salt: number | null = null): Promise<MinipoolContract | null> {
	// Get contracts
	const rocketMinipoolManager = await rp.contracts.get("rocketMinipoolManager");
	const rocketStorage = await rp.contracts.get("rocketStorage");

	// Get contract addresses
	const minipoolManagerAddress = await rp.contracts.address("rocketMinipoolManager");

	// Get artifact and bytecode
	const rocketMinipool = require("../../contracts/RocketMinipool.json");
	const contractBytecode = rocketMinipool.bytecode;

	// Get deposit type from tx amount
	// @ts-ignore
	const depositType = await rp.node.getDepositType(options.value.toString());

	// Construct creation code for minipool deploy
	const constructorArgs = web3.eth.abi.encodeParameters(["address", "address", "uint8"], [rocketStorage.options.address, options.from, depositType]);
	const deployCode = contractBytecode + constructorArgs.substr(2);

	if (salt === null) {
		salt = minipoolSalt++;
	}

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
		amount: BigInt(16000000000), // gwei
		signature: getValidatorSignature(),
	};

	const depositDataRoot = getDepositDataRoot(depositData);
	const minimumNodeFee = web3.utils.toWei("0", "ether");

	// Make node deposit
	const txReceipt = await rp.node.deposit(minimumNodeFee, depositData.pubkey, depositData.signature, depositDataRoot, salt, minipoolAddress, options);

	// Get minipool created events
	const minipoolCreatedEvents = getTxContractEvents(web3, txReceipt, minipoolManagerAddress, "MinipoolCreated", [
		{ type: "address", name: "minipool", indexed: true },
		{ type: "address", name: "node", indexed: true },
		{ type: "uint256", name: "created" },
	]);

	// Return minipool instance
	if (!minipoolCreatedEvents.length) return null;
	return rp.minipool.getMinipoolContract(minipoolCreatedEvents[0].minipool);
}

// Progress a minipool to staking
export async function stakeMinipool(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {
	// Get minipool validator pubkey
	const validatorPubkey = await rp.minipool.getMinipoolPubkey(minipool.address);

	// Get minipool withdrawal credentials
	const withdrawalCredentials = await rp.minipool.getMinipoolWithdrawalCredentials(minipool.address);

	// Get validator deposit data
	const depositData = {
		pubkey: Buffer.from(validatorPubkey.substr(2), "hex"),
		withdrawalCredentials: Buffer.from(withdrawalCredentials.substr(2), "hex"),
		amount: BigInt(16000000000), // gwei
		signature: getValidatorSignature(),
	};
	const depositDataRoot = getDepositDataRoot(depositData);

	// Stake
	await minipool.stake(depositData.signature, depositDataRoot, options);
}

// Submit a minipool withdrawable event
export async function submitMinipoolWithdrawable(web3: Web3, rp: RocketPool, minipoolAddress: string, options: SendOptions) {
	await rp.minipool.submitMinipoolWithdrawable(minipoolAddress, options);
}

// Send validator balance to a minipool
export async function payoutMinipool(minipool: MinipoolContract, confirm = false, options: SendOptions) {
	await minipool.contract.methods.payout(confirm).send(options);
}

// Withdraw node balances & rewards from a minipool and destroy it
export async function withdrawMinipool(minipool: MinipoolContract, options: SendOptions) {
	await minipool.withdraw(options);
}

// Dissolve a minipool
export async function dissolveMinipool(minipool: MinipoolContract, options: SendOptions) {
	await minipool.dissolve(options);
}

// Close a dissolved minipool and destroy it
export async function closeMinipool(minipool: MinipoolContract, options: SendOptions) {
	await minipool.close(options);
}
