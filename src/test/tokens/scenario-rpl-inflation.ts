// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { SendOptions } from "web3-eth-contract";
import { getCurrentTime, increaseTime, mineBlocks } from "../_utils/evm";
import { setRPLInflationIntervalRate, setRPLInflationStartTime } from "../dao/scenario-dao-protocol-bootstrap";

export interface Claim {
	timeInterval: number;
	timeStart: number;
	timeClaim: number;
	yearlyInflationTarget: number;
}

// Set inflation config
export async function rplSetInflationConfig(web3: Web3, rp: RocketPool, config: Claim, options: SendOptions) {
	// Set the daily inflation start block
	await setRPLInflationStartTime(web3, rp, config.timeStart, options);
	// Set the daily inflation rate
	await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, options);
}

// Claim the inflation after a set amount of blocks have passed
export async function rplClaimInflation(web3: Web3, rp: RocketPool, config: Claim, options: SendOptions, tokenAmountToMatch?: any) {
	// Convert param to BN
	if (tokenAmountToMatch) {
		tokenAmountToMatch = web3.utils.toBN(tokenAmountToMatch);
	}

	// Load contracts
	const rocketTokenRPL = await rp.contracts.get("rocketTokenRPL");
	const rocketVault = await rp.contracts.get("rocketVault");

	// Get the previously last inflation calculated block
	const timeIntervalLastCalc = web3.utils.toBN(await rocketTokenRPL.methods.getInflationCalcTime().call());

	// Get data about the current inflation
	function getInflationData() {
		return Promise.all([
			getCurrentTime(web3),
			rocketTokenRPL.methods.totalSupply().call(),
			rocketTokenRPL.methods.getInflationIntervalStartTime().call(),
			rocketTokenRPL.methods.getInflationIntervalsPassed().call(),
			rocketTokenRPL.methods.getInflationCalcTime().call(),
			rocketTokenRPL.methods.getInflationIntervalTime().call(),
			rocketTokenRPL.methods
				.balanceOf(rocketVault.options.address)
				.call()
				.then((value: any) => web3.utils.toBN(value)),
			rocketVault.methods
				.balanceOfToken("rocketRewardsPool", rocketTokenRPL.options.address)
				.call()
				.then((value: any) => web3.utils.toBN(value)),
		]).then(
			([
				currentTime,
				tokenTotalSupply,
				inflationStartTime,
				inflationIntervalsPassed,
				inflationCalcTime,
				intervalTime,
				rocketVaultBalanceRPL,
				rocketVaultInternalBalanceRPL,
			]) => ({
				currentTime,
				tokenTotalSupply,
				inflationStartTime,
				inflationIntervalsPassed,
				inflationCalcTime,
				intervalTime,
				rocketVaultBalanceRPL,
				rocketVaultInternalBalanceRPL,
			})
		);
	}

	// Get the current time so we can calculate how much time to pass to make it to the claim time
	let currentTime = await getCurrentTime(web3);

	// Blocks to process as passing
	const timeToSimulatePassing = config.timeClaim - currentTime;
	// Simulate time passing
	await increaseTime(web3, timeToSimulatePassing);

	// Get initial data
	const inflationData1 = await getInflationData();
	//console.log(inflationData1.currentBlock, web3.utils.fromWei(inflationData1.tokenTotalSupply), inflationData1.inflationStartBlock.toString(), web3.utils.fromWei(inflationData1.rocketVaultBalanceRPL), web3.utils.fromWei(inflationData1.rocketVaultInternalBalanceRPL));

	// Starting amount of total supply
	const totalSupplyStart = web3.utils.toBN(inflationData1.tokenTotalSupply);

	// Some expected data results based on the passed parameters
	const dailyInflation = web3.utils.toBN((1 + config.yearlyInflationTarget) ** (1 / 365) * 1e18);
	const expectedInflationLastCalcTime =
		Number(timeIntervalLastCalc) === 0 && config.timeStart < config.timeClaim ? config.timeStart : Number(timeIntervalLastCalc);
	const expectedInflationIntervalsPassed = Number(inflationData1.inflationIntervalsPassed);

	// Get updated time after fast forward
	currentTime = await getCurrentTime(web3);

	// How many tokens to be expected minted
	let expectedTokensMinted = web3.utils.toBN(0);

	// Are we expecting inflation? have any intervals passed?
	if (inflationData1.inflationIntervalsPassed > 0) {
		// How much inflation to use based on intervals passed
		let newTotalSupply = totalSupplyStart;

		// console.log("nextExpectedClaimBlock", nextExpectedClaimBlock);
		//console.log("expectedInflationIntervalsPassed", expectedInflationIntervalsPassed);
		//console.log((nextExpectedClaimBlock), (blockCurrent+1));

		// Add an extra interval to the calculations match up
		for (let i = 0; i < expectedInflationIntervalsPassed; i++) {
			newTotalSupply = newTotalSupply.mul(dailyInflation).div(web3.utils.toBN(1e18));
		}

		// Calculate expected inflation amount
		expectedTokensMinted = newTotalSupply.sub(totalSupplyStart);
	}

	// console.log('');
	// console.log('Current time', currentTime);
	// console.log('Inflation start time', Number(inflationData1.inflationStartTime));
	// console.log('Inflation calc time', Number(inflationData1.inflationCalcTime));
	// console.log('Inflation interval time', Number(inflationData1.intervalTime));
	// console.log('Inflation intervals passed', Number(inflationData1.inflationIntervalsPassed));
	// console.log('Inflation calc time expected', Number(expectedInflationLastCalcTime));
	// console.log('Inflation intervals expected', Number(expectedInflationIntervalsPassed));
	// console.log('Inflation next calc time', Number(inflationData1.inflationCalcTime)+Number(inflationData1.intervalTime));

	// Claim tokens now
	await rp.tokens.rpl.inflationMintTokens(options);

	// Get inflation data
	const inflationData2 = await getInflationData();

	// console.log('');
	// console.log('Current time', await getCurrentTime(web3));
	// console.log('Inflation calc time', Number(inflationData2.inflationCalcTime));

	//console.log(inflationData2.currentBlock, web3.utils.fromWei(inflationData2.tokenTotalSupply), inflationData2.inflationStartBlock.toString(), web3.utils.fromWei(inflationData2.rocketVaultBalanceRPL), web3.utils.fromWei(inflationData2.rocketVaultInternalBalanceRPL));

	// Ending amount of total supply
	const totalSupplyEnd = web3.utils.toBN(inflationData2.tokenTotalSupply);

	//console.log('RESULT', expectedTokensMinted.toFixed(4), (totalSupplyEnd - totalSupplyStart).toFixed(4));
	//console.log(Number(tokenAmountToMatch).toFixed(4), Number(totalSupplyEnd).toFixed(4), Number(totalSupplyStart).toFixed(4));

	// Verify the minted amount is correct based on inflation rate etc
	assert(expectedTokensMinted.eq(totalSupplyEnd.sub(totalSupplyStart)), "Incorrect amount of minted tokens expected");
	// Verify the minted tokens are now stored in Rocket Vault on behalf of Rocket Rewards Pool
	assert(
		inflationData2.rocketVaultInternalBalanceRPL.eq(inflationData2.rocketVaultBalanceRPL),
		"Incorrect amount of tokens stored in Rocket Vault for Rocket Rewards Pool"
	);
	// Are we verifying an exact amount of tokens given as a required parameter on this pass?
	if (tokenAmountToMatch) {
		tokenAmountToMatch = web3.utils.toBN(tokenAmountToMatch);
		assert(tokenAmountToMatch.eq(totalSupplyEnd.div(web3.utils.toBN(1e18))), "Given token amount does not match total supply made");
	}

	return totalSupplyEnd.sub(totalSupplyStart);
}
