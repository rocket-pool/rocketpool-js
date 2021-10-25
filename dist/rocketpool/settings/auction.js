"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Auction Settings Manager
 */
var AuctionSettings = function () {
    /**
     * Create a new AuctionSettings instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function AuctionSettings(web3, contracts) {
        _classCallCheck(this, AuctionSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsAuction contract
     */


    _createClass(AuctionSettings, [{
        key: "getLotMaximumEthValue",

        /**
         * Return the lot maximum ETH value setting
         * @returns a Promise<number\> that resolves to a number representing the lot maximum ETH value setting
         *
         * @example using Typescript
         * ```ts
         * const lotMaximumEthValue = rp.settings.auction.getLotMaximumEthValue().then((val: number) => { val };
         * ```
         */
        value: function getLotMaximumEthValue() {
            return this.rocketDAOProtocolSettingsAuction.then(function (rocketDAOProtocolSettingsAuction) {
                return rocketDAOProtocolSettingsAuction.methods.getLotMaximumEthValue().call();
            });
        }
        /**
         * Return the lot duration setting
         * @returns a Promise<number\> that resolves to a number representing the lot duration setting
         *
         * @example using Typescript
         * ```ts
         * const lotMaximumEthValue = rp.settings.auction.getLotDuration().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLotDuration",
        value: function getLotDuration() {
            return this.rocketDAOProtocolSettingsAuction.then(function (rocketDAOProtocolSettingsAuction) {
                return rocketDAOProtocolSettingsAuction.methods.getLotDuration().call();
            });
        }
        /**
         * Return the starting price ratio setting
         * @returns a Promise<number\> that resolves to a number representing the starting price ratio setting
         *
         * @example using Typescript
         * ```ts
         * const startingPriceRatio = rp.settings.auction.getStartingPriceRatio().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getStartingPriceRatio",
        value: function getStartingPriceRatio() {
            return this.rocketDAOProtocolSettingsAuction.then(function (rocketDAOProtocolSettingsAuction) {
                return rocketDAOProtocolSettingsAuction.methods.getStartingPriceRatio().call();
            });
        }
        /**
         * Return the reserve price ratio setting
         * @returns a Promise<number\> that resolves to a number representing the reserve price ratio setting
         *
         * @example using Typescript
         * ```ts
         * const reservePriceRatio = rp.settings.auction.getReservePriceRatio().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getReservePriceRatio",
        value: function getReservePriceRatio() {
            return this.rocketDAOProtocolSettingsAuction.then(function (rocketDAOProtocolSettingsAuction) {
                return rocketDAOProtocolSettingsAuction.methods.getReservePriceRatio().call();
            });
        }
    }, {
        key: "rocketDAOProtocolSettingsAuction",
        get: function get() {
            return this.contracts.get("rocketDAOProtocolSettingsAuction");
        }
    }]);

    return AuctionSettings;
}();
// Exports


exports.default = AuctionSettings;
//# sourceMappingURL=auction.js.map