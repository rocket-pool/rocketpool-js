"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Rewards
 */
var Pool = function () {
    // Constructor
    function Pool(web3, contracts) {
        _classCallCheck(this, Pool);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Pool, [{
        key: "getClaimIntervalsPassed",

        /**
         * Getters
         */
        // Get the claim intervals that have passed
        value: function getClaimIntervalsPassed() {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimIntervalsPassed().call();
            });
        }
        // Get the claim intervals block start

    }, {
        key: "getClaimIntervalTimeStart",
        value: function getClaimIntervalTimeStart() {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimIntervalTimeStart().call();
            });
        }
        // Get the rpl balance

    }, {
        key: "getRPLBalance",
        value: function getRPLBalance() {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getRPLBalance().call();
            });
        }
        // Get the claiming contract percentage

    }, {
        key: "getClaimingContractPerc",
        value: function getClaimingContractPerc(contract) {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimingContractPerc(contract).call();
            });
        }
        // Get the claiming contract allowance

    }, {
        key: "getClaimingContractAllowance",
        value: function getClaimingContractAllowance(contract) {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimingContractAllowance(contract).call();
            });
        }
        // Get the claiming contract total claimed

    }, {
        key: "getClaimingContractTotalClaimed",
        value: function getClaimingContractTotalClaimed(contract) {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimingContractTotalClaimed(contract).call();
            });
        }
        // Get the claim interval rewards total

    }, {
        key: "getClaimIntervalRewardsTotal",
        value: function getClaimIntervalRewardsTotal() {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimIntervalRewardsTotal().call();
            });
        }
        // Get the claim contract registered time

    }, {
        key: "getClaimContractRegisteredTime",
        value: function getClaimContractRegisteredTime(contractAddress, trustedNodeAddress) {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimContractRegisteredTime(contractAddress, trustedNodeAddress).call();
            });
        }
        // Get the claim contract registered block

    }, {
        key: "getClaimingContractUserTotalCurrent",
        value: function getClaimingContractUserTotalCurrent(address) {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimingContractUserTotalCurrent(address).call();
            });
        }
    }, {
        key: "rocketRewardsPool",
        get: function get() {
            return this.contracts.get("rocketRewardsPool");
        }
    }]);

    return Pool;
}();
// Exports


exports.default = Pool;
//# sourceMappingURL=pool.js.map