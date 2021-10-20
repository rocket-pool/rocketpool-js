// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { getValidatorSignature, getDepositDataRoot } from "../_utils/beacon";

// Stake a minipool
export async function stake(
	web3: Web3,
	rp: RocketPool,
	minipool: MinipoolContract,
	validatorPubkey: string | Buffer | null,
	withdrawalCredentials: string,
	options: SendOptions
) {
	const rocketDAOProtocolSettingsMinipool = await rp.contracts.get("rocketDAOProtocolSettingsMinipool");

	// Get parameters
	const launchBalance = await rocketDAOProtocolSettingsMinipool.methods
		.getLaunchBalance()
		.call()
		.then((value: any) => web3.utils.toBN(value));

	// Get minipool validator pubkey
	if (!validatorPubkey) validatorPubkey = await rp.minipool.getMinipoolPubkey(minipool.address);

	// Get minipool withdrawal credentials
	if (!withdrawalCredentials) withdrawalCredentials = await minipool.getWithdrawalCredentials();

	// Get validator deposit data
	const depositData = {
		pubkey: validatorPubkey,
		withdrawalCredentials: Buffer.from(withdrawalCredentials.substr(2), "hex"),
		amount: BigInt(32000000000), // gwei
		signature: getValidatorSignature(),
	};
	const depositDataRoot = getDepositDataRoot(depositData);

	// Get minipool details
	function getMinipoolDetails() {
		return Promise.all([
			minipool.getStatus().then((value: any) => web3.utils.toBN(value)),
			web3.eth.getBalance(minipool.contract.options.address).then((value: any) => web3.utils.toBN(value)),
		]).then(([status, balance]) => ({ status, balance }));
	}

	// Get initial minipool details & minipool by validator pubkey
	const [details1, validatorMinipool1] = await Promise.all([getMinipoolDetails(), rp.minipool.getMinipoolByPubkey(validatorPubkey)]);

	// Stake
	await minipool.stake(depositData.pubkey, depositData.signature, depositDataRoot, options);

	// Get updated minipool details & minipool by validator pubkey
	const [details2, validatorMinipool2] = await Promise.all([getMinipoolDetails(), rp.minipool.getMinipoolByPubkey(validatorPubkey)]);

	// Check minpool details
	const staking = web3.utils.toBN(2);
	assert(!details1.status.eq(staking), "Incorrect initial minipool status");
	assert(details2.status.eq(staking), "Incorrect updated minipool status");
	assert(details2.balance.eq(details1.balance.sub(web3.utils.toBN(web3.utils.toWei("16", "ether")))), "Incorrect updated minipool ETH balance");

	// Check minipool by validator pubkey
	assert.equal(validatorMinipool1, "0x0000000000000000000000000000000000000000", "Incorrect initial minipool by validator pubkey");
	assert.equal(validatorMinipool2, minipool.address, "Incorrect updated minipool by validator pubkey");
}
