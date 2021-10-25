"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../utils/transaction");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Auction
 */
var Auction = function () {
    /**
     * Create a new Auction instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function Auction(web3, contracts) {
        _classCallCheck(this, Auction);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> that resolves to a web3.eth.contract instance of the rocketAuctionManager contract
     */


    _createClass(Auction, [{
        key: "getLotExists",

        /**
         * Check if the lot exists given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<boolean\> that resolves to a boolean representing whether the lot exists or not
         *
         * @example using Typescript
         * ```ts
         * const exists = rp.auction.getLotExists(lotIndex).then((val: boolean) => { val };
         * ```
         */
        value: function getLotExists(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotExists(lotIndex).call();
            });
        }
        /**
         * Return the lot start block given a lot index
         * @param lotIndex A number representing the Lot Index
         * @returns a Promise<number\> that resolves to a number representing the lot start block
         *
         * @example using Typescript
         * ```ts
         * const lotStartBlock = rp.auction.getLotStartBlock(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotStartBlock",
        value: function getLotStartBlock(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotStartBlock(lotIndex).call();
            });
        }
        /**
         * Return the lot end block given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the lot end block
         *
         * @example using Typescript
         * ```ts
         * const lotEndBlock = rp.auction.getLotEndBlock(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotEndBlock",
        value: function getLotEndBlock(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotEndBlock(lotIndex).call();
            });
        }
        /**
         * Return the lot start price given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the lot start price
         *
         * @example using Typescript
         * ```ts
         * const lotStartPrice = rp.auction.getLotStartPrice(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotStartPrice",
        value: function getLotStartPrice(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotStartPrice(lotIndex).call();
            });
        }
        /**
         * Return the lot reserve price given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the Lot Reserve Price
         *
         * @example using Typescript
         * ```ts
         * const lotReservePrice = rp.auction.getLotReservePrice(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotReservePrice",
        value: function getLotReservePrice(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotReservePrice(lotIndex).call();
            });
        }
        /**
         * Return the lot total bid amount given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the lot total bid amount
         *
         * @example using Typescript
         * ```ts
         * const lotTotalBidAmount = rp.auction.getLotTotalBidAmount(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotTotalBidAmount",
        value: function getLotTotalBidAmount(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotTotalBidAmount(lotIndex).call();
            });
        }
        /**
         * Return the lot total RPL amount given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the lot total RPL amount
         *
         * @example using Typescript
         * ```ts
         * const lotTotalRPLAmount = rp.auction.getLotTotalRPLAmount(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotTotalRPLAmount",
        value: function getLotTotalRPLAmount(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotTotalRPLAmount(lotIndex).call();
            });
        }
        /**
         * Return the lot address bid amount given a lot index and a bidder address
         * @param lotIndex A number representing the lot index
         * @param bidderAddress A string representing the bidder address
         * @returns a Promise<number\> that resolves to a number representing the lot address bid amount
         *
         * @example using Typescript
         * ```ts
         * const lotAddressBidAmount = rp.auction.getLotAddressBidAmount(lotIndex, bidderAddress).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotAddressBidAmount",
        value: function getLotAddressBidAmount(lotIndex, bidderAddress) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotAddressBidAmount(lotIndex, bidderAddress).call();
            });
        }
        /**
         * Return the lot current orice by total bids given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the lot price by total bids
         *
         * @example using Typescript
         * ```ts
         * const lotPriceByTotalBids = rp.auction.getLotPriceByTotalBids(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotPriceByTotalBids",
        value: function getLotPriceByTotalBids(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotPriceByTotalBids(lotIndex).call();
            });
        }
        /**
         * Return the current lot price given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the lot's current price
         *
         * @example using Typescript
         * ```ts
         * const lotCurrentPrice = rp.auction.getLotCurrentPrice(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotCurrentPrice",
        value: function getLotCurrentPrice(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotCurrentPrice(lotIndex).call();
            });
        }
        /**
         * Return the lot claimed RPL amount given a lot index
         * @param lotIndex A number representing the lot Index
         * @returns a Promise<number\> that resolves to a number representing the lot's claimed RPL amount
         *
         * @example using Typescript
         * ```ts
         * const lotClaimedRPLAmount = rp.auction.getLotClaimedRPLAmount(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotClaimedRPLAmount",
        value: function getLotClaimedRPLAmount(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotClaimedRPLAmount(lotIndex).call();
            });
        }
        /**
         * Return the lot remaining RPL amount given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the lot's remaining RPL amount
         *
         * @example using Typescript
         * ```ts
         * const lotRemainingRPLAmount = rp.auction.getLotRemainingRPLAmount(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotRemainingRPLAmount",
        value: function getLotRemainingRPLAmount(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotRemainingRPLAmount(lotIndex).call();
            });
        }
        /**
         * Check if a lot is cleared given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<boolean\> that resolves to a boolean representing whether the lot is cleared
         *
         * @example using Typescript
         * ```ts
         * const lotCleared = rp.auction.getLotIsCleared(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotIsCleared",
        value: function getLotIsCleared(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotIsCleared(lotIndex).call();
            });
        }
        /**
         * Return the total RPL balance
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the total RPL balance
         *
         * @example using Typescript
         * ```ts
         * const totalRPLBalance = rp.auction.getTotalRPLBalance(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getTotalRPLBalance",
        value: function getTotalRPLBalance() {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getTotalRPLBalance().call();
            });
        }
        /**
         * Return the allotted RPL balance
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the allotted RPL balance
         *
         * @example using Typescript
         * ```ts
         * const allottedRPLBalance = rp.auction.getAllottedRPLBalance(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getAllottedRPLBalance",
        value: function getAllottedRPLBalance() {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getAllottedRPLBalance().call();
            });
        }
        /**
         * Return the remaining RPL balance
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the remaining RPL balance
         *
         * @example using Typescript
         * ```ts
         * const remainingRPLBalance = rp.auction.getRemainingRPLBalance(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getRemainingRPLBalance",
        value: function getRemainingRPLBalance() {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getRemainingRPLBalance().call();
            });
        }
        /**
         * Return the Lot Count
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the lot count
         *
         * @example using Typescript
         * ```ts
         * const lotCount = rp.auction.getLotCount(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotCount",
        value: function getLotCount() {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotCount().call();
            });
        }
        /**
         * Return the lot price at a specified block given a lot index
         * @param lotIndex A number representing the lot index
         * @param block A number representing the block
         * @returns a Promise<number\> that resolves to a number representing the lot price at the specified block
         *
         * @example using Typescript
         * ```ts
         * const lotPrice = rp.auction.getLotPriceAtBlock(lotIndex, block).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotPriceAtBlock",
        value: function getLotPriceAtBlock(lotIndex, block) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotPriceAtBlock(lotIndex, block).call();
            });
        }
        // Return the lot RPL recovered given a lot index
        /**
         * Return the Lot RPL Recovered given a lot index
         * @param lotIndex A number representing the lot index
         * @returns a Promise<number\> that resolves to a number representing the lot RPL recovered
         *
         * @example using Typescript
         * ```ts
         * const lotRPLRecovered = rp.auction.getLotRPLRecovered(lotIndex).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotRPLRecovered",
        value: function getLotRPLRecovered(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotRPLRecovered(lotIndex).call();
            });
        }
        /**
         * Create a new lot for auction
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const options = {
         *		from: '0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294',
         *		gas: 1000000
         * }
         * const txReceipt = rp.auction.createLot(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "createLot",
        value: function createLot(options, onConfirmation) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return (0, _transaction.handleConfirmations)(rocketAuctionManager.methods.createLot().send(options), onConfirmation);
            });
        }
        /**
         * Create bid on a lot
         * @param lotIndex A number representing the lot index
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const options = {
         *		from: '0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294',
         *		gas: 1000000
         * }
         * const txReceipt = rp.auction.claimBid(lotIndex, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "claimBid",
        value: function claimBid(lotIndex, options, onConfirmation) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return (0, _transaction.handleConfirmations)(rocketAuctionManager.methods.claimBid(lotIndex).send(options), onConfirmation);
            });
        }
        /**
         * Place bid on a lot
         * @param lotIndex A number representing the lot ondex
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const options = {
         *		from: '0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294',
         *		gas: 1000000
         * }
         * const txReceipt = rp.auction.placeBid(lotIndex, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "placeBid",
        value: function placeBid(lotIndex, options, onConfirmation) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return (0, _transaction.handleConfirmations)(rocketAuctionManager.methods.placeBid(lotIndex).send(options), onConfirmation);
            });
        }
        /**
         * Recover Unclaimed RPL
         * @param lotIndex A number representing the lot index
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const options = {
         *		from: '0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294',
         *		gas: 1000000
         * }
         * const txReceipt = rp.auction.recoverUnclaimedRPL(lotIndex, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "recoverUnclaimedRPL",
        value: function recoverUnclaimedRPL(lotIndex, options, onConfirmation) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return (0, _transaction.handleConfirmations)(rocketAuctionManager.methods.recoverUnclaimedRPL(lotIndex).send(options), onConfirmation);
            });
        }
    }, {
        key: "rocketAuctionManager",
        get: function get() {
            return this.contracts.get("rocketAuctionManager");
        }
    }]);

    return Auction;
}();
// Exports


exports.default = Auction;
//# sourceMappingURL=auction.js.map