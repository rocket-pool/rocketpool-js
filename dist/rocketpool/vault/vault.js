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
    // Constructor
    function Vault(web3, contracts) {
        _classCallCheck(this, Vault);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Vault, [{
        key: "getAddress",

        /**
         * Getters
         */
        // Get contract address
        value: function getAddress() {
            return this.rocketVault.then(function (rocketVault) {
                return rocketVault.options.address;
            });
        }
        // Get the claim intervals that have passed

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