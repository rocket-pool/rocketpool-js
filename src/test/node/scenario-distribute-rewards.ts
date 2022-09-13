// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";

// Stake RPL against the node
export async function distributeRewards(web3: Web3, rp: RocketPool, nodeAddress: string, options: SendOptions | null) {
	// Get Contracts
	const rocketStorage = await rp.contracts.get("rocketStorage");
	const distributorAddress = await rp.node.getNodeDistributorProxyAddress(nodeAddress);
	const distributor = await rp.contracts.make("rocketNodeDistributorDelegate", distributorAddress);
	const rocketTokenRETH = await rp.contracts.get("rocketTokenRETH");
	const rocketTokenRETHAddress = rocketTokenRETH.options.address;
	// Get node withdrawal address
	const withdrawalAddress = await rocketStorage.methods.getNodeWithdrawalAddress(nodeAddress).call();
	const distributorBalance = web3.utils.toBN(await web3.eth.getBalance(distributorAddress));
	// Get nodes average fee
	const minipoolCount = web3.utils.toBN(await rp.minipool.getNodeMinipoolCount(nodeAddress)).toNumber();

	// Get minipool details
	async function getMinipoolDetails(index: number) {
		const minipoolAddress = await rp.minipool.getNodeMinipoolAt(nodeAddress, index);
		const minipoolABI = await rp.contracts.abi("rocketMinipool");
		const minipool = new web3.eth.Contract(minipoolABI, minipoolAddress);
		return Promise.all([
			minipool.methods.getStatus().call().then((value: any) => web3.utils.toBN(value)),
			minipool.methods.getNodeFee().call().then((value: any) => web3.utils.toBN(value)),
		]).then(([status, fee]) => ({
			status,
			fee,
		}));
	}

	// Get status and node fee of each minipool
	const minipoolDetails = await Promise.all([...Array(minipoolCount).keys()].map((i) => getMinipoolDetails(i)));

	let numerator = web3.utils.toBN(0);
	let denominator = web3.utils.toBN(0);

	for (const minipoolDetail of minipoolDetails) {
		if (minipoolDetail.status.toNumber() === 2) {
			// Staking
			numerator = numerator.add(minipoolDetail.fee);
			denominator = denominator.add(web3.utils.toBN(1));
		}
	}

	let expectedAverageFee = web3.utils.toBN(0);

	if (!numerator.eq(expectedAverageFee)) {
		expectedAverageFee = numerator.div(denominator);
	}

	// Query average fee from contracts
	const averageFee = web3.utils.toBN(await rp.node.getAverageNodeFee(nodeAddress));
	assert.strictEqual(averageFee.toString(), expectedAverageFee.toString(), "Incorrect average node fee");

	// Calculate expected node and user amounts from average fee
	const halfAmount = distributorBalance.div(web3.utils.toBN(2));
	const expectedNodeAmount = halfAmount.add(halfAmount.mul(averageFee).div(web3.utils.toBN(web3.utils.toWei("1", "ether"))));
	const expectedUserAmount = distributorBalance.sub(expectedNodeAmount);

	async function getBalances() {
		return Promise.all([
			web3.eth.getBalance(withdrawalAddress).then((value: any) => web3.utils.toBN(value)),
			web3.eth.getBalance(rocketTokenRETHAddress).then((value: any) => web3.utils.toBN(value)),
		]).then(([nodeEth, userEth]) => ({
			nodeEth,
			userEth,
		}));
	}

	// Get balance before distribute
	const balances1 = await getBalances();
	// Call distributor
	await distributor.methods.distribute().call();
	// Get balance after distribute
	const balances2 = await getBalances();

	// Check results
	const nodeEthChange = balances2.nodeEth.sub(balances1.nodeEth);
	const userEthChange = balances2.userEth.sub(balances1.userEth);
	assert.strictEqual(nodeEthChange.toString(), expectedNodeAmount.toString(), "Node ETH balance not correct");
	assert.strictEqual(userEthChange.toString(), expectedUserAmount.toString(), "User ETH balance not correct");
}
