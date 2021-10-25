// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";

// Scrub a minipool
export async function voteScrub(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {
	// Get minipool owner
	const nodeAddress = await minipool.getNodeAddress();
	// Get contracts
	const rocketVault = await rp.contracts.get("rocketVault");
	const rocketTokenRPL = await RocketTokenRPL.deployed();
	const rocketDAONodeTrustedSettingsMinipool = await rp.contracts.get("rocketDAONodeTrustedSettingsMinipool");

	// Get minipool details
	function getMinipoolDetails() {
		return Promise.all([
			minipool.getStatus().then((value: any) => web3.utils.toBN(value)),
			minipool.getUserDepositBalance().then((value: any) => web3.utils.toBN(value)),
			minipool.getTotalScrubVotes().then((value: any) => web3.utils.toBN(value)),
			rp.node.getNodeRPLStake(nodeAddress).then((value: any) => web3.utils.toBN(value)),
			rocketVault.methods
				.balanceOfToken("rocketAuctionManager", rocketTokenRPL.address)
				.call()
				.then((value: any) => web3.utils.toBN(value)),
			rocketDAONodeTrustedSettingsMinipool.methods.getScrubPenaltyEnabled().call(),
		]).then(([status, userDepositBalance, votes, nodeRPLStake, auctionBalance, penaltyEnabled]) => ({
			status,
			userDepositBalance,
			votes,
			nodeRPLStake,
			auctionBalance,
			penaltyEnabled,
		}));
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
	if (details1.votes.add(web3.utils.toBN(1)).gt(quorum)) {
		assert(details2.status.eq(dissolved), "Incorrect updated minipool status");
		assert(details2.userDepositBalance.eq(web3.utils.toBN(0)), "Incorrect updated minipool user deposit balance");
		if (details1.penaltyEnabled) {
			assert(details2.nodeRPLStake.lt(details1.nodeRPLStake), "RPL was not slashed");
			const slashAmount = details1.nodeRPLStake.sub(details2.nodeRPLStake);
			assert(details2.auctionBalance.sub(details1.auctionBalance).eq(slashAmount), "RPL was not sent to auction manager");
		}
	} else {
		assert(details2.votes.sub(details1.votes).eq(web3.utils.toBN(1)), "Vote count not incremented");
		assert(!details2.status.eq(dissolved), "Incorrect updated minipool status");
		assert(details2.nodeRPLStake.eq(details1.nodeRPLStake), "RPL was slashed");
	}
}
