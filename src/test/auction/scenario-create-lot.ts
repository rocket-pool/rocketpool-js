// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { SendOptions } from 'web3-eth-contract';

// Create a new lot for auction
export async function createLot(web3: Web3, rp: RocketPool, options: SendOptions) {

    // Load contracts
    const rocketAuctionManager = await rp.contracts.get('rocketAuctionManager');
    const rocketAuctionSettings = await rp.contracts.get('rocketDAOProtocolSettingsAuction');
    const rocketNetworkPrices = await rp.contracts.get('rocketNetworkPrices');

    // Get parameters
    const [
        lotMaxEthValue,
        lotDuration,
        startPriceRatio,
        reservePriceRatio,
        rplPrice,
    ] = await Promise.all([
        rocketAuctionSettings.methods.getLotMaximumEthValue().call().then((value: any) => web3.utils.toBN(value)),
        rocketAuctionSettings.methods.getLotDuration().call().then((value: any) => web3.utils.toBN(value)),
        rocketAuctionSettings.methods.getStartingPriceRatio().call().then((value: any) => web3.utils.toBN(value)),
        rocketAuctionSettings.methods.getReservePriceRatio().call().then((value: any) => web3.utils.toBN(value)),
        rocketNetworkPrices.methods.getRPLPrice().call().then((value: any) => web3.utils.toBN(value)),
    ]);

    // Get auction contract details
    function getContractDetails() {
        return Promise.all([
            rocketAuctionManager.methods.getTotalRPLBalance().call(),
            rocketAuctionManager.methods.getAllottedRPLBalance().call(),
            rocketAuctionManager.methods.getRemainingRPLBalance().call(),
            rocketAuctionManager.methods.getLotCount().call(),
        ]).then(
            ([totalRplBalance, allottedRplBalance, remainingRplBalance, lotCount]) =>
                ({
                    totalRplBalance: web3.utils.toBN(totalRplBalance),
                    allottedRplBalance: web3.utils.toBN(allottedRplBalance),
                    remainingRplBalance: web3.utils.toBN(remainingRplBalance),
                    lotCount: lotCount
                })
        );
    }

    // Get lot details
    function getLotDetails(lotIndex: number) {
        return Promise.all([
            rocketAuctionManager.methods.getLotExists(lotIndex).call(),
            rocketAuctionManager.methods.getLotStartBlock(lotIndex).call(),
            rocketAuctionManager.methods.getLotEndBlock(lotIndex).call(),
            rocketAuctionManager.methods.getLotStartPrice(lotIndex).call(),
            rocketAuctionManager.methods.getLotReservePrice(lotIndex).call(),
            rocketAuctionManager.methods.getLotTotalRPLAmount(lotIndex).call(),
            rocketAuctionManager.methods.getLotCurrentPrice(lotIndex).call(),
            rocketAuctionManager.methods.getLotClaimedRPLAmount(lotIndex).call(),
            rocketAuctionManager.methods.getLotRemainingRPLAmount(lotIndex).call(),
            rocketAuctionManager.methods.getLotIsCleared(lotIndex).call(),
        ]).then(
            ([exists, startBlock, endBlock, startPrice, reservePrice, totalRpl, currentPrice, claimedRpl, remainingRpl, isCleared]) =>
                ({
                    exists,
                    startBlock: web3.utils.toBN(startBlock),
                    endBlock: web3.utils.toBN(endBlock),
                    startPrice: web3.utils.toBN(startPrice),
                    reservePrice: web3.utils.toBN(reservePrice),
                    totalRpl: web3.utils.toBN(totalRpl),
                    currentPrice: web3.utils.toBN(currentPrice),
                    claimedRpl: web3.utils.toBN(claimedRpl),
                    remainingRpl: web3.utils.toBN(remainingRpl),
                    isCleared
                })
        );
    }

    // Get initial contract details
    let details1 = await getContractDetails();

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();
    options.gas = 1000000;

    // Create lot
    await rocketAuctionManager.methods.createLot().send(options);

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


