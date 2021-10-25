"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../utils/transaction");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Rewards
 */
var Rewards = function () {
    /**
     * Create a new Rewards instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function Rewards(web3, contracts) {
        _classCallCheck(this, Rewards);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketClaimNode contract
     */


    _createClass(Rewards, [{
        key: "getClaimPossible",

        /**
         * Determine if the claim is possible
         * @params address a string representing the node address
         * @returns a Promise<boolean\> that resolves to a boolean representing if a claim is possible
         *
         * @example using Typescript
         * ```ts
         * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const claimPossible = rp.rewards.claimNode.getClaimPossible(address).then((val: bool) => { val };
         * ```
         */
        value: function getClaimPossible(address) {
            return this.rocketClaimNode.then(function (rocketClaimNode) {
                return rocketClaimNode.methods.getClaimPossible(address).call();
            });
        }
        /**
         * Make a node claim
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * };
         * const txReceipt = rp.rewards.claimNode(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "claim",
        value: function claim(options, onConfirmation) {
            return this.rocketClaimNode.then(function (rocketClaimNode) {
                return (0, _transaction.handleConfirmations)(rocketClaimNode.methods.claim().send(options), onConfirmation);
            });
        }
    }, {
        key: "rocketClaimNode",
        get: function get() {
            return this.contracts.get("rocketClaimNode");
        }
    }]);

    return Rewards;
}();
// Exports


exports.default = Rewards;
//# sourceMappingURL=claim-node.js.map