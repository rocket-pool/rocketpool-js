// Imports
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";

// Get the deposit pool excess ETH balance
export async function getDepositExcessBalance(web3: Web3, rp: RocketPool) {
	const excessBalance = await rp.deposit.getExcessBalance();
	return excessBalance;
}

// Make a deposit
export async function userDeposit(web3: Web3, rp: RocketPool, options: SendOptions) {
	await rp.deposit.deposit(options);
}

// Assign deposits
export async function assignDeposits(web3: Web3, rp: RocketPool, options: SendOptions) {
	await rp.deposit.assignDeposits(options);
}
