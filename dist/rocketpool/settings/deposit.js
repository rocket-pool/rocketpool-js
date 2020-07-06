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
        key: 'getDepositEnabled',

        /**
         * Getters
         */
        // Deposits are currently enabled
        value: function getDepositEnabled() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getDepositEnabled().call();
            });
        }
        // Deposit assignments are currently enabled

    }, {
        key: 'getAssignDepositsEnabled',
        value: function getAssignDepositsEnabled() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getAssignDepositsEnabled().call();
            });
        }
        // Minimum deposit amount in wei

    }, {
        key: 'getMinimumDeposit',
        value: function getMinimumDeposit() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getMinimumDeposit().call();
            });
        }
        // Maximum deposit pool size in wei

    }, {
        key: 'getMaximumDepositPoolSize',
        value: function getMaximumDepositPoolSize() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getMaximumDepositPoolSize().call();
            });
        }
        // Maximum number of deposit assignments to perform at once

    }, {
        key: 'getMaximumDepositAssignments',
        value: function getMaximumDepositAssignments() {
            return this.rocketDepositSettings.then(function (rocketDepositSettings) {
                return rocketDepositSettings.methods.getMaximumDepositAssignments().call();
            }).then(function (value) {
                return parseInt(value);
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