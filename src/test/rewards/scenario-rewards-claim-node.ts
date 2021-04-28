// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';

// Perform rewards claims for a regular node
export async function rewardsClaimNode(web3: Web3, rp: RocketPool, options: SendOptions) {
    // Load contracts
    const rocketClaimNode = await rp.contracts.get('rocketClaimNode');
    const rocketNodeManager = await rp.contracts.get('rocketNodeManager');
    const rocketNodeStaking = await rp.contracts.get('rocketNodeStaking');
    const rocketRewardsPool = await rp.contracts.get('rocketRewardsPool');
    const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');

    // Get node withdrawal address
    let nodeWithdrawalAddress = await rocketNodeManager.methods.getNodeWithdrawalAddress(options.from).call();

    // Get details
    function getDetails() {
        return Promise.all([
            rocketRewardsPool.methods.getClaimingContractAllowance('rocketClaimNode').call().then((value: any) => web3.utils.toBN(value)),
            rocketNodeStaking.methods.getTotalEffectiveRPLStake().call().then((value: any) => web3.utils.toBN(value)),
            rocketNodeStaking.methods.getNodeEffectiveRPLStake(options.from).call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([nodesRplShare, totalRplStake, nodeRplStake]) =>
                ({nodesRplShare, totalRplStake, nodeRplStake})
        );
    }

    // Get balances
    function getBalances() {
        return Promise.all([
            rocketRewardsPool.methods.getClaimIntervalBlockStart().call(),
            rocketTokenRPL.methods.balanceOf(nodeWithdrawalAddress).call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([claimIntervalBlockStart, nodeRpl]) =>
                ({claimIntervalBlockStart, nodeRpl})
        );
    }

    // Get initial details & balances
    let [details1, balances1] = await Promise.all([
        getDetails(),
        getBalances(),
    ]);

    // Claim rewards
    await rocketClaimNode.methods.claim().send(options);

    // Get updated balances
    let balances2 = await getBalances();

    // Calculate expected RPL claim amount
    let calcBase = web3.utils.toBN(web3.utils.toWei('1', 'ether'));
    let claimPerc = calcBase.mul(details1.nodeRplStake).div(details1.totalRplStake);
    let expectedClaimAmount = details1.nodesRplShare.mul(claimPerc).div(calcBase);

    // console.log(Number(balances1.claimIntervalBlockStart), Number(balances2.claimIntervalBlockStart));
    // console.log(web3.utils.fromWei(balances2.nodeRpl.sub(balances1.nodeRpl)), web3.utils.fromWei(expectedClaimAmount));

    // Check balances
    assert(balances2.nodeRpl.sub(balances1.nodeRpl).eq(expectedClaimAmount), 'Incorrect updated node RPL balance');
};


