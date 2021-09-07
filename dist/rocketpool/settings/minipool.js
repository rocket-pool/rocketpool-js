"use strict";

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
        key: "getLaunchBalance",

        /**
         * Getters
         */
        // Balance required to launch minipool in wei
        value: function getLaunchBalance() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getLaunchBalance().call();
            });
        }
        // Required node deposit amounts in wei

    }, {
        key: "getFullDepositNodeAmount",
        value: function getFullDepositNodeAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getFullDepositNodeAmount().call();
            });
        }
    }, {
        key: "getHalfDepositNodeAmount",
        value: function getHalfDepositNodeAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getHalfDepositNodeAmount().call();
            });
        }
    }, {
        key: "getEmptyDepositNodeAmount",
        value: function getEmptyDepositNodeAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getEmptyDepositNodeAmount().call();
            });
        }
        // Required user deposit amounts in wei

    }, {
        key: "getFullDepositUserAmount",
        value: function getFullDepositUserAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getFullDepositUserAmount().call();
            });
        }
    }, {
        key: "getHalfDepositUserAmount",
        value: function getHalfDepositUserAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getHalfDepositUserAmount().call();
            });
        }
    }, {
        key: "getEmptyDepositUserAmount",
        value: function getEmptyDepositUserAmount() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getEmptyDepositUserAmount().call();
            });
        }
        // Minipool withdrawable event submissions are currently enabled

    }, {
        key: "getSubmitWithdrawableEnabled",
        value: function getSubmitWithdrawableEnabled() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getSubmitWithdrawableEnabled().call();
            });
        }
        // Timeout period in blocks for prelaunch minipools to launch

    }, {
        key: "getLaunchTimeout",
        value: function getLaunchTimeout() {
            return this.rocketDAOProtocolSettingsMinipool.then(function (rocketDAOProtocolSettingsMinipool) {
                return rocketDAOProtocolSettingsMinipool.methods.getLaunchTimeout().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Withdrawal delay in blocks before withdrawable minipools can be closed

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