// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Submit network prices
export async function submitPrices(web3: Web3, rp: RocketPool, block: number, rplPrice: string, options: SendOptions) {

    // Load contracts
    const rocketDAONodeTrusted = await rp.contracts.get('rocketDAONodeTrusted');
    const rocketNetworkPrices = await rp.contracts.get('rocketNetworkPrices');
    const rocketStorage = await rp.contracts.get('rocketStorage');

    // Get parameters
    let trustedNodeCount = await rocketDAONodeTrusted.methods.getMemberCount().call();

    // Get submission keys
    let nodeSubmissionKey = web3.utils.soliditySha3('network.prices.submitted.node', options.from, block, rplPrice);
    let submissionCountKey = web3.utils.soliditySha3('network.prices.submitted.count', block, rplPrice);

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

    // Get prices
    function getPrices() {
        return Promise.all([
            rocketNetworkPrices.methods.getPricesBlock().call().then((value: any) => web3.utils.toBN(value)),
            rocketNetworkPrices.methods.getRPLPrice().call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([block, rplPrice]) =>
                ({block, rplPrice})
        );
    }

    // Get initial submission details
    let submission1 = await getSubmissionDetails();

    // Submit prices
    await rocketNetworkPrices.methods.submitPrices(block, rplPrice).send(options);

    // Get updated submission details & prices
    let [submission2, prices] = await Promise.all([
        getSubmissionDetails(),
        getPrices(),
    ]);

    // Check if prices should be updated
    let expectUpdatedPrices = submission2.count.mul(web3.utils.toBN(2)).gte(trustedNodeCount);

    // Check submission details
    assert.isFalse(submission1.nodeSubmitted, 'Incorrect initial node submitted status');
    assert.isTrue(submission2.nodeSubmitted, 'Incorrect updated node submitted status');
    assert(submission2.count.eq(submission1.count.add(web3.utils.toBN(1))), 'Incorrect updated submission count');

    // Check prices
    if (expectUpdatedPrices) {
        assert(prices.block.eq(web3.utils.toBN(block)), 'Incorrect updated network prices block');
        assert(prices.rplPrice.eq(web3.utils.toBN(rplPrice)), 'Incorrect updated network RPL price');
    } else {
        assert(!prices.block.eq(web3.utils.toBN(block)), 'Incorrectly updated network prices block');
        assert(!prices.rplPrice.eq(web3.utils.toBN(rplPrice)), 'Incorrectly updated network RPL price');
    }

}

