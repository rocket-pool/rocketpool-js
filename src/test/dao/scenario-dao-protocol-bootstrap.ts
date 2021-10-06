// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";

// Change a trusted node DAO setting while bootstrap mode is enabled
export async function setDAOProtocolBootstrapSetting(
	web3: Web3,
	rp: RocketPool,
	_settingContractInstance: string,
	_settingPath: string,
	_value: any,
	options: SendOptions
) {
	// Load contracts
	const rocketDAOProtocol = await rp.contracts.get("rocketDAOProtocol");
	const rocketDAOProtocolSettingsContract = await rp.contracts.get(_settingContractInstance);

	// Get data about the tx
	function getTxData() {
		return Promise.all([
			rocketDAOProtocolSettingsContract.methods.getSettingUint(_settingPath).call(),
			rocketDAOProtocolSettingsContract.methods.getSettingBool(_settingPath).call(),
			rocketDAOProtocolSettingsContract.methods.getSettingAddress(_settingPath).call(),
		]).then(([settingUintValue, settingBoolValue, settingAddressValue]) => ({
			settingUintValue,
			settingBoolValue,
			settingAddressValue,
		}));
	}

	// Capture data
	const ds1 = await getTxData();

	// Set as a bootstrapped setting. detect type first, can be a number, string or bn object
	if (Web3.utils.isAddress(_value)) {
		await rocketDAOProtocol.methods.bootstrapSettingAddress(_settingContractInstance, _settingPath, _value).send(options);
	} else {
		if (typeof _value == "number" || typeof _value == "string" || typeof _value == "object")
			await rocketDAOProtocol.methods.bootstrapSettingUint(_settingContractInstance, _settingPath, _value).send(options);
		if (typeof _value == "boolean") await rocketDAOProtocol.methods.bootstrapSettingBool(_settingContractInstance, _settingPath, _value).send(options);
	}

	// Capture data
	const ds2 = await getTxData();

	// Check it was updated
	if (Web3.utils.isAddress(_value)) {
		await assert(ds2.settingAddressValue == _value, "DAO protocol address setting not updated in bootstrap mode");
	} else {
		if (typeof _value == "number" || typeof _value == "string")
			await assert(ds2.settingUintValue == _value, "DAO protocol uint256 setting not updated in bootstrap mode");
		if (typeof _value == "boolean") await assert(ds2.settingBoolValue == _value, "DAO protocol boolean setting not updated in bootstrap mode");
	}
}

// Set a contract that can claim rewards
export async function setDAONetworkBootstrapRewardsClaimer(
	web3: Web3,
	rp: RocketPool,
	_contractName: string,
	_perc: string,
	options: SendOptions,
	expectedTotalPerc?: number | null
) {
	// Load contracts
	const rocketDAOProtocol = await rp.contracts.get("rocketDAOProtocol");
	const rocketDAOProtocolSettingsRewards = await rp.contracts.get("rocketDAOProtocolSettingsRewards");
	// Get data about the tx
	function getTxData() {
		return Promise.all([
			rocketDAOProtocolSettingsRewards.methods
				.getRewardsClaimerPerc(_contractName)
				.call()
				.then((value: any) => web3.utils.toBN(value)),
			rocketDAOProtocolSettingsRewards.methods
				.getRewardsClaimersPercTotal()
				.call()
				.then((value: any) => web3.utils.toBN(value)),
		]).then(([rewardsClaimerPerc, rewardsClaimersPercTotal]) => ({
			rewardsClaimerPerc,
			rewardsClaimersPercTotal,
		}));
	}
	// Capture data
	const dataSet1 = await getTxData();
	//console.log(dataSet1.rewardsClaimerPerc.toString(), dataSet1.rewardsClaimersPercTotal.toString());
	// Perform tx
	await rocketDAOProtocol.methods.bootstrapSettingClaimer(_contractName, _perc).send(options);
	// Capture data
	const dataSet2 = await getTxData();
	//console.log(dataSet2.rewardsClaimerPerc.toString(), dataSet2.rewardsClaimersPercTotal.toString());
	// Verify
	assert(dataSet2.rewardsClaimerPerc.eq(web3.utils.toBN(_perc)), "Claim percentage not updated correctly");

	// Verify an expected total Perc if given
	if (expectedTotalPerc) {
		assert(
			dataSet2.rewardsClaimersPercTotal.eq(web3.utils.toBN(web3.utils.toWei(expectedTotalPerc.toString()))),
			"Total claim percentage not matching given target"
		);
	}
}

/*** Rewards *******/

// Set the current rewards claim period in seconds
export async function setRewardsClaimIntervalTime(web3: Web3, rp: RocketPool, intervalTime: number, options: SendOptions) {
	// Set it now
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsRewards", "rpl.rewards.claim.period.time", intervalTime, options);
}

// Spend the DAO treasury in bootstrap mode
export async function spendRewardsClaimTreasury(
	web3: Web3,
	rp: RocketPool,
	_invoiceID: string,
	_recipientAddress: string,
	_amount: string,
	options: SendOptions
) {
	// Load contracts
	const rocketDAOProtocol = await rp.contracts.get("rocketDAOProtocol");
	const rocketTokenRPL = await rp.contracts.get("rocketTokenRPL");
	const rocketVault = await rp.contracts.get("rocketVault");

	// Get data about the tx
	function getTxData() {
		return Promise.all([
			rocketVault.methods
				.balanceOfToken("rocketClaimDAO", rocketTokenRPL.options.address)
				.call()
				.then((value: any) => web3.utils.toBN(value)),
			rocketTokenRPL.methods
				.balanceOf(_recipientAddress)
				.call()
				.then((value: any) => web3.utils.toBN(value)),
		]).then(([daoClaimTreasuryBalance, recipientBalance]) => ({
			daoClaimTreasuryBalance,
			recipientBalance,
		}));
	}

	// Capture data
	const ds1 = await getTxData();

	// console.log(web3.utils.fromWei(ds1.daoClaimTreasuryBalance), web3.utils.fromWei(ds1.recipientBalance), web3.utils.fromWei(_amount));

	// Perform tx
	await rocketDAOProtocol.methods.bootstrapSpendTreasury(_invoiceID, _recipientAddress, _amount).send(options);

	// Capture data
	const ds2 = await getTxData();

	// console.log(web3.utils.fromWei(ds2.daoClaimTreasuryBalance), web3.utils.fromWei(ds2.recipientBalance), web3.utils.fromWei(_amount));

	// Verify the amount sent is correct
	assert(ds2.recipientBalance.eq(ds1.recipientBalance.add(web3.utils.toBN(_amount))), "Amount spent by treasury does not match recipients received amount");
}

/*** Inflation *******/

// Set the current RPL inflation rate
export async function setRPLInflationIntervalRate(web3: Web3, rp: RocketPool, yearlyInflationPerc: number, options: SendOptions) {
	// Calculate the inflation rate per day
	const dailyInflation = web3.utils.toBN((1 + yearlyInflationPerc) ** (1 / 365) * 1e18);
	// Set it now
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsInflation", "rpl.inflation.interval.rate", dailyInflation, options);
}

// Set the current RPL inflation block interval
export async function setRPLInflationStartTime(web3: Web3, rp: RocketPool, startTime: number, options: SendOptions) {
	// Set it now
	await setDAOProtocolBootstrapSetting(web3, rp, "rocketDAOProtocolSettingsInflation", "rpl.inflation.interval.start", startTime, options);
}

// Disable bootstrap mode
export async function setDaoProtocolBootstrapModeDisabled(web3: Web3, rp: RocketPool, options: SendOptions) {
	// Load contracts
	const rocketDAOProtocol = await rp.contracts.get("rocketDAOProtocol");

	// Get data about the tx
	function getTxData() {
		return Promise.all([rocketDAOProtocol.methods.getBootstrapModeDisabled().call()]).then(([bootstrapmodeDisabled]) => ({ bootstrapmodeDisabled }));
	}

	// Capture data
	const ds1 = await getTxData();

	// Set as a bootstrapped member
	await rocketDAOProtocol.methods.bootstrapDisable(true).send(options);

	// Capture data
	const ds2 = await getTxData();

	// Check ID has been recorded
	assert(ds2.bootstrapmodeDisabled == true, "Bootstrap mode was not disabled");
}

// Change multiple trusted node DAO settings while bootstrap mode is enabled
export async function setDAOProtocolBootstrapSettingMulti(
	web3: Web3,
	rp: RocketPool,
	_settingContractInstances: string[],
	_settingPaths: string[],
	_values: any[],
	options: SendOptions
) {
	// Load contracts
	const rocketDAOProtocol = await rp.contracts.get("rocketDAOProtocol");

	const contractNames = [];
	const values = [];
	const types: any = [];

	for (let i = 0; i < _settingContractInstances.length; i++) {
		const value = _values[i];
		contractNames.push(_settingContractInstances[i]);
		if (Web3.utils.isAddress(value)) {
			values.push(web3.eth.abi.encodeParameter("address", value));
			types.push(2);
		} else {
			if (typeof value == "number" || typeof value == "string" || typeof value == "object") {
				values.push(web3.eth.abi.encodeParameter("uint256", value));
				types.push(0);
			} else if (typeof value == "boolean") {
				values.push(web3.eth.abi.encodeParameter("bool", value));
				types.push(1);
			} else {
				throw new Error("Invalid value supplied");
			}
		}
	}

	// console.log(contractNames);
	// console.log(_settingPaths);
	// console.log(types);
	// console.log(values);

	// Set as a bootstrapped setting. detect type first, can be a number, string or bn object
	await rocketDAOProtocol.methods.bootstrapSettingMulti(contractNames, _settingPaths, types, values).send(options);

	// Get data about the tx
	async function getTxData() {
		const instances = await Promise.all(_settingContractInstances.map((instance) => rp.contracts.get(instance)));
		return Promise.all(
			instances.map((rocketDAOProtocolSettingsContract, index) => {
				switch (types[index]) {
					case 0:
						return rocketDAOProtocolSettingsContract.methods
							.getSettingUint(_settingPaths[index])
							.call()
							.then((value: any) => web3.utils.toBN(value));
					case 1:
						return rocketDAOProtocolSettingsContract.methods.getSettingBool(_settingPaths[index]).call();
					case 2:
						return rocketDAOProtocolSettingsContract.methods.getSettingAddress(_settingPaths[index]).call();
				}
			})
		);
	}

	// Capture data
	const data = await getTxData();

	// console.log(data);

	// Check it was updated
	for (let i = 0; i < _values.length; i++) {
		const value = _values[i];
		switch (types[i]) {
			case 0:
				assert(data[i].eq(web3.utils.toBN(value)), "DAO protocol uint256 setting not updated in bootstrap mode");
				break;
			case 1:
				assert(data[i] === value, "DAO protocol boolean setting not updated in bootstrap mode");
				break;
			case 2:
				await assert(data[i] === value, "DAO protocol address setting not updated in bootstrap mode");
				break;
		}
	}
}
