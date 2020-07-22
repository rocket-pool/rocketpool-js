'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool network settings manager
 */
var NetworkSettings = function () {
    // Constructor
    function NetworkSettings(web3, contracts) {
        _classCallCheck(this, NetworkSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(NetworkSettings, [{
        key: 'getNodeConsensusThreshold',

        /**
         * Getters
         */
        // The threshold of trusted nodes that must reach consensus on oracle data to commit it
        value: function getNodeConsensusThreshold() {
            var _this = this;

            return this.rocketNetworkSettings.then(function (rocketNetworkSettings) {
                return rocketNetworkSettings.methods.getNodeConsensusThreshold().call();
            }).then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, 'ether'));
            });
        }
        // ETH balance submissions are currently enabled

    }, {
        key: 'getSubmitBalancesEnabled',
        value: function getSubmitBalancesEnabled() {
            return this.rocketNetworkSettings.then(function (rocketNetworkSettings) {
                return rocketNetworkSettings.methods.getSubmitBalancesEnabled().call();
            });
        }
        // Processing withdrawals is currently enabled

    }, {
        key: 'getProcessWithdrawalsEnabled',
        value: function getProcessWithdrawalsEnabled() {
            return this.rocketNetworkSettings.then(function (rocketNetworkSettings) {
                return rocketNetworkSettings.methods.getProcessWithdrawalsEnabled().call();
            });
        }
        // Node commission rate parameters

    }, {
        key: 'getMinimumNodeFee',
        value: function getMinimumNodeFee() {
            var _this2 = this;

            return this.rocketNetworkSettings.then(function (rocketNetworkSettings) {
                return rocketNetworkSettings.methods.getMinimumNodeFee().call();
            }).then(function (value) {
                return parseFloat(_this2.web3.utils.fromWei(value, 'ether'));
            });
        }
    }, {
        key: 'getTargetNodeFee',
        value: function getTargetNodeFee() {
            var _this3 = this;

            return this.rocketNetworkSettings.then(function (rocketNetworkSettings) {
                return rocketNetworkSettings.methods.getTargetNodeFee().call();
            }).then(function (value) {
                return parseFloat(_this3.web3.utils.fromWei(value, 'ether'));
            });
        }
    }, {
        key: 'getMaximumNodeFee',
        value: function getMaximumNodeFee() {
            var _this4 = this;

            return this.rocketNetworkSettings.then(function (rocketNetworkSettings) {
                return rocketNetworkSettings.methods.getMaximumNodeFee().call();
            }).then(function (value) {
                return parseFloat(_this4.web3.utils.fromWei(value, 'ether'));
            });
        }
        // The range of node demand values in wei to base fee calculations on (from negative to positive value)

    }, {
        key: 'getNodeFeeDemandRange',
        value: function getNodeFeeDemandRange() {
            return this.rocketNetworkSettings.then(function (rocketNetworkSettings) {
                return rocketNetworkSettings.methods.getNodeFeeDemandRange().call();
            });
        }
        // The target rETH collateralization rate

    }, {
        key: 'getTargetRethCollateralRate',
        value: function getTargetRethCollateralRate() {
            var _this5 = this;

            return this.rocketNetworkSettings.then(function (rocketNetworkSettings) {
                return rocketNetworkSettings.methods.getTargetRethCollateralRate().call();
            }).then(function (value) {
                return parseFloat(_this5.web3.utils.fromWei(value, 'ether'));
            });
        }
    }, {
        key: 'rocketNetworkSettings',
        get: function get() {
            return this.contracts.get('rocketNetworkSettings');
        }
    }]);

    return NetworkSettings;
}();
// Exports


exports.default = NetworkSettings;
//# sourceMappingURL=network.js.map