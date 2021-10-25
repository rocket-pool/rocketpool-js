"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Minipool Settings Manager
 */
var MinipoolSettings = function () {
    /**
     * Create a new Minipool Settings instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function MinipoolSettings(web3, contracts) {
        _classCallCheck(this, MinipoolSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsMinipool contract
     */


    _createClass(MinipoolSettings, [{
        key: "getLaunchBalance",

        /**
         * Return the balance required to launch a minipool setting in Wei
         * @returns a Promise<string\> that resolves to a string representing the balance required to launch a minipool setting
         *
         * @example using Typescript
         * ```ts
         * const launchBalance = rp.settings.minipool.getLaunchBalance().then((val: string) => { val };
         * ```
         */
        value: function getLaunchBalance() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getLaunchBalance().call();
            });
        }
        /**
         * Return the full node deposit amounts setting in Wei
         * @returns a Promise<string\> that resolves to a string representing the full node deposit amounts setting in wei
         *
         * @example using Typescript
         * ```ts
         * const fullDepositNodeAmount = rp.settings.minipool.getFullDepositNodeAmount().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getFullDepositNodeAmount",
        value: function getFullDepositNodeAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getFullDepositNodeAmount().call();
            });
        }
        /**
         * Return the half node deposit amounts setting in Wei
         * @returns a Promise<string\> that resolves to a string representing the half node deposit amounts setting in wei
         *
         * @example using Typescript
         * ```ts
         * const halfDepositNodeAmount = rp.settings.minipool.getHalfDepositNodeAmount().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getHalfDepositNodeAmount",
        value: function getHalfDepositNodeAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getHalfDepositNodeAmount().call();
            });
        }
        /**
         * Return the empty node deposit amounts setting in Wei
         * @returns a Promise<string\> that resolves to a string representing the empty node deposit amounts setting in wei
         *
         * @example using Typescript
         * ```ts
         * const emptyDepositNodeAmount = rp.settings.minipool.getEmptyDepositNodeAmount().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getEmptyDepositNodeAmount",
        value: function getEmptyDepositNodeAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getEmptyDepositNodeAmount().call();
            });
        }
        /**
         * Return the full user deposit amount setting in Wei
         * @returns a Promise<string\> that resolves to a string representing the full user deposit amount setting in wei
         *
         * @example using Typescript
         * ```ts
         * const fullDepositUserAmount = rp.settings.minipool.getFullDepositUserAmount().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getFullDepositUserAmount",
        value: function getFullDepositUserAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getFullDepositUserAmount().call();
            });
        }
        /**
         * Return the half user deposit amount setting in Wei
         * @returns a Promise<string\> that resolves to a string representing the half user deposit amount setting in wei
         *
         * @example using Typescript
         * ```ts
         * const halfDepositUserAmount = rp.settings.minipool.getHalfDepositUserAmount().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getHalfDepositUserAmount",
        value: function getHalfDepositUserAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getHalfDepositUserAmount().call();
            });
        }
        /**
         * Return the empty user deposit amount setting in Wei
         * @returns a Promise<string\> that resolves to a string representing the empty user deposit amount setting in wei
         *
         * @example using Typescript
         * ```ts
         * const emptyDepositUserAmount = rp.settings.minipool.getEmptyDepositUserAmount().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getEmptyDepositUserAmount",
        value: function getEmptyDepositUserAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getEmptyDepositUserAmount().call();
            });
        }
        /**
         * Return the minipool withdrawable event submissions setting
         * @returns a Promise<boolean\> that resolves to a boolean representing if minipool withdrawable events submissions are enabled
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.minipool.getSubmitWithdrawableEnabled().then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getSubmitWithdrawableEnabled",
        value: function getSubmitWithdrawableEnabled() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getSubmitWithdrawableEnabled().call();
            });
        }
        /**
         * Return the period in blocks for prelaunch minipools to launch
         * @returns a Promise<number\> that resolves to a number representing the period in blocks for prelaunch minipools to launch
         *
         * @example using Typescript
         * ```ts
         * const launchTimeout = rp.settings.minipool.getLaunchTimeout().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getLaunchTimeout",
        value: function getLaunchTimeout() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getLaunchTimeout().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        /**
         * Return the withdrawal delay setting in blocks
         * @returns a Promise<number\> that resolves to a number representing the withdrawal delay setting in blocks
         *
         * @example using Typescript
         * ```ts
         * const withdrawalDelay = rp.settings.minipool.getWithdrawalDelay().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getWithdrawalDelay",
        value: function getWithdrawalDelay() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getWithdrawalDelay().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
    }, {
        key: "rocketDAOProtocolSettingsMinipool",
        get: function get() {
            return this.contracts.get("rocketDAOProtocolSettingsMinipool");
        }
    }]);

    return MinipoolSettings;
}();
// Exports


exports.default = MinipoolSettings;
//# sourceMappingURL=minipool.js.map