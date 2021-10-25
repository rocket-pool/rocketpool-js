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
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketClaimTrustedNode contract
     */


    _createClass(Rewards, [{
        key: "getClaimRewardsAmount",

        /**
         * Get claim rewards amount
         * @params address a string representing the node address
         * @returns a Promise<string\> that resolves to a string representing the claim rewards amount in Wei
         *
         * @example using Typescript
         * ```ts
         * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const claimPossible = rp.rewards.claimTrustedNode.getClaimRewardsAmount(address).then((val: string) => { val };
         * ```
         */
        value: function getClaimRewardsAmount(address) {
            return this.rocketClaimTrustedNode.then(function (rocketClaimTrustedNode) {
                return rocketClaimTrustedNode.methods.getClaimRewardsAmount(address).call();
            });
        }
        /**
         * Claim from a trusted node
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const trustedNode = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const options = {
         *		from: trustedNode,
         *		gas: 1000000
         * };
         * const txReceipt = rp.rewards.claimTrustedNode(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "claim",
        value: function claim(options, onConfirmation) {
            return this.rocketClaimTrustedNode.then(function (rocketClaimTrustedNode) {
                return (0, _transaction.handleConfirmations)(rocketClaimTrustedNode.methods.claim().send(options), onConfirmation);
            });
        }
    }, {
        key: "rocketClaimTrustedNode",
        get: function get() {
            return this.contracts.get("rocketClaimTrustedNode");
        }
    }]);

    return Rewards;
}();
// Exports


exports.default = Rewards;
//# sourceMappingURL=claim-trusted-node.js.map