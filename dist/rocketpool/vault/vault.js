"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Vault
 */
var Vault = function () {
    /**
     * Create a new Vault instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function Vault(web3, contracts) {
        _classCallCheck(this, Vault);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketVault contract
     */


    _createClass(Vault, [{
        key: "getAddress",

        /**
         * Retrieve the RocketVault contract address
         * @returns a Promise<string\> that resolves to the Rocket Vault contract address
         *
         * @example using Typescript
         * ```ts
         * const rocketVault = rp.vault.getAddress().then((val: string) => { val };
         * ```
         */
        value: function getAddress() {
            return this.rocketVault.then(function (rocketVault) {
                return rocketVault.options.address;
            });
        }
        /**
         * Retrieve the balance of a token when providing a contract & token address
         * @param contractAddress A string representing the contract address
         * @param tokenAddress A string representing the token address
         * @returns a Promise<string\> that resolves to the Rocket Vault contract address
         *
         * @example using Typescript
         * ```ts
         * const rplBalance = rp.vault.balanceOfToken("rocketClaimDAO", rocketTokenRPLAddress).then((val: string) => { val }
         * ```
         */

    }, {
        key: "balanceOfToken",
        value: function balanceOfToken(contractAddress, tokenAddress) {
            return this.rocketVault.then(function (rocketVault) {
                return rocketVault.methods.balanceOfToken(contractAddress, tokenAddress).call();
            });
        }
    }, {
        key: "rocketVault",
        get: function get() {
            return this.contracts.get("rocketVault");
        }
    }]);

    return Vault;
}();
// Exports


exports.default = Vault;
//# sourceMappingURL=vault.js.map