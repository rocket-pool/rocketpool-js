'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool network manager
 */
var Network = function () {
    // Constructor
    function Network(web3, contracts) {
        _classCallCheck(this, Network);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Network, [{
        key: 'getBalancesBlock',

        /**
         * Getters
         */
        // Get the block that current network balances are set for
        value: function getBalancesBlock() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getBalancesBlock().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the current network total ETH balance in wei

    }, {
        key: 'getTotalETHBalance',
        value: function getTotalETHBalance() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getTotalETHBalance().call();
            });
        }
        // Get the current network staking ETH balance in wei

    }, {
        key: 'getStakingETHBalance',
        value: function getStakingETHBalance() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getStakingETHBalance().call();
            });
        }
        // Get the current network total rETH supply in wei

    }, {
        key: 'getTotalRETHSupply',
        value: function getTotalRETHSupply() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getTotalRETHSupply().call();
            });
        }
        // Get the current network ETH utilization rate

    }, {
        key: 'getETHUtilizationRate',
        value: function getETHUtilizationRate() {
            var _this = this;

            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getETHUtilizationRate().call();
            }).then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get the current network node demand in wei

    }, {
        key: 'getNodeDemand',
        value: function getNodeDemand() {
            return this.rocketNetworkFees.then(function (rocketNetworkFees) {
                return rocketNetworkFees.methods.getNodeDemand().call();
            });
        }
        // Get the current network node commission rate

    }, {
        key: 'getNodeFee',
        value: function getNodeFee() {
            var _this2 = this;

            return this.rocketNetworkFees.then(function (rocketNetworkFees) {
                return rocketNetworkFees.methods.getNodeFee().call();
            }).then(function (value) {
                return parseFloat(_this2.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get the network node commission rate by demand value

    }, {
        key: 'getNodeFeeByDemand',
        value: function getNodeFeeByDemand(demand) {
            var _this3 = this;

            return this.rocketNetworkFees.then(function (rocketNetworkFees) {
                return rocketNetworkFees.methods.getNodeFeeByDemand(demand).call();
            }).then(function (value) {
                return parseFloat(_this3.web3.utils.fromWei(value, 'ether'));
            });
        }
    }, {
        key: 'rocketNetworkBalances',
        get: function get() {
            return this.contracts.get('rocketNetworkBalances');
        }
    }, {
        key: 'rocketNetworkFees',
        get: function get() {
            return this.contracts.get('rocketNetworkFees');
        }
    }]);

    return Network;
}();
// Exports


exports.default = Network;
//# sourceMappingURL=network.js.map