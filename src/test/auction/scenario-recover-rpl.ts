// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {SendOptions} from 'web3-eth-contract';

// Recover unclaimed RPL from a lot
export async function recoverUnclaimedRPL(web3: Web3, rp: RocketPool, lotIndex: number, options: SendOptions) {


    // Get auction contract details
    function getContractDetails() {
        return Promise.all([
            rp.auction.getAllottedRPLBalance().then((value: any) => web3.utils.toBN(value)),
            rp.auction.getRemainingRPLBalance().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([allottedRplBalance, remainingRplBalance]) =>
                ({allottedRplBalance, remainingRplBalance})
        );
    }


    // Get lot details
    function getLotDetails() {
        return Promise.all([
            rp.auction.getLotRPLRecovered(lotIndex),
            rp.auction.getLotRemainingRPLAmount(lotIndex).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([rplRecovered, remainingRplAmount]) =>
                ({rplRecovered, remainingRplAmount})
        );
    }


    // Get initial details
    let [details1, lot1] = await Promise.all([
        getContractDetails(),
        getLotDetails(),
    ]);

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();

    // Recover RPL
    await rp.auction.recoverUnclaimedRPL(lotIndex, options);

    // Get updated details
    let [details2, lot2] = await Promise.all([
        getContractDetails(),
        getLotDetails(),
    ]);

    // Check details
    assert(details2.allottedRplBalance.eq(details1.allottedRplBalance.sub(lot1.remainingRplAmount)), 'Incorrect updated contract allotted RPL balance');
    assert(details2.remainingRplBalance.eq(details1.remainingRplBalance.add(lot1.remainingRplAmount)), 'Incorrect updated contract remaining RPL balance');
    assert.isTrue(lot2.rplRecovered, 'Incorrect updated lot RPL recovered status');

}
