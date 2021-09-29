// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";

// Refund a minipool
export async function refund(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {
	// Get parameters
	const nodeAddress = await minipool.getNodeAddress();
	const nodeWithdrawalAddress = await rp.node.getNodeWithdrawalAddress(nodeAddress);

	// Get balances
	function getBalances() {
		return Promise.all([
			minipool.getNodeRefundBalance().then((value: any) => web3.utils.toBN(value)),
			web3.eth.getBalance(minipool.address).then((value: any) => web3.utils.toBN(value)),
			web3.eth.getBalance(nodeWithdrawalAddress).then((value: any) => web3.utils.toBN(value)),
		]).then(([nodeRefund, minipoolEth, nodeEth]) => ({
			nodeRefund,
			minipoolEth,
			nodeEth,
		}));
	}

	// Get initial balances
	const balances1 = await getBalances();

	// Set gas price
	const gasPrice = web3.utils.toBN(web3.utils.toWei("20", "gwei"));
	options.gasPrice = gasPrice.toString();

	// Refund & get tx fee
	const txReceipt = await minipool.refund(options);
	const txFee = gasPrice.mul(web3.utils.toBN(txReceipt.gasUsed));

	// Get updated balances
	const balances2 = await getBalances();

	// Check balances
	const zero = web3.utils.toBN(0);
	let expectedNodeBalance = balances1.nodeEth.add(balances1.nodeRefund);
	if (nodeWithdrawalAddress == nodeAddress) expectedNodeBalance = expectedNodeBalance.sub(txFee);
	assert(balances1.nodeRefund.gt(zero), "Incorrect initial node refund balance");
	assert(balances2.nodeRefund.eq(zero), "Incorrect updated node refund balance");
	assert(balances2.minipoolEth.eq(balances1.minipoolEth.sub(balances1.nodeRefund)), "Incorrect updated minipool ETH balance");
	assert(balances2.nodeEth.eq(expectedNodeBalance), "Incorrect updated node ETH balance");
}
