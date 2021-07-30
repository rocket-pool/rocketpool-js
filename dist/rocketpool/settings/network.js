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

            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getNodeConsensusThreshold().call();
            }).then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Balance submissions are currently enabled

    }, {
        key: 'getSubmitBalancesEnabled',
        value: function getSubmitBalancesEnabled() {
            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getSubmitBalancesEnabled().call();
            });
        }
        // The frequency in blocks at which network balances should be submitted by trusted nodes

    }, {
        key: 'getSubmitBalancesFrequency',
        value: function getSubmitBalancesFrequency() {
            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getSubmitBalancesFrequency().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Node commission rate parameters

    }, {
        key: 'getMinimumNodeFee',
        value: function getMinimumNodeFee() {
            var _this2 = this;

            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getMinimumNodeFee().call();
            }).then(function (value) {
                return parseFloat(_this2.web3.utils.fromWei(value, 'ether'));
            });
        }
    }, {
        key: 'getTargetNodeFee',
        value: function getTargetNodeFee() {
            var _this3 = this;

            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getTargetNodeFee().call();
            }).then(function (value) {
                return parseFloat(_this3.web3.utils.fromWei(value, 'ether'));
            });
        }
    }, {
        key: 'getMaximumNodeFee',
        value: function getMaximumNodeFee() {
            var _this4 = this;

            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getMaximumNodeFee().call();
            }).then(function (value) {
                return parseFloat(_this4.web3.utils.fromWei(value, 'ether'));
            });
        }
        // The range of node demand values in wei to base fee calculations on (from negative to positive value)

    }, {
        key: 'getNodeFeeDemandRange',
        value: function getNodeFeeDemandRange() {
            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getNodeFeeDemandRange().call();
            });
        }
        // The target rETH collateralization rate

    }, {
        key: 'getTargetRethCollateralRate',
        value: function getTargetRethCollateralRate() {
            var _this5 = this;

            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getTargetRethCollateralRate().call();
            }).then(function (value) {
                return parseFloat(_this5.web3.utils.fromWei(value, 'ether'));
            });
        }
        // The rETH deposit delay setting

    }, {
        key: 'getRethDespositDelay',
        value: function getRethDespositDelay() {
            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getRethDepositDelay().call();
            }).then(function (value) {
                return parseFloat(value);
            });
        }
    }, {
        key: 'rocketDAOProtocolSettingsNetwork',
        get: function get() {
            return this.contracts.get('rocketDAOProtocolSettingsNetwork');
        }
    }]);

    return NetworkSettings;
}();
// Exports


exports.default = NetworkSettings;
//# sourceMappingURL=network.js.map