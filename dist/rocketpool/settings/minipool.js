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
        key: 'getMinipoolLaunchAmount',

        /**
         * Getters
         */
        // Get the total deposit amount required to launch a minipool in wei
        value: function getMinipoolLaunchAmount() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolLaunchAmount().call();
            });
        }
        // Get whether new minipools can currently be created

    }, {
        key: 'getMinipoolCanBeCreated',
        value: function getMinipoolCanBeCreated() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolCanBeCreated().call();
            });
        }
        // Get whether new minipool creation is currently allowed

    }, {
        key: 'getMinipoolNewEnabled',
        value: function getMinipoolNewEnabled() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolNewEnabled().call();
            });
        }
        // Get whether minipool closure is currently allowed

    }, {
        key: 'getMinipoolClosingEnabled',
        value: function getMinipoolClosingEnabled() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolClosingEnabled().call();
            });
        }
        // Get the maximum number of active minipools

    }, {
        key: 'getMinipoolMax',
        value: function getMinipoolMax() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolMax().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the minipool withdrawal fee payment address

    }, {
        key: 'getMinipoolWithdrawalFeeDepositAddress',
        value: function getMinipoolWithdrawalFeeDepositAddress() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolWithdrawalFeeDepositAddress().call();
            });
        }
        // Get the minipool timeout duration in seconds

    }, {
        key: 'getMinipoolTimeout',
        value: function getMinipoolTimeout() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolTimeout().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the maximum size of the active minipool set

    }, {
        key: 'getMinipoolActiveSetSize',
        value: function getMinipoolActiveSetSize() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolActiveSetSize().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the minipool staking duration by ID in blocks

    }, {
        key: 'getMinipoolStakingDuration',
        value: function getMinipoolStakingDuration(durationId) {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolStakingDuration(durationId).call();
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