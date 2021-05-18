'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Auction
 */
var Auction = function () {
    // Constructor
    function Auction(web3, contracts) {
        _classCallCheck(this, Auction);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Auction, [{
        key: 'getLotExists',

        /**
         * Getters
         */
        // Check that a lot exists given a lotIndex
        value: function getLotExists(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotExists(lotIndex).call();
            });
        }
        // Return the Lot Start Block given a lotIndex

    }, {
        key: 'getLotStartBlock',
        value: function getLotStartBlock(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotStartBlock(lotIndex).call();
            });
        }
        // Return the Lot End Block given a lotIndex

    }, {
        key: 'getLotEndBlock',
        value: function getLotEndBlock(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotEndBlock(lotIndex).call();
            });
        }
        // Return the Lot Start Price given a lotIndex

    }, {
        key: 'getLotStartPrice',
        value: function getLotStartPrice(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotStartPrice(lotIndex).call();
            });
        }
        // Return the Lot Reserve Price given a lotIndex

    }, {
        key: 'getLotReservePrice',
        value: function getLotReservePrice(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotReservePrice(lotIndex).call();
            });
        }
        // Return the Lot Total Bid Amount given a lotIndex

    }, {
        key: 'getLotTotalBidAmount',
        value: function getLotTotalBidAmount(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotTotalBidAmount(lotIndex).call();
            });
        }
        // Return the Lot Total RPL Amount given a lotIndex

    }, {
        key: 'getLotTotalRPLAmount',
        value: function getLotTotalRPLAmount(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotTotalRPLAmount(lotIndex).call();
            });
        }
        // Return the Lot Address Bid Amount given a lotIndex and a bidderAddress

    }, {
        key: 'getLotAddressBidAmount',
        value: function getLotAddressBidAmount(lotIndex, bidderAddress) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotAddressBidAmount(lotIndex, bidderAddress).call();
            });
        }
        // Return the Lot Current Price by Total Bids given a lotIndex

    }, {
        key: 'getLotPriceByTotalBids',
        value: function getLotPriceByTotalBids(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotPriceByTotalBids(lotIndex).call();
            });
        }
        // Return the Lot Current Price given a lotIndex

    }, {
        key: 'getLotCurrentPrice',
        value: function getLotCurrentPrice(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotCurrentPrice(lotIndex).call();
            });
        }
        // Return the Lot Claimed Amount given a lotIndex

    }, {
        key: 'getLotClaimedRPLAmount',
        value: function getLotClaimedRPLAmount(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotClaimedRPLAmount(lotIndex).call();
            });
        }
        // Return the Lot Remaining RPL Amount given a lotIndex

    }, {
        key: 'getLotRemainingRPLAmount',
        value: function getLotRemainingRPLAmount(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotRemainingRPLAmount(lotIndex).call();
            });
        }
        // Return the Lot Remaining RPL Amount given a lotIndex

    }, {
        key: 'getLotIsCleared',
        value: function getLotIsCleared(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotIsCleared(lotIndex).call();
            });
        }
        // Return the total RPL balance

    }, {
        key: 'getTotalRPLBalance',
        value: function getTotalRPLBalance() {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getTotalRPLBalance().call();
            });
        }
        // Return the allotted RPL balance

    }, {
        key: 'getAllottedRPLBalance',
        value: function getAllottedRPLBalance() {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getAllottedRPLBalance().call();
            });
        }
        // Return the remaining RPL balance

    }, {
        key: 'getRemainingRPLBalance',
        value: function getRemainingRPLBalance() {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getRemainingRPLBalance().call();
            });
        }
        // Return the lot count

    }, {
        key: 'getLotCount',
        value: function getLotCount() {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotCount().call();
            });
        }
        // Return the lot price at a specified block given a lot index

    }, {
        key: 'getLotPriceAtBlock',
        value: function getLotPriceAtBlock(lotIndex, block) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotPriceAtBlock(lotIndex, block).call();
            });
        }
        // Return the lot RPL recovered given a lot index

    }, {
        key: 'getLotRPLRecovered',
        value: function getLotRPLRecovered(lotIndex) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return rocketAuctionManager.methods.getLotRPLRecovered(lotIndex).call();
            });
        }
        /**
         * Mutators - Public
         */
        // Create a lot

    }, {
        key: 'createLot',
        value: function createLot(options, onConfirmation) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return (0, _transaction.handleConfirmations)(rocketAuctionManager.methods.createLot().send(options), onConfirmation);
            });
        }
    }, {
        key: 'claimBid',
        value: function claimBid(lotIndex, options, onConfirmation) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return (0, _transaction.handleConfirmations)(rocketAuctionManager.methods.claimBid(lotIndex).send(options), onConfirmation);
            });
        }
    }, {
        key: 'placeBid',
        value: function placeBid(lotIndex, options, onConfirmation) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return (0, _transaction.handleConfirmations)(rocketAuctionManager.methods.placeBid(lotIndex).send(options), onConfirmation);
            });
        }
    }, {
        key: 'recoverUnclaimedRPL',
        value: function recoverUnclaimedRPL(lotIndex, options, onConfirmation) {
            return this.rocketAuctionManager.then(function (rocketAuctionManager) {
                return (0, _transaction.handleConfirmations)(rocketAuctionManager.methods.recoverUnclaimedRPL(lotIndex).send(options), onConfirmation);
            });
        }
    }, {
        key: 'rocketAuctionManager',
        get: function get() {
            return this.contracts.get('rocketAuctionManager');
        }
    }]);

    return Auction;
}();
// Exports


exports.default = Auction;
//# sourceMappingURL=auction.js.map