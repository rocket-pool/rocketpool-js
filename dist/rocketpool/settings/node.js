'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool node settings manager
 */
var NodeSettings = function () {
    // Constructor
    function NodeSettings(web3, contracts) {
        _classCallCheck(this, NodeSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(NodeSettings, [{
        key: 'getNewAllowed',

        /**
         * Getters
         */
        // Get whether new node registration is currently allowed
        value: function getNewAllowed() {
            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getNewAllowed().call();
            });
        }
        // Get the minimum ether balance for a node to register in wei

    }, {
        key: 'getEtherMin',
        value: function getEtherMin() {
            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getEtherMin().call();
            });
        }
        // Get whether nodes are automatically set as inactive

    }, {
        key: 'getInactiveAutomatic',
        value: function getInactiveAutomatic() {
            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getInactiveAutomatic().call();
            });
        }
        // Get the duration after which to set a node failing to check in as inactive, in seconds

    }, {
        key: 'getInactiveDuration',
        value: function getInactiveDuration() {
            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getInactiveDuration().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the maximum number of other nodes to check for activity on checkin

    }, {
        key: 'getMaxInactiveNodeChecks',
        value: function getMaxInactiveNodeChecks() {
            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getMaxInactiveNodeChecks().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the fee charged to users by node operators as a fraction

    }, {
        key: 'getFeePerc',
        value: function getFeePerc() {
            var _this = this;

            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getFeePerc().call();
            }).then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get the maximum fee charged to users by node operators as a fraction

    }, {
        key: 'getMaxFeePerc',
        value: function getMaxFeePerc() {
            var _this2 = this;

            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getMaxFeePerc().call();
            }).then(function (value) {
                return parseFloat(_this2.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get the fee voting cycle duration in seconds

    }, {
        key: 'getFeeVoteCycleDuration',
        value: function getFeeVoteCycleDuration() {
            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getFeeVoteCycleDuration().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the fee change per voting cycle as a fraction

    }, {
        key: 'getFeeVoteCyclePercChange',
        value: function getFeeVoteCyclePercChange() {
            var _this3 = this;

            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getFeeVoteCyclePercChange().call();
            }).then(function (value) {
                return parseFloat(_this3.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get whether node deposits are currently allowed

    }, {
        key: 'getDepositAllowed',
        value: function getDepositAllowed() {
            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getDepositAllowed().call();
            });
        }
        // Get the duration that a node deposit reservation is valid for in seconds

    }, {
        key: 'getDepositReservationTime',
        value: function getDepositReservationTime() {
            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getDepositReservationTime().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get whether node withdrawals are currently allowed

    }, {
        key: 'getWithdrawalAllowed',
        value: function getWithdrawalAllowed() {
            return this.rocketNodeSettings.then(function (rocketNodeSettings) {
                return rocketNodeSettings.methods.getWithdrawalAllowed().call();
            });
        }
    }, {
        key: 'rocketNodeSettings',
        get: function get() {
            return this.contracts.get('rocketNodeSettings');
        }
    }]);

    return NodeSettings;
}();
// Exports


exports.default = NodeSettings;
//# sourceMappingURL=node.js.map