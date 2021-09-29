// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";

// Burn rETH for ETH
export async function burnReth(web3: Web3, rp: RocketPool, amount: string, options: SendOptions) {
	// Get parameters
	const rethExchangeRate = await rp.tokens.reth.getExchangeRate().then((value) => web3.utils.toBN(value));

	// Get balances
	function getBalances() {
		return Promise.all([
			rp.tokens.reth.getTotalSupply().then((value) => web3.utils.toBN(value)),
			rp.tokens.reth.balanceOf(options.from).then((value) => web3.utils.toBN(value)),
			web3.eth.getBalance(options.from).then((value) => web3.utils.toBN(value)),
		]).then(([tokenSupply, userTokenBalance, userEthBalance]) => ({
			tokenSupply,
			userTokenBalance,
			userEthBalance,
		}));
	}

	// Get initial balances
	const balances1 = await getBalances();

	// Set gas price
	const gasPrice = web3.utils.toBN(web3.utils.toWei("20", "gwei"));
	options.gasPrice = gasPrice.toString();

	// Burn tokens & get tx fee
	const txReceipt = await rp.tokens.reth.burn(amount, options);
	const txFee = gasPrice.mul(web3.utils.toBN(txReceipt.gasUsed));

	// Get updated balances
	const balances2 = await getBalances();

	// Calculate values
	const burnAmount = web3.utils.toBN(amount);
	const calcBase = web3.utils.toBN(web3.utils.toWei("1", "ether"));
	const expectedEthTransferred = burnAmount.mul(rethExchangeRate).div(calcBase);

	// Check balances
	assert(balances2.tokenSupply.eq(balances1.tokenSupply.sub(burnAmount)), "Incorrect updated token supply");
	assert(balances2.userTokenBalance.eq(balances1.userTokenBalance.sub(burnAmount)), "Incorrect updated user token balance");
	assert(balances2.userEthBalance.eq(balances1.userEthBalance.add(expectedEthTransferred).sub(txFee)), "Incorrect updated user ETH balance");
}
