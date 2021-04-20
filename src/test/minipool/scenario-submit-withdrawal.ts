// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Submit a minipool withdrawable event
export async function submitWithdrawable(web3: Web3, rp: RocketPool, minipoolAddress: string, stakingStartBalance: string, stakingEndBalance: string, options: SendOptions) {

    // Load contracts
    const rocketDAONodeTrusted = await rp.contracts.get('rocketDAONodeTrusted');
    const rocketMinipoolStatus = await rp.contracts.get('rocketMinipoolStatus');
    const rocketNodeStaking = await rp.contracts.get('rocketNodeStaking');
    const rocketStorage = await rp.contracts.get('rocketStorage');
    const rocketMinipoolDelegate = await rp.contracts.get('rocketMinipoolDelegate');


    // Get parameters
    let trustedNodeCount = await rocketDAONodeTrusted.methods.getMemberCount().call();

    // Get submission keys
    let nodeSubmissionKey = web3.utils.soliditySha3('minipool.withdrawable.submitted.node', options.from, minipoolAddress, stakingStartBalance, stakingEndBalance);
    let submissionCountKey = web3.utils.soliditySha3('minipool.withdrawable.submitted.count', minipoolAddress, stakingStartBalance, stakingEndBalance);

    // Get submission details
    function getSubmissionDetails() {
        return Promise.all([
            rocketStorage.methods.getBool(nodeSubmissionKey).call(),
            rocketStorage.methods.getUint(submissionCountKey).call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([nodeSubmitted, count]) =>
                ({nodeSubmitted, count})
        );
    }

    // Get minipool details
    function getMinipoolDetails() {
        return rp.minipool.getMinipoolContract(minipoolAddress).then((minipool: MinipoolContract) => Promise.all([
            minipool.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value)),
            minipool.contract.methods.getStakingStartBalance().call().then((value: any) => web3.utils.toBN(value)),
            minipool.contract.methods.getStakingEndBalance().call().then((value: any) => web3.utils.toBN(value)),
            minipool.contract.methods.getUserDepositBalance().call().then((value: any) => web3.utils.toBN(value)),
        ])).then(
            // @ts-ignore
            ([status, startBalance, endBalance, userDepositBalance]) =>
                ({status, startBalance, endBalance, userDepositBalance})
        );
    }

    // Get node details
    function getNodeDetails() {
        return rp.minipool.getMinipoolContract(minipoolAddress)
            .then((minipool: any) => minipool.contract.methods.getNodeAddress().call())
            .then((nodeAddress: any) => rocketNodeStaking.methods.getNodeRPLStake(nodeAddress).call())
            .then((rplStake: any) => ({rplStake: web3.utils.toBN(rplStake)}))
    }

    // Get initial details
    let [submission1, nodeDetails1] = await Promise.all([
        getSubmissionDetails(),
        getNodeDetails().catch((e: any) => ({})),
    ]);

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();
    options.gas = 10000000;

    // Submit
    await rocketMinipoolStatus.methods.submitMinipoolWithdrawable(minipoolAddress, stakingStartBalance, stakingEndBalance).send(options);

    // Get updated details
    let [submission2, nodeDetails2, minipoolDetails] = await Promise.all([
        getSubmissionDetails(),
        getNodeDetails(),
        getMinipoolDetails(),
    ]);

    // Check if minipool should be withdrawable
    let expectWithdrawable = submission2.count.mul(web3.utils.toBN(2)).gte(trustedNodeCount);

    // Check submission details
    assert.isFalse(submission1.nodeSubmitted, 'Incorrect initial node submitted status');
    assert.isTrue(submission2.nodeSubmitted, 'Incorrect updated node submitted status');
    assert(submission2.count.eq(submission1.count.add(web3.utils.toBN(1))), 'Incorrect updated submission count');

    // Check minipool details
    const withdrawable = web3.utils.toBN(3);

    if (expectWithdrawable) {
        assert(minipoolDetails.status.eq(withdrawable), 'Incorrect updated minipool status');
        assert(minipoolDetails.startBalance.eq(web3.utils.toBN(stakingStartBalance)), 'Incorrect updated minipool end balance');
        assert(minipoolDetails.endBalance.eq(web3.utils.toBN(stakingEndBalance)), 'Incorrect updated minipool end balance');
        if (web3.utils.toBN(stakingEndBalance).lt(minipoolDetails.userDepositBalance)) {
            // @ts-ignore
            assert(nodeDetails2.rplStake.lt(nodeDetails1.rplStake), 'Incorrect updated node RPL stake amount');
        }
    } else {
        assert(!minipoolDetails.status.eq(withdrawable), 'Incorrect updated minipool status');
    }
}
