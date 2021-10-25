"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Network Settings Manager
 */
var NetworkSettings = function () {
    /**
     * Create a new Network Settings instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function NetworkSettings(web3, contracts) {
        _classCallCheck(this, NetworkSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsNetwork contract
     */


    _createClass(NetworkSettings, [{
        key: "getNodeConsensusThreshold",

        /**
         * Return the threshold of trusted nodes that must reach consensus on oracle data to commit it
         * @returns a Promise<number\> that resolves to a number representing the threshold of trusted nodes that must reach consensus on oracle daa to commit it
         *
         * @example using Typescript
         * ```ts
         * const nodeConsensusThreshold = rp.settings.network.getNodeConsensusThreshold().then((val: number) => { val };
         * ```
         */
        value: function getNodeConsensusThreshold() {
            var _this = this;

            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getNodeConsensusThreshold().call();
            }).then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, "ether"));
            });
        }
        /**
         * Return if balance submissions are enabled
         * @returns a Promise<boolean\> that resolves to a boolean representing the threshold of trusted nodes that must reach consensus on oracle daa to commit it
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.network.getSubmitBalancesEnabled().then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getSubmitBalancesEnabled",
        value: function getSubmitBalancesEnabled() {
            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getSubmitBalancesEnabled().call();
            });
        }
        /**
         * Return the frequency in blocks at which network balances should be submitted by trusted nodes
         * @returns a Promise<number\> that resolves to a number representing the frequency in blocks at which network balances should be submitted by trusted nodes
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.network.getSubmitBalancesFrequency().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getSubmitBalancesFrequency",
        value: function getSubmitBalancesFrequency() {
            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getSubmitBalancesFrequency().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        /**
         * Return the minimum node fee
         * @returns a Promise<number\> that resolves to a number representing the minimum node fee
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.network.getMinimumNodeFee().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getMinimumNodeFee",
        value: function getMinimumNodeFee() {
            var _this2 = this;

            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getMinimumNodeFee().call();
            }).then(function (value) {
                return parseFloat(_this2.web3.utils.fromWei(value, "ether"));
            });
        }
        /**
         * Return the target node fee
         * @returns a Promise<number\> that resolves to a number representing the target node fee
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.network.getTargetNodeFee().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getTargetNodeFee",
        value: function getTargetNodeFee() {
            var _this3 = this;

            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getTargetNodeFee().call();
            }).then(function (value) {
                return parseFloat(_this3.web3.utils.fromWei(value, "ether"));
            });
        }
        /**
         * Return the maximum node fee
         * @returns a Promise<number\> that resolves to a number representing the maximum node fee
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.network.getMaximumNodeFee().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getMaximumNodeFee",
        value: function getMaximumNodeFee() {
            var _this4 = this;

            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getMaximumNodeFee().call();
            }).then(function (value) {
                return parseFloat(_this4.web3.utils.fromWei(value, "ether"));
            });
        }
        /**
         * Return the range of node demand values in Wei to base fee calculations on (from negative to positive value)
         * @returns a Promise<string\> that resolves to a string representing the range of node demand values in Wei
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.network.getNodeFeeDemandRange().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeFeeDemandRange",
        value: function getNodeFeeDemandRange() {
            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getNodeFeeDemandRange().call();
            });
        }
        /**
         * Return the target rETH collateralization rate
         * @returns a Promise<number\> that resolves to a number representing the target rETH collateralization rate
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.network.getTargetRethCollateralRate().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getTargetRethCollateralRate",
        value: function getTargetRethCollateralRate() {
            var _this5 = this;

            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getTargetRethCollateralRate().call();
            }).then(function (value) {
                return parseFloat(_this5.web3.utils.fromWei(value, "ether"));
            });
        }
        /**
         * Return the rETH deposit delay setting
         * @returns a Promise<number\> that resolves to a number representing the rETH deposit delay setting
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.network.getRethDespositDelay().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getRethDespositDelay",
        value: function getRethDespositDelay() {
            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getRethDepositDelay().call();
            }).then(function (value) {
                return parseFloat(value);
            });
        }
    }, {
        key: "rocketDAOProtocolSettingsNetwork",
        get: function get() {
            return this.contracts.get("rocketDAOProtocolSettingsNetwork");
        }
    }]);

    return NetworkSettings;
}();
// Exports


exports.default = NetworkSettings;
//# sourceMappingURL=network.js.map