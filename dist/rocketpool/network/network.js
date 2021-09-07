"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../utils/transaction");

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
        key: "getBalancesBlock",

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
        key: "getTotalETHBalance",
        value: function getTotalETHBalance() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getTotalETHBalance().call();
            });
        }
        // Get the current network staking ETH balance in wei

    }, {
        key: "getStakingETHBalance",
        value: function getStakingETHBalance() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getStakingETHBalance().call();
            });
        }
        // Get the current network total rETH supply in wei

    }, {
        key: "getTotalRETHSupply",
        value: function getTotalRETHSupply() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getTotalRETHSupply().call();
            });
        }
        // Get the current network ETH utilization rate

    }, {
        key: "getETHUtilizationRate",
        value: function getETHUtilizationRate() {
            var _this = this;

            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getETHUtilizationRate().call();
            }).then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, "ether"));
            });
        }
        // Get the current network node demand in wei

    }, {
        key: "getNodeDemand",
        value: function getNodeDemand() {
            return this.rocketNetworkFees.then(function (rocketNetworkFees) {
                return rocketNetworkFees.methods.getNodeDemand().call();
            });
        }
        // Get the current network node commission rate

    }, {
        key: "getNodeFee",
        value: function getNodeFee() {
            return this.rocketNetworkFees.then(function (rocketNetworkFees) {
                return rocketNetworkFees.methods.getNodeFee().call();
            });
        }
        // Get the network node commission rate by demand value

    }, {
        key: "getNodeFeeByDemand",
        value: function getNodeFeeByDemand(demand) {
            return this.rocketNetworkFees.then(function (rocketNetworkFees) {
                return rocketNetworkFees.methods.getNodeFeeByDemand(demand).call();
            });
        }
        // Get the network RPL Price

    }, {
        key: "getRPLPrice",
        value: function getRPLPrice() {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return rocketNetworkPrices.methods.getRPLPrice().call();
            });
        }
    }, {
        key: "getPricesBlock",
        value: function getPricesBlock() {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return rocketNetworkPrices.methods.getPricesBlock().call();
            });
        }
    }, {
        key: "getLatestReportableBlock",
        value: function getLatestReportableBlock() {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return rocketNetworkPrices.methods.getLatestReportableBlock().call();
            });
        }
    }, {
        key: "getEffectiveRPLStake",
        value: function getEffectiveRPLStake() {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return rocketNetworkPrices.methods.getEffectiveRPLStake().call();
            });
        }
    }, {
        key: "getEffectiveRPLStakeUpdatedBlock",
        value: function getEffectiveRPLStakeUpdatedBlock() {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return rocketNetworkPrices.methods.getEffectiveRPLStakeUpdatedBlock().call();
            });
        }
        /**
         * Mutators - Restricted to trusted nodes
         */
        // Submit network balances

    }, {
        key: "submitBalances",
        value: function submitBalances(block, totalEth, stakingEth, rethSupply, options, onConfirmation) {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return (0, _transaction.handleConfirmations)(rocketNetworkBalances.methods.submitBalances(block, totalEth, stakingEth, rethSupply).send(options), onConfirmation);
            });
        }
        // Submit network prices

    }, {
        key: "submitPrices",
        value: function submitPrices(block, rplPrice, effectiveRplStake, options, onConfirmation) {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return (0, _transaction.handleConfirmations)(rocketNetworkPrices.methods.submitPrices(block, rplPrice, effectiveRplStake).send(options), onConfirmation);
            });
        }
        // Execute update prices

    }, {
        key: "executeUpdatePrices",
        value: function executeUpdatePrices(block, rplPrice, effectiveRplStake, options, onConfirmation) {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return (0, _transaction.handleConfirmations)(rocketNetworkPrices.methods.executeUpdatePrices(block, rplPrice, effectiveRplStake).send(options), onConfirmation);
            });
        }
        // Execute update balances

    }, {
        key: "executeUpdateBalances",
        value: function executeUpdateBalances(block, totalEth, stakingEth, rethSupply, options, onConfirmation) {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return (0, _transaction.handleConfirmations)(rocketNetworkBalances.methods.executeUpdateBalances(block, totalEth, stakingEth, rethSupply).send(options), onConfirmation);
            });
        }
    }, {
        key: "rocketNetworkBalances",
        get: function get() {
            return this.contracts.get("rocketNetworkBalances");
        }
    }, {
        key: "rocketNetworkFees",
        get: function get() {
            return this.contracts.get("rocketNetworkFees");
        }
    }, {
        key: "rocketNetworkPrices",
        get: function get() {
            return this.contracts.get("rocketNetworkPrices");
        }
    }]);

    return Network;
}();
// Exports


exports.default = Network;
//# sourceMappingURL=network.js.map