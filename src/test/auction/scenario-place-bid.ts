// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {SendOptions} from 'web3-eth-contract';


// Place a bid on a lot
export async function placeBid(web3: Web3, rp: RocketPool, lotIndex: number, options: SendOptions) {

    // Load contracts
    const rocketAuctionManager = await rp.contracts.get('rocketAuctionManager');
    const rocketAuctionSettings = await rp.contracts.get('rocketDAOProtocolSettingsAuction');
    const rocketVault = await rp.contracts.get('rocketVault');

    // Calculation base value
    const calcBase = web3.utils.toBN(web3.utils.toWei('1', 'ether'));

    // Get lot details
    function getLotDetails(bidderAddress: string) {
        return Promise.all([
            rp.auction.getLotTotalRPLAmount(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotTotalBidAmount(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotAddressBidAmount(lotIndex, bidderAddress).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotPriceByTotalBids(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotCurrentPrice(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotClaimedRPLAmount(lotIndex).then((value: any) => web3.utils.toBN(value)),
            rp.auction.getLotRemainingRPLAmount(lotIndex).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([totalRplAmount, totalBidAmount, addressBidAmount, priceByTotalBids, currentPrice, claimedRplAmount, remainingRplAmount]) =>
                ({totalRplAmount, totalBidAmount, addressBidAmount, priceByTotalBids, currentPrice, claimedRplAmount, remainingRplAmount})
        );
    }

    // Get balances
    function getBalances(bidderAddress: string) {
        return Promise.all([
            web3.eth.getBalance(bidderAddress).then((value: any) => web3.utils.toBN(value)),
            web3.eth.getBalance(rocketVault.options.address).then((value: any) => web3.utils.toBN(value)),
            rocketVault.methods.balanceOf('rocketDepositPool').call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([bidderEth, vaultEth, depositPoolEth]) =>
                ({bidderEth, vaultEth, depositPoolEth})
        );
    }

    // Get lot price at block
    function getLotPriceAtBlock() {
        return web3.eth.getBlock('latest')
            .then((block: any) => rocketAuctionManager.methods.getLotPriceAtBlock(lotIndex, block.number).call());
    }

    // Get initial lot details & balances
    let [lot1, balances1] = await Promise.all([
        getLotDetails(options.from),
        getBalances(options.from),
    ]);

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();

    // Place bid
    let txReceipt = await rocketAuctionManager.methods.placeBid(lotIndex).send(options);
    let txFee = gasPrice.mul(web3.utils.toBN(txReceipt.gasUsed));

    // Get updated lot details & balances
    let [lot2, balances2] = await Promise.all([
        getLotDetails(options.from),
        getBalances(options.from),
    ]);

    // Get parameters
    const lotBlockPrice = web3.utils.toBN(await getLotPriceAtBlock());
    const lotRemainingRplAmount = lot1.totalRplAmount.sub(calcBase.mul(lot1.totalBidAmount).div(lotBlockPrice));

    // Get expected values
    const maxBidAmount = lotRemainingRplAmount.mul(lotBlockPrice).div(calcBase);

    const txValue = web3.utils.toBN((options.value as string));
    const bidAmount = (txValue.gt(maxBidAmount) ? maxBidAmount : txValue);

    // Check lot details
    assert(lot2.totalBidAmount.eq(lot1.totalBidAmount.add(bidAmount)), 'Incorrect updated total bid amount');
    assert(lot2.addressBidAmount.eq(lot1.addressBidAmount.add(bidAmount)), 'Incorrect updated address bid amount');
    assert(lot2.priceByTotalBids.eq(calcBase.mul(lot2.totalBidAmount).div(lot2.totalRplAmount)), 'Incorrect updated price by total bids');
    assert(lot2.claimedRplAmount.eq(calcBase.mul(lot2.totalBidAmount).div(lot2.currentPrice)), 'Incorrect updated claimed RPL amount');
    assert(lot2.totalRplAmount.eq(lot2.claimedRplAmount.add(lot2.remainingRplAmount)), 'Incorrect updated RPL amounts');

    // Check balances
    assert(balances2.bidderEth.eq(balances1.bidderEth.sub(bidAmount).sub(txFee)), 'Incorrect updated address ETH balance');
    assert(balances2.depositPoolEth.eq(balances1.depositPoolEth.add(bidAmount)), 'Incorrect updated deposit pool ETH balance');
    assert(balances2.vaultEth.eq(balances1.vaultEth.add(bidAmount)), 'Incorrect updated vault ETH balance');

}
