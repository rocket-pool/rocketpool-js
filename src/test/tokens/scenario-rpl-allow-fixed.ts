// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { SendOptions } from "web3-eth-contract";

export async function allowDummyRPL(web3: Web3, rp: RocketPool, to: string, amount: string, options: SendOptions) {
	// Load contracts
	const rocketTokenDummyRPL = await rp.contracts.get("rocketTokenRPLFixedSupply");

	// Get balances
	function getBalances() {
		return Promise.all([rp.tokens.legacyrpl.allowance(options.from, to)]).then(([tokenAllowance]) => ({
			tokenAllowance: web3.utils.toBN(tokenAllowance),
		}));
	}

	// Get initial balances
	const balances1 = await getBalances();

	// Set gas price
	const gasPrice = web3.utils.toBN(web3.utils.toWei("20", "gwei"));
	options.gasPrice = gasPrice.toString();

	// Mint tokens
	const txReceipt = await rocketTokenDummyRPL.methods.approve(to, amount).send(options);
	const txFee = gasPrice.mul(web3.utils.toBN(txReceipt.gasUsed));

	// Get updated balances
	const balances2 = await getBalances();

	// Calculate values
	const allowanceAmount = web3.utils.toBN(amount);

	// Check balances
	assert(balances2.tokenAllowance.eq(balances1.tokenAllowance.add(allowanceAmount)), "Incorrect allowance for token");
}
