"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Node Settings Manager
 */
var NodeSettings = function () {
    /**
     * Create a new Node Settings instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function NodeSettings(web3, contracts) {
        _classCallCheck(this, NodeSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsNode contract
     */


    _createClass(NodeSettings, [{
        key: "getRegistrationEnabled",

        /**
         * Return if node registrations are currently enabled
         * @returns a Promise<boolean\> that resolves to a boolean representing if node registrations are enabled
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.node.getRegistrationEnabled().then((val: boolean) => { val };
         * ```
         */
        value: function getRegistrationEnabled() {
            return this.rocketDAOProtocolSettingsNode.then(function (rocketDAOProtocolSettingsNode) {
                return rocketDAOProtocolSettingsNode.methods.getRegistrationEnabled().call();
            });
        }
        /**
         * Return if node deposits are currently enabled
         * @returns a Promise<boolean\> that resolves to a boolean representing if node deposits are enabled
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.settings.node.getDepositEnabled().then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getDepositEnabled",
        value: function getDepositEnabled() {
            return this.rocketDAOProtocolSettingsNode.then(function (rocketDAOProtocolSettingsNode) {
                return rocketDAOProtocolSettingsNode.methods.getDepositEnabled().call();
            });
        }
    }, {
        key: "rocketDAOProtocolSettingsNode",
        get: function get() {
            return this.contracts.get("rocketDAOProtocolSettingsNode");
        }
    }]);

    return NodeSettings;
}();
// Exports


exports.default = NodeSettings;
//# sourceMappingURL=node.js.map