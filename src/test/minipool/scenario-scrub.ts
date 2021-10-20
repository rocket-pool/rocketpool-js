// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";

// Scrub a minipool
export async function voteScrub(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {

	// Get minipool details
	function getMinipoolDetails() {
		return Promise.all([
			minipool.getStatus().then((value: any) => web3.utils.toBN(value)),
			minipool.getUserDepositBalance().then((value: any) => web3.utils.toBN(value)),
			minipool.getTotalScrubVotes().then((value: any) => web3.utils.toBN(value)),
		]).then(
			([status, userDepositBalance, votes]) =>
				({status, userDepositBalance, votes})
		);
	}

	// Get initial minipool details
	const details1 = await getMinipoolDetails();

	// Dissolve
	await minipool.voteScrub(options);

	// Get updated minipool details
	const details2 = await getMinipoolDetails();

	// Get member count
	const memberCount = web3.utils.toBN(await rp.dao.node.trusted.node.getMemberCount());
	const quorum = memberCount.div(web3.utils.toBN(2));

	// Check state
	const dissolved = web3.utils.toBN(4);
	if (details1.votes.add(web3.utils.toBN(1)).gt(quorum)){
		assert(details2.status.eq(dissolved), "Incorrect updated minipool status");
		assert(details2.userDepositBalance.eq(web3.utils.toBN(0)), "Incorrect updated minipool user deposit balance");
	} else {
		assert(details2.votes.sub(details1.votes).eq(web3.utils.toBN(1)), "Vote count not incremented");
		assert(!details2.status.eq(dissolved), "Incorrect updated minipool status");
	}
}
