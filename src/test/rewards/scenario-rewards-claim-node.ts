// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';

// Perform rewards claims for a regular node
export async function rewardsClaimNode(web3: Web3, rp: RocketPool, options: SendOptions) {

    // Get node withdrawal address
    let nodeWithdrawalAddress = await rp.node.getNodeWithdrawalAddress(options.from);

    // Get details
    function getDetails() {
        return Promise.all([
            rp.rewards.pool.getClaimingContractAllowance('rocketClaimNode').then((value: any) => web3.utils.toBN(value)),
            rp.node.getNodeTotalEffectiveRPLStake().then((value: any) => web3.utils.toBN(value)),
            rp.node.getNodeEffectiveRPLStake(options.from).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([nodesRplShare, totalRplStake, nodeRplStake]) =>
                ({nodesRplShare, totalRplStake, nodeRplStake})
        );
    }


    // Get balances
    function getBalances() {
        return Promise.all([
            rp.rewards.pool.getClaimIntervalTimeStart(),
            rp.tokens.rpl.balanceOf(nodeWithdrawalAddress).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([claimIntervalTimeStart, nodeRpl]) =>
                ({claimIntervalTimeStart, nodeRpl})
        );
    }

    // Get initial details & balances
    let [details1, balances1] = await Promise.all([
        getDetails(),
        getBalances(),
    ]);

    // Claim rewards
    await rp.rewards.claimNode.claim(options);

    // Get updated balances
    // Get updated balances
    let [details2, balances2] = await Promise.all([
        getDetails(),
        getBalances(),
    ]);

    // Calculate expected RPL claim amount
    let calcBase = web3.utils.toBN(web3.utils.toWei('1', 'ether'));
    let claimPerc = calcBase.mul(details2.nodeRplStake).div(details2.totalRplStake);
    let expectedClaimAmount = details2.nodesRplShare.mul(claimPerc).div(calcBase);

    // console.log(Number(balances1.claimIntervalTimeStart), Number(balances2.claimIntervalTimeStart));
    // console.log(web3.utils.fromWei(balances2.nodeRpl.sub(balances1.nodeRpl)), web3.utils.fromWei(expectedClaimAmount));

    // Check balances
    assert(balances2.nodeRpl.sub(balances1.nodeRpl).eq(expectedClaimAmount), 'Incorrect updated node RPL balance');
};
