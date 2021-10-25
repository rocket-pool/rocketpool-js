"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../utils/transaction");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Network Manager
 */
var Network = function () {
    /**
     * Create a new Network instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function Network(web3, contracts) {
        _classCallCheck(this, Network);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNetworkBalances contract
     */


    _createClass(Network, [{
        key: "getBalancesBlock",

        /**
         * Get the block that current network balances are set for
         * @returns a Promise<number\> that resolves to a number representing the block that the current network balances are
         * set for
         *
         * @example using Typescript
         * ```ts
         * const block = rp.network.getBalancesBlock().then((val: number) => { val };
         * ```
         */
        value: function getBalancesBlock() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getBalancesBlock().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        /**
         * Get the current network total ETH balance in Wei
         * @returns a Promise<string\> that resolves to a string representing the current network total ETH balance in Wei
         *
         * @example using Typescript
         * ```ts
         * const balanceInWei = rp.network.getTotalETHBalance().then((val: string) => { val };
         * // convert to Ether if needed
         * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
         * ```
         */

    }, {
        key: "getTotalETHBalance",
        value: function getTotalETHBalance() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getTotalETHBalance().call();
            });
        }
        /**
         * Get the current network staking ETH balance in Wei
         * @returns a Promise<string\> that resolves to a string representing the current network staking ETH balance in Wei
         *
         * @example using Typescript
         * ```ts
         * const balanceInWei = rp.network.getStakingETHBalance().then((val: string) => { val };
         * // convert to Ether if needed
         * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
         * ```
         */

    }, {
        key: "getStakingETHBalance",
        value: function getStakingETHBalance() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getStakingETHBalance().call();
            });
        }
        /**
         * Get the current network total rETH supply in Wei
         * @returns a Promise<string\> that resolves to a string representing the rETH supply in Wei
         *
         * @example using Typescript
         * ```ts
         * const balanceInWei = rp.network.getTotalRETHSupply().then((val: string) => { val };
         * // convert to Ether if needed
         * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
         * ```
         */

    }, {
        key: "getTotalRETHSupply",
        value: function getTotalRETHSupply() {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return rocketNetworkBalances.methods.getTotalRETHSupply().call();
            });
        }
        /**
         * Get the current network ETH utilization rate
         * @returns a Promise<string\> that resolves to a string representing the ETH utilization rate in ETH (automatically
         * parsed from Wei)
         *
         * @example using Typescript
         * ```ts
         * const utilizationRate = rp.network.getETHUtilizationRate().then((val: string) => { val };
         * ```
         */

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
        /**
         * Get the current network node demand in Wei
         * @returns a Promise<string\> that resolves to a string representing the current node demand in Wei
         *
         * @example using Typescript
         * ```ts
         * const balanceInWei = rp.network.getNodeDemand().then((val: string) => { val };
         * // convert to Ether if needed
         * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
         * ```
         */

    }, {
        key: "getNodeDemand",
        value: function getNodeDemand() {
            return this.rocketNetworkFees.then(function (rocketNetworkFees) {
                return rocketNetworkFees.methods.getNodeDemand().call();
            });
        }
        /**
         * Get the current network node demand
         * @returns a Promise<string\> that resolves to a number representing the current node fee
         *
         * @example using Typescript
         * ```ts
         * const nodeFee = rp.network.getNodeFee().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getNodeFee",
        value: function getNodeFee() {
            return this.rocketNetworkFees.then(function (rocketNetworkFees) {
                return rocketNetworkFees.methods.getNodeFee().call();
            });
        }
        /**
         * Get the network node commission rate by demand value
         * @param demand A string representing the demand
         * @returns a Promise<number\> that resolves to a number representing the network node commission rate by demand value
         *
         * @example using Typescript
         * ```ts
         * const demand = web3.utils.toWei("0.75", "ether");
         * const nodeFeeByDemand = rp.network.getNodeFeeByDemand(demand).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeFeeByDemand",
        value: function getNodeFeeByDemand(demand) {
            return this.rocketNetworkFees.then(function (rocketNetworkFees) {
                return rocketNetworkFees.methods.getNodeFeeByDemand(demand).call();
            });
        }
        /**
         * Get the network RPL Price
         * @returns a Promise<number\> that resolves to a number representing the network RPL price
         *
         * @example using Typescript
         * ```ts
         * const rplPrice = rp.network.getRPLPrice().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getRPLPrice",
        value: function getRPLPrice() {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return rocketNetworkPrices.methods.getRPLPrice().call();
            });
        }
        /**
         * Get the prices block
         * @returns a Promise<number\> that resolves to a number representing the prices block
         *
         * @example using Typescript
         * ```ts
         * const block = rp.network.getPricesBlock().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getPricesBlock",
        value: function getPricesBlock() {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return rocketNetworkPrices.methods.getPricesBlock().call();
            });
        }
        /**
         * Get latest reportable block
         * @returns a Promise<string\> that resolves to a string representing the latest reportable block
         *
         * @example using Typescript
         * ```ts
         * const latestReportableBlock = rp.network.getLatestReportableBlock().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getLatestReportableBlock",
        value: function getLatestReportableBlock() {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return rocketNetworkPrices.methods.getLatestReportableBlock().call();
            });
        }
        /**
         * Get effective RPL stake
         * @returns a Promise<string\> that resolves to a string representing the effective RPL stake
         *
         * @example using Typescript
         * ```ts
         * const effectiveRPLStake = rp.network.getEffectiveRPLStake().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getEffectiveRPLStake",
        value: function getEffectiveRPLStake() {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return rocketNetworkPrices.methods.getEffectiveRPLStake().call();
            });
        }
        /**
         * Get the block that the effective RPL stake was updated at
         * @returns a Promise<string\> that resolves to a string representing the block the effective RPL stake was updated at
         *
         * @example using Typescript
         * ```ts
         * const block = rp.network.getEffectiveRPLStakeUpdatedBlock().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getEffectiveRPLStakeUpdatedBlock",
        value: function getEffectiveRPLStakeUpdatedBlock() {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return rocketNetworkPrices.methods.getEffectiveRPLStakeUpdatedBlock().call();
            });
        }
        /**
         * Submit node balances (Restricted to oDAO nodes)
         * @param block A string representing the block
         * @param totalEth A string representing the totalEth in Wei
         * @param stakingEth A string representing the stakingEth in Wei
         * @param rethSupply A string representing the rethSupply in Wei
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const block = await web3.eth.getBlockNumber();
         * const totalEth = web3.utils.toWei("1", "ether");
         * const stakingEth = "0";
         * const rethSupply = rp.network.getTotalRETHSupply().then((val: string) => { val };
         * const trustedNode = "0x18A58E43c37DdC9ccCf3AC642c6f430ad663E400"; // must be an oDAO member
         *
         * const options = {
         *		from: trustedNode,
         *		gas: 1000000
         * }
         * const txReceipt = rp.network.submitBalances(block, totalEth, stakingEth, rethSupply, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "submitBalances",
        value: function submitBalances(block, totalEth, stakingEth, rethSupply, options, onConfirmation) {
            return this.rocketNetworkBalances.then(function (rocketNetworkBalances) {
                return (0, _transaction.handleConfirmations)(rocketNetworkBalances.methods.submitBalances(block, totalEth, stakingEth, rethSupply).send(options), onConfirmation);
            });
        }
        /**
         * Submit prices (Restricted to oDAO nodes)
         * @param block A string representing the block
         * @param rplPrice A string representing the rplPrice in Wei
         * @param effectiveRplStake A string representing the effective RPL stake
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const block = await web3.eth.getBlockNumber();
         * const rplPrice = web3.utils.toWei("1", "ether");
         * const effectiveRPLStake = rp.node.calculateTotalEffectiveRPLStake(0, 0, rplPrice).then((val: string) => { val };
         * const trustedNode = "0x18A58E43c37DdC9ccCf3AC642c6f430ad663E400"; // must be an oDAO member
         *
         * const options = {
         *		from: trustedNode,
         *		gas: 1000000
         * }
         * const txReceipt = rp.network.submitPrices(block, rplPrice, effectiveRplStake, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "submitPrices",
        value: function submitPrices(block, rplPrice, effectiveRplStake, options, onConfirmation) {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return (0, _transaction.handleConfirmations)(rocketNetworkPrices.methods.submitPrices(block, rplPrice, effectiveRplStake).send(options), onConfirmation);
            });
        }
        /**
         * Execute prices (Restricted to oDAO nodes)
         * @param block A string representing the block
         * @param rplPrice A string representing the rplPrice in Wei
         * @param effectiveRplStake A string representing the effective RPL stake
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const block = await web3.eth.getBlockNumber();
         * const rplPrice = web3.utils.toWei("1", "ether");
         * const effectiveRPLStake = rp.node.calculateTotalEffectiveRPLStake(0, 0, rplPrice).then((val: string) => { val };
         * const trustedNode = "0x18A58E43c37DdC9ccCf3AC642c6f430ad663E400"; // must be an oDAO member
         *
         * const options = {
         *		from: trustedNode,
         *		gas: 1000000
         * }
         * const txReceipt = rp.network.executeUpdatePrices(block, rplPrice, effectiveRplStake, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "executeUpdatePrices",
        value: function executeUpdatePrices(block, rplPrice, effectiveRplStake, options, onConfirmation) {
            return this.rocketNetworkPrices.then(function (rocketNetworkPrices) {
                return (0, _transaction.handleConfirmations)(rocketNetworkPrices.methods.executeUpdatePrices(block, rplPrice, effectiveRplStake).send(options), onConfirmation);
            });
        }
        /**
         * Execute Update Balances (Restricted to oDAO nodes)
         * @param block A string representing the block
         * @param totalEth A string representing the totalEth in Wei
         * @param stakingEth A string representing the stakingEth in Wei
         * @param rethSupply A string representing the rethSupply in Wei
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const block = await web3.eth.getBlockNumber();
         * const totalEth = web3.utils.toWei("1", "ether");
         * const stakingEth = "0";
         * const rethSupply = rp.network.getTotalRETHSupply().then((val: string) => { val };
         * const trustedNode = "0x18A58E43c37DdC9ccCf3AC642c6f430ad663E400"; // must be an oDAO member
         *
         * const options = {
         *		from: trustedNode,
         *		gas: 1000000
         * }
         * const txReceipt = rp.network.executeUpdateBalances(block, totalEth, stakingEth, rethSupply, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

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
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNetworkFees contract
         */

    }, {
        key: "rocketNetworkFees",
        get: function get() {
            return this.contracts.get("rocketNetworkFees");
        }
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNetworkPrices contract
         */

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