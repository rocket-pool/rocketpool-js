// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {SendOptions} from 'web3-eth-contract';

// Create a new lot for auction
export async function createLot(web3: Web3, rp: RocketPool, options: SendOptions) {

    // Get parameters
    const [
        lotMaxEthValue,
        lotDuration,
        startPriceRatio,
        reservePriceRatio,
        rplPrice,
    ] = await Promise.all([
        rp.settings.auction.getLotMaximumEthValue().then((value: any) => web3.utils.toBN(value)),
        rp.settings.auction.getLotDuration().then((value: any) => web3.utils.toBN(value)),
        rp.settings.auction.getStartingPriceRatio().then((value: any) => web3.utils.toBN(value)),
        rp.settings.auction.getReservePriceRatio().then((value: any) => web3.utils.toBN(value)),
        rp.network.getRPLPrice().then((value: any) => web3.utils.toBN(value)),
    ]);

    // Get auction contract details
    function getContractDetails() {
        return Promise.all([
            rp.auction.getTotalRPLBalance().then((value: any) => web3.utils.toBN(value)),
            rp.auction.getAllottedRPLBalance().then((value: any) => web3.utils.toBN(value)),
            rp.auction.getRemainingRPLBalance().then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotCount(),
        ]).then(
            ([totalRplBalance, allottedRplBalance, remainingRplBalance, lotCount]) =>
                ({totalRplBalance, allottedRplBalance, remainingRplBalance, lotCount: lotCount})
        );
    }

    // Get lot details
    function getLotDetails(lotIndex: number) {
        return Promise.all([
            rp.auction.getLotExists(lotIndex),
            rp.auction.getLotStartBlock(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotEndBlock(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotStartPrice(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotReservePrice(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotTotalRPLAmount(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotCurrentPrice(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotClaimedRPLAmount(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotRemainingRPLAmount(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotIsCleared(lotIndex),
        ]).then(
            ([exists, startBlock, endBlock, startPrice, reservePrice, totalRpl, currentPrice, claimedRpl, remainingRpl, isCleared]) =>
                ({exists, startBlock, endBlock, startPrice, reservePrice, totalRpl, currentPrice, claimedRpl, remainingRpl, isCleared})
        );
    }

    // Get initial contract details
    let details1 = await getContractDetails();

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();
    options.gas = 1000000;

    // Create lot
    await rp.auction.createLot(options);

    // Get updated contract details
    let [details2, lot] = await Promise.all([
        getContractDetails(),
        getLotDetails(details1.lotCount),
    ]);

    // Get expected values
    const calcBase = web3.utils.toBN(web3.utils.toWei('1', 'ether'));
    const lotMaxRplAmount = calcBase.mul(lotMaxEthValue).div(rplPrice);
    const expectedRemainingRplBalance = (details1.remainingRplBalance.gt(lotMaxRplAmount) ? details1.remainingRplBalance.sub(lotMaxRplAmount) : web3.utils.toBN(0));
    const expectedLotRplAmount = (details1.remainingRplBalance.lt(lotMaxRplAmount) ? details1.remainingRplBalance : lotMaxRplAmount);

    // Check contract details
    assert(details2.totalRplBalance.eq(details1.totalRplBalance), 'Total RPL balance updated and should not have');
    assert(details2.remainingRplBalance.eq(expectedRemainingRplBalance), 'Incorrect updated remaining RPL balance');
    assert(details2.totalRplBalance.eq(details2.allottedRplBalance.add(details2.remainingRplBalance)), 'Incorrect updated RPL balances');
    assert(web3.utils.toBN(details2.lotCount).eq(web3.utils.toBN(details1.lotCount).add(web3.utils.toBN(1))), 'Incorrect updated lot count');

    // Check lot details
    assert.isTrue(lot.exists, 'Incorrect lot exists status');
    assert(lot.endBlock.eq(lot.startBlock.add(lotDuration)), 'Incorrect lot start/end blocks');

    assert(lot.startPrice.eq(rplPrice.mul(startPriceRatio).div(calcBase)), 'Incorrect lot starting price');
    assert(lot.reservePrice.eq(rplPrice.mul(reservePriceRatio).div(calcBase)), 'Incorrect lot reserve price');
    assert(lot.totalRpl.eq(expectedLotRplAmount), 'Incorrect lot total RPL amount');
    assert(lot.currentPrice.eq(lot.startPrice), 'Incorrect lot current price');
    assert(lot.claimedRpl.eq(web3.utils.toBN(0)), 'Incorrect lot claimed RPL amount');
    assert(lot.remainingRpl.eq(lot.totalRpl), 'Incorrect lot remaining RPL amount');
    assert.isFalse(lot.isCleared, 'Incorrect lot cleared status');

}


