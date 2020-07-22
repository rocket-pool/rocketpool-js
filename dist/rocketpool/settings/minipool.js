'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool minipool settings manager
 */
var MinipoolSettings = function () {
    // Constructor
    function MinipoolSettings(web3, contracts) {
        _classCallCheck(this, MinipoolSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(MinipoolSettings, [{
        key: 'getLaunchBalance',

        /**
         * Getters
         */
        // Balance required to launch minipool in wei
        value: function getLaunchBalance() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getLaunchBalance().call();
            });
        }
        // Required node deposit amounts in wei

    }, {
        key: 'getFullDepositNodeAmount',
        value: function getFullDepositNodeAmount() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getFullDepositNodeAmount().call();
            });
        }
    }, {
        key: 'getHalfDepositNodeAmount',
        value: function getHalfDepositNodeAmount() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getHalfDepositNodeAmount().call();
            });
        }
    }, {
        key: 'getEmptyDepositNodeAmount',
        value: function getEmptyDepositNodeAmount() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getEmptyDepositNodeAmount().call();
            });
        }
        // Required user deposit amounts in wei

    }, {
        key: 'getFullDepositUserAmount',
        value: function getFullDepositUserAmount() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getFullDepositUserAmount().call();
            });
        }
    }, {
        key: 'getHalfDepositUserAmount',
        value: function getHalfDepositUserAmount() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getHalfDepositUserAmount().call();
            });
        }
    }, {
        key: 'getEmptyDepositUserAmount',
        value: function getEmptyDepositUserAmount() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getEmptyDepositUserAmount().call();
            });
        }
        // Minipool withdrawable event submissions are currently enabled

    }, {
        key: 'getSubmitWithdrawableEnabled',
        value: function getSubmitWithdrawableEnabled() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getSubmitWithdrawableEnabled().call();
            });
        }
        // Timeout period in blocks for prelaunch minipools to launch

    }, {
        key: 'getLaunchTimeout',
        value: function getLaunchTimeout() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getLaunchTimeout().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Withdrawal delay in blocks before withdrawable minipools can be closed

    }, {
        key: 'getWithdrawalDelay',
        value: function getWithdrawalDelay() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getWithdrawalDelay().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
    }, {
        key: 'rocketMinipoolSettings',
        get: function get() {
            return this.contracts.get('rocketMinipoolSettings');
        }
    }]);

    return MinipoolSettings;
}();
// Exports


exports.default = MinipoolSettings;
//# sourceMappingURL=minipool.js.map