// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";

// Set the address the DAO can receive rewards at
export async function getRewardsDAOTreasuryBalance(web3: Web3, rp: RocketPool, options: SendOptions) {
	const rocketTokenRPLAddress = await rp.tokens.rpl.getAddress();
	return rp.vault.balanceOfToken("rocketClaimDAO", rocketTokenRPLAddress);
}

// Set the address the DAO can receive rewards at
export async function rewardsClaimDAO(web3: Web3, rp: RocketPool, options: SendOptions) {
	// Get the RPL token contract address
	const rocketTokenRPLAddress = await rp.tokens.rpl.getAddress();

	// Call the mint function on RPL to mint any before we begin so we have accurate figures to work with
	if ((await rp.tokens.rpl.getInflationIntervalsPassed()) > 0) {
		await rp.tokens.rpl.inflationMintTokens(options);
	}

	// Get data about the tx
	function getTxData() {
		return Promise.all([
			rp.rewards.pool.getClaimIntervalsPassed().then((value: any) => web3.utils.toBN(value)),
			rp.rewards.pool.getClaimIntervalTimeStart().then((value: any) => web3.utils.toBN(value)),
			rp.rewards.pool.getRPLBalance().then((value: any) => web3.utils.toBN(value)),
			rp.rewards.pool.getClaimingContractPerc("rocketClaimDAO").then((value: any) => web3.utils.toBN(value)),
			rp.rewards.pool.getClaimingContractAllowance("rocketClaimDAO").then((value: any) => web3.utils.toBN(value)),
			rp.rewards.pool.getClaimingContractTotalClaimed("rocketClaimDAO").then((value: any) => web3.utils.toBN(value)),
			rp.rewards.pool.getClaimIntervalRewardsTotal().then((value: any) => web3.utils.toBN(value)),
			rp.vault.balanceOfToken("rocketClaimDAO", rocketTokenRPLAddress).then((value: any) => web3.utils.toBN(value)),
		]).then(
			([
				intervalsPassed,
				intervalTimeStart,
				poolRPLBalance,
				daoClaimPerc,
				daoClaimAllowance,
				daoContractClaimTotal,
				intervalRewardsTotal,
				daoRewardsAddressBalance,
			]) => ({
				intervalsPassed,
				intervalTimeStart,
				poolRPLBalance,
				daoClaimPerc,
				daoClaimAllowance,
				daoContractClaimTotal,
				intervalRewardsTotal,
				daoRewardsAddressBalance,
			})
		);
	}

	// Capture data
	const ds1 = await getTxData();

	// Perform tx
	await rp.rewards.claimTrustedNode.claim(options);

	// Capture data
	const ds2 = await getTxData();

	//console.log(Number(ds1.intervalsPassed), Number(ds1.intervalTimeStart), Number(web3.utils.fromWei(ds1.daoClaimAllowance)).toFixed(4), Number(web3.utils.fromWei(ds1.daoClaimPerc)), (Number(web3.utils.fromWei(ds1.daoClaimPerc)) * Number(web3.utils.fromWei((ds1.intervalRewardsTotal)))).toFixed(4));
	//console.log(Number(ds2.intervalsPassed), Number(ds2.intervalTimeStart), Number(web3.utils.fromWei(ds2.daoClaimAllowance)).toFixed(4), Number(web3.utils.fromWei(ds2.daoClaimPerc)), (Number(web3.utils.fromWei(ds2.daoClaimPerc)) * Number(web3.utils.fromWei((ds2.intervalRewardsTotal)))).toFixed(4));

	// Verify the claim allowance is correct
	assert(
		Number(web3.utils.fromWei(ds2.daoClaimAllowance)).toFixed(4) ==
      Number(Number(web3.utils.fromWei(ds2.daoClaimPerc)) * Number(web3.utils.fromWei(ds2.intervalRewardsTotal))).toFixed(4),
		"Contract claim amount total does not equal the expected claim amount"
	);
	// Should be 1 collect per interval
	assert(ds2.daoContractClaimTotal.eq(ds2.daoClaimAllowance), "Amount claimed exceeds allowance for interval");
	// Now test various outcomes depending on if a claim interval happened or not
	if (Number(ds1.intervalTimeStart) < Number(ds2.intervalTimeStart)) {
		// Dao can only receive rewards on the first claim of a claim period
		assert(
			ds2.daoRewardsAddressBalance.eq(ds1.daoRewardsAddressBalance.add(ds2.daoContractClaimTotal)),
			"DAO rewards address does not contain the correct balance"
		);
	} else {
		// Claim interval has not passed, dao should not have claimed anything
		assert(ds2.daoRewardsAddressBalance.eq(ds1.daoRewardsAddressBalance), "DAO rewards address balance has changed on same interval claim");
	}
}
