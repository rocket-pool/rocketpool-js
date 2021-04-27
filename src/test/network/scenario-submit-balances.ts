// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Submit network ETH balances
export async function submitBalances(web3: Web3, rp: RocketPool, block: number, totalEth: string, stakingEth: string, rethSupply: string, options: SendOptions) {

    // Load contracts
    const rocketDAONodeTrusted = await rp.contracts.get('rocketDAONodeTrusted');
    const rocketNetworkBalances = await rp.contracts.get('rocketNetworkBalances');
    const rocketStorage = await rp.contracts.get('rocketStorage');

    // Get parameters
    let trustedNodeCount = await rocketDAONodeTrusted.methods.getMemberCount().call();

    // Get submission keys
    let nodeSubmissionKey = web3.utils.soliditySha3('network.balances.submitted.node', options.from, block, totalEth, stakingEth, rethSupply);
    let submissionCountKey = web3.utils.soliditySha3('network.balances.submitted.count', block, totalEth, stakingEth, rethSupply);

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

    // Get balances
    function getBalances() {
        return Promise.all([
            rocketNetworkBalances.methods.getBalancesBlock().call().then((value: any) => web3.utils.toBN(value)),
            rocketNetworkBalances.methods.getTotalETHBalance().call().then((value: any) => web3.utils.toBN(value)),
            rocketNetworkBalances.methods.getStakingETHBalance().call().then((value: any) => web3.utils.toBN(value)),
            rocketNetworkBalances.methods.getTotalRETHSupply().call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([block, totalEth, stakingEth, rethSupply]) =>
                ({block, totalEth, stakingEth, rethSupply})
        );
    }

    // Get initial submission details
    let submission1 = await getSubmissionDetails();

    // Submit balances
    await rocketNetworkBalances.methods.submitBalances(block, totalEth, stakingEth, rethSupply).send(options);

    // Get updated submission details & balances
    let [submission2, balances] = await Promise.all([
        getSubmissionDetails(),
        getBalances(),
    ]);

    // Check if balances should be updated
    let expectUpdatedBalances = submission2.count.mul(web3.utils.toBN(2)).gte(trustedNodeCount);

    // Check submission details
    assert.isFalse(submission1.nodeSubmitted, 'Incorrect initial node submitted status');
    assert.isTrue(submission2.nodeSubmitted, 'Incorrect updated node submitted status');
    assert(submission2.count.eq(submission1.count.add(web3.utils.toBN(1))), 'Incorrect updated submission count');

    // Check balances
    if (expectUpdatedBalances) {
        assert(balances.block.eq(web3.utils.toBN(block)), 'Incorrect updated network balances block');
        assert(balances.totalEth.eq(web3.utils.toBN(totalEth)), 'Incorrect updated network total ETH balance');
        assert(balances.stakingEth.eq(web3.utils.toBN(stakingEth)), 'Incorrect updated network staking ETH balance');
        assert(balances.rethSupply.eq(web3.utils.toBN(rethSupply)), 'Incorrect updated network total rETH supply');
    } else {
        assert(!balances.block.eq(web3.utils.toBN(block)), 'Incorrectly updated network balances block');
        assert(!balances.totalEth.eq(web3.utils.toBN(totalEth)), 'Incorrectly updated network total ETH balance');
        assert(!balances.stakingEth.eq(web3.utils.toBN(stakingEth)), 'Incorrectly updated network staking ETH balance');
        assert(!balances.rethSupply.eq(web3.utils.toBN(rethSupply)), 'Incorrectly updated network total rETH supply');
    }

}

