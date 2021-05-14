// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {SendOptions} from 'web3-eth-contract';

// Claim RPL from a lot
export async function claimBid(web3: Web3, rp: RocketPool, lotIndex: number, options: SendOptions) {

    // Load contracts
    const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
    const rocketVault = await rp.contracts.get('rocketVault');

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
    function getLotDetails(bidderAddress: string) {
        return Promise.all([
            rp.auction.getLotAddressBidAmount(lotIndex, bidderAddress).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotCurrentPrice(lotIndex).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([addressBidAmount, currentPrice]) =>
                ({addressBidAmount, currentPrice})
        );
    }


    // Get balances
    function getBalances(bidderAddress: string) {
        return Promise.all([
            rp.tokens.rpl.balanceOf(bidderAddress).then((value: any) => web3.utils.toBN(value)),
            rp.tokens.rpl.balanceOf(rocketVault.options.address).then((value: any) => web3.utils.toBN(value)),
            rocketVault.methods.balanceOfToken('rocketAuctionManager', rocketTokenRPL.options.address).call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([bidderRpl, vaultRpl, contractRpl]) =>
                ({bidderRpl, vaultRpl, contractRpl})
        );
    }


    // Get initial details & balances
    let [details1, lot1, balances1] = await Promise.all([
        getContractDetails(),
        getLotDetails(options.from),
        getBalances(options.from),
    ]);

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();

    // Claim RPL
    await rp.auction.claimBid(lotIndex, options);

    // Get updated details & balances
    let [details2, lot2, balances2] = await Promise.all([
        getContractDetails(),
        getLotDetails(options.from),
        getBalances(options.from),
    ]);

    // Get expected values
    const calcBase = web3.utils.toBN(web3.utils.toWei('1', 'ether'));
    const expectedRplAmount = calcBase.mul(lot1.addressBidAmount).div(lot1.currentPrice);

    // Check details
    assert(details2.allottedRplBalance.eq(details1.allottedRplBalance.sub(expectedRplAmount)), 'Incorrect updated contract allotted RPL balance');
    assert(details2.remainingRplBalance.eq(details1.remainingRplBalance), 'Contract remaining RPL balance updated and should not have');
    assert(lot2.addressBidAmount.eq(web3.utils.toBN(0)), 'Incorrect updated address bid amount');

    // Check balances
    assert(balances2.bidderRpl.eq(balances1.bidderRpl.add(expectedRplAmount)), 'Incorrect updated address RPL balance');
    assert(balances2.contractRpl.eq(balances1.contractRpl.sub(expectedRplAmount)), 'Incorrect updated auction contract RPL balance');
    assert(balances2.vaultRpl.eq(balances1.vaultRpl.sub(expectedRplAmount)), 'Incorrect updated vault RPL balance');

}
