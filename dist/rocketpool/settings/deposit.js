"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Deposit Settings Manager
 */
var DepositSettings = function () {
    /**
     * Create a new Deposit Settings instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function DepositSettings(web3, contracts) {
        _classCallCheck(this, DepositSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsDeposit contract
     */


    _createClass(DepositSettings, [{
        key: "getDepositEnabled",

        /**
         * Check to see if deposits are enabled
         * @returns a Promise<boolean\> that resolves to a boolean representing if deposits are enabled
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.deposit.getDepositsEnabled().then((val: boolean) => { val };
         * ```
         */
        value: function getDepositEnabled() {
            return this.rocketDAOProtocolSettingsDeposit.then(function (rocketDAOProtocolSettingsDeposit) {
                return rocketDAOProtocolSettingsDeposit.methods.getDepositEnabled().call();
            });
        }
        /**
         * Check to see if deposit assignments are enabled
         * @returns a Promise<boolean\> that resolves to a boolean representing if deposit assignments are enabled
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.deposit.getAssignDepositsEnabled().then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getAssignDepositsEnabled",
        value: function getAssignDepositsEnabled() {
            return this.rocketDAOProtocolSettingsDeposit.then(function (rocketDAOProtocolSettingsDeposit) {
                return rocketDAOProtocolSettingsDeposit.methods.getAssignDepositsEnabled().call();
            });
        }
        /**
         * Return the minimum deposit amount setting in wei
         * @returns a Promise<string\> that resolves to a string representing the minimum deposit amount setting
         *
         * @example using Typescript
         * ```ts
         * const minimumDeposit = rp.settings.deposit.getMinimumDeposit().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getMinimumDeposit",
        value: function getMinimumDeposit() {
            return this.rocketDAOProtocolSettingsDeposit.then(function (rocketDAOProtocolSettingsDeposit) {
                return rocketDAOProtocolSettingsDeposit.methods.getMinimumDeposit().call();
            });
        }
        /**
         * Return the maximum deposit pool size setting in Wei
         * @returns a Promise<string\> that resolves to a string representing the maximum deposit pool size setting
         *
         * @example using Typescript
         * ```ts
         * const maximumDepositPoolSize = rp.settings.deposit.getMaximumDepositPoolSize().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getMaximumDepositPoolSize",
        value: function getMaximumDepositPoolSize() {
            return this.rocketDAOProtocolSettingsDeposit.then(function (rocketDAOProtocolSettingsDeposit) {
                return rocketDAOProtocolSettingsDeposit.methods.getMaximumDepositPoolSize().call();
            });
        }
        /**
         * Return the maximum number of deposit assignments to perform at once
         * @returns a Promise<number\> that resolves to a number representing the maximum number of deposit assignments to perform at once
         *
         * @example using Typescript
         * ```ts
         * const maxDepositAssignments = rp.settings.deposit.getMaximumDepositAssignments().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getMaximumDepositAssignments",
        value: function getMaximumDepositAssignments() {
            return this.rocketDAOProtocolSettingsDeposit.then(function (rocketDAOProtocolSettingsDeposit) {
                return rocketDAOProtocolSettingsDeposit.methods.getMaximumDepositAssignments().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
    }, {
        key: "rocketDAOProtocolSettingsDeposit",
        get: function get() {
            return this.contracts.get("rocketDAOProtocolSettingsDeposit");
        }
    }]);

    return DepositSettings;
}();
// Exports


exports.default = DepositSettings;
//# sourceMappingURL=deposit.js.map