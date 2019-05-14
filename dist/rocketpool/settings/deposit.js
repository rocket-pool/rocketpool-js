'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool deposit settings manager
 */
var DepositSettings = function () {
    // Constructor
    function DepositSettings(web3, contracts) {
        _classCallCheck(this, DepositSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(DepositSettings, [{
        key: 'getDepositAllowed',

        /**
         * Getters
         */
        // Get whether deposits are currently allowed
        value: function getDepositAllowed() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getDepositAllowed().call();
            });
        }
        // Get the deposit chunk size in wei

    }, {
        key: 'getDepositChunkSize',
        value: function getDepositChunkSize() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getDepositChunkSize().call();
            });
        }
        // Get the minimum deposit amount in wei

    }, {
        key: 'getDepositMin',
        value: function getDepositMin() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getDepositMin().call();
            });
        }
        // Get the maximum deposit amount in wei

    }, {
        key: 'getDepositMax',
        value: function getDepositMax() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getDepositMax().call();
            });
        }
        // Get the maximum number of chunks assigned at once

    }, {
        key: 'getChunkAssignMax',
        value: function getChunkAssignMax() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getChunkAssignMax().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the maximum deposit queue size in wei

    }, {
        key: 'getDepositQueueSizeMax',
        value: function getDepositQueueSizeMax() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getDepositQueueSizeMax().call();
            });
        }
        // Get whether deposit refunds are currently allowed

    }, {
        key: 'getRefundDepositAllowed',
        value: function getRefundDepositAllowed() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getRefundDepositAllowed().call();
            });
        }
        // Get whether withdrawals are currently allowed

    }, {
        key: 'getWithdrawalAllowed',
        value: function getWithdrawalAllowed() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getWithdrawalAllowed().call();
            });
        }
        // Get the fee for withdrawing from the minipool while staking, as a fraction

    }, {
        key: 'getStakingWithdrawalFeePerc',
        value: function getStakingWithdrawalFeePerc() {
            var _this = this;

            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getStakingWithdrawalFeePerc().call();
            }).then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get the current maximum deposit amount in wei

    }, {
        key: 'getCurrentDepositMax',
        value: function getCurrentDepositMax(durationId) {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getCurrentDepositMax(durationId).call();
            });
        }
    }, {
        key: 'rocketDepositSettings',
        get: function get() {
            return this.contracts.get('rocketDepositSettings');
        }
    }]);

    return DepositSettings;
}();
// Exports


exports.default = DepositSettings;
//# sourceMappingURL=deposit.js.map