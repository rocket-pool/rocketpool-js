// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";
import { getTxContractEvents } from "../_utils/contract";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { getDepositDataRoot, getValidatorPubkey, getValidatorSignature } from "../_utils/beacon";

let minipoolSalt = 0;

// Make a node deposit
export async function deposit(web3: Web3, rp: RocketPool, minimumNodeFee: string, options: SendOptions) {
	// Get contract addresses
	const rocketMinipoolManager = await rp.contracts.get("rocketMinipoolManager");
	const rocketStorage = await rp.contracts.get("rocketStorage");

	// Get minipool counts
	function getMinipoolCounts(nodeAddress: string) {
		return Promise.all([
			rocketMinipoolManager.methods
				.getMinipoolCount()
				.call()
				.then((value: any) => web3.utils.toBN(value)),
			rocketMinipoolManager.methods
				.getNodeMinipoolCount(nodeAddress)
				.call()
				.then((value: any) => web3.utils.toBN(value)),
		]).then(([network, node]) => ({ network, node }));
	}

	// Get minipool details
	function getMinipoolDetails(minipoolAddress: string) {
		return rp.minipool
			.getMinipoolContract(minipoolAddress)
			.then((minipool: MinipoolContract) =>
				Promise.all([
					rocketMinipoolManager.methods.getMinipoolExists(minipoolAddress).call(),
					minipool.getNodeAddress(),
					minipool.getNodeDepositBalance(),
					minipool.getNodeDepositAssigned(),
				])
			)
			.then(([exists, nodeAddress, nodeDepositBalance, nodeDepositAssigned]) => ({
				exists,
				nodeAddress,
				nodeDepositBalance,
				nodeDepositAssigned,
			}));
	}

	// Get initial minipool indexes
	const minipoolCounts1 = await getMinipoolCounts(options.from);

	// Deposit

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
	const nodeSalt = web3.utils.soliditySha3(
		{type: "address", value: options.from},
		{type: "uint256", value: salt.toString()}
	);

	// Calculate hash of deploy code
	const bytecodeHash = web3.utils.soliditySha3(
		{type: "bytes", value: deployCode}
	);

	// Construct deterministic minipool address
	const raw = web3.utils.soliditySha3(
		{type: "bytes1", value: "0xff"},
		{type: "address", value: rocketMinipoolManager.options.address},
		{type: "bytes32", value: nodeSalt !== null ? nodeSalt : ""},
		{type: "bytes32", value: bytecodeHash !== null ? bytecodeHash : ""}
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

	console.log(depositData.pubkey);
	console.log(depositData.signature);
	console.log(depositDataRoot);
	console.log(salt);
	console.log(minipoolAddress);

	// Make node deposit
	const txReceipt = await rp.node.deposit(minimumNodeFee, depositData.pubkey, depositData.signature, depositDataRoot, salt, minipoolAddress, options);

	// Get updated minipool indexes & created minipool details
	const minipoolCounts2 = await getMinipoolCounts(options.from);
	const [lastMinipoolAddress, lastNodeMinipoolAddress, minipoolDetails] = await Promise.all([
		rocketMinipoolManager.methods.getMinipoolAt(minipoolCounts2.network.sub(web3.utils.toBN(1))).call(),
		rocketMinipoolManager.methods.getNodeMinipoolAt(options.from, minipoolCounts2.node.sub(web3.utils.toBN(1))).call(),
		getMinipoolDetails(minipoolAddress),
	]);

	// Check minipool indexes
	assert(minipoolCounts2.network.eq(minipoolCounts1.network.add(web3.utils.toBN(1))), "Incorrect updated network minipool count");
	assert.equal(lastMinipoolAddress, minipoolAddress, "Incorrect updated network minipool index");
	assert(minipoolCounts2.node.eq(minipoolCounts1.node.add(web3.utils.toBN(1))), "Incorrect updated node minipool count");
	assert.equal(lastNodeMinipoolAddress, minipoolAddress, "Incorrect updated node minipool index");

	// Check minipool details
	assert.isTrue(minipoolDetails.exists, "Incorrect created minipool exists status");
	//assert.equal(minipoolDetails.nodeAddress, options.from, 'Incorrect created minipool node address');
	//assert(minipoolDetails.nodeDepositBalance.eq(web3.utils.toBN(options.value)), 'Incorrect created minipool node deposit balance');
	assert.isTrue(minipoolDetails.nodeDepositAssigned, "Incorrect created minipool node deposit assigned status");
}
