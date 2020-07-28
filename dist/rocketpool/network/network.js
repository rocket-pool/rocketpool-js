'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

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
        // Get the current withdrawal pool balance in wei

    }, {
        key: 'getWithdrawalBalance',
        value: function getWithdrawalBalance() {
            return this.rocketNetworkWithdrawal.then(function (rocketNetworkWithdrawal) {
                return rocketNetworkWithdrawal.methods.getBalance().call();
            });
        }
        // Get the current network validator withdrawal credentials

    }, {
        key: 'getWithdrawalCredentials',
        value: function getWithdrawalCredentials() {
            return this.rocketNetworkWithdrawal.then(function (rocketNetworkWithdrawal) {
                return rocketNetworkWithdrawal.methods.getWithdrawalCredentials().call();
            });
        }
        /**
         * Mutators - Restricted to trusted nodes
         */
        // Submit network balances for a block

    }, {
        key: 'submitBalances',
        value: function submitBalances(block, totalEthWei, stakingEthWei, rethSupplyWei, options, onConfirmation) {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return (0, _transaction.handleConfirmations)(rocketNetworkBalances.methods.submitBalances(block, totalEthWei, stakingEthWei, rethSupplyWei).send(options), onConfirmation);
            });
        }
        // Process a validator withdrawal from the beacon chain

    }, {
        key: 'processWithdrawal',
        value: function processWithdrawal(validatorPubkey, options, onConfirmation) {
            return this.rocketNetworkWithdrawal.then(function (rocketNetworkWithdrawal) {
                return (0, _transaction.handleConfirmations)(rocketNetworkWithdrawal.methods.processWithdrawal(validatorPubkey).send(options), onConfirmation);
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
    }, {
        key: 'rocketNetworkWithdrawal',
        get: function get() {
            return this.contracts.get('rocketNetworkWithdrawal');
        }
    }]);

    return Network;
}();
// Exports


exports.default = Network;
//# sourceMappingURL=network.js.map