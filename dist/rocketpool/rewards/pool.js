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
    /**
     * Create a new Pool instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function Pool(web3, contracts) {
        _classCallCheck(this, Pool);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketRewardsPool contract
     */


    _createClass(Pool, [{
        key: "getClaimIntervalsPassed",

        /**
         * Get claim intervals passed
         * @returns a Promise<number\> that resolves to a number representing the claim intervals passed
         *
         * @example using Typescript
         * ```ts
         * const claimIntervalsPassed = rp.rewards.pool.getClaimIntervalsPassed().then((val: number) => { val };
         * ```
         */
        value: function getClaimIntervalsPassed() {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimIntervalsPassed().call();
            });
        }
        /**
         * Get the claim intervals start time
         * @returns a Promise<number\> that resolves to a number representing the claim intervals start time
         *
         * @example using Typescript
         * ```ts
         * const claimIntervalTimeStart = rp.rewards.pool.getClaimIntervalTimeStart().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getClaimIntervalTimeStart",
        value: function getClaimIntervalTimeStart() {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimIntervalTimeStart().call();
            });
        }
        /**
         * Get the rpl balance
         * @returns a Promise<string\> that resolves to a string representing the claim RPL balance in Wei
         *
         * @example using Typescript
         * ```ts
         * const rplBalance = rp.rewards.pool.getRPLBalance().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getRPLBalance",
        value: function getRPLBalance() {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getRPLBalance().call();
            });
        }
        /**
         * Get the claiming contract percentage
         * @params contract a string representing the contract address
         * @returns a Promise<string\> that resolves to a string representing the claiming contract percentage
         *
         * @example using Typescript
         * ```ts
         * const contract = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const claimingContractPercentage = rp.rewards.pool.getClaimingContractPerc(contract).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getClaimingContractPerc",
        value: function getClaimingContractPerc(contract) {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimingContractPerc(contract).call();
            });
        }
        /**
         * Get the claiming contract allowance
         * @params contract a string representing the contract address
         * @returns a Promise<string\> that resolves to a string representing the claiming contract allowance
         *
         * @example using Typescript
         * ```ts
         * const contract = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const claimingContractAllowance = rp.rewards.pool.getClaimingContractAllowance(contract).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getClaimingContractAllowance",
        value: function getClaimingContractAllowance(contract) {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimingContractAllowance(contract).call();
            });
        }
        /**
         * Get the claiming contract total claimed
         * @params contract a string representing the contract address
         * @returns a Promise<string\> that resolves to a string representing the claiming contract total claimed
         *
         * @example using Typescript
         * ```ts
         * const contract = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const claimingContractTotalClaimed = rp.rewards.pool.getClaimingContractTotalClaimed(contract).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getClaimingContractTotalClaimed",
        value: function getClaimingContractTotalClaimed(contract) {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimingContractTotalClaimed(contract).call();
            });
        }
        /**
         * Get the claim interval rewards total
         * @returns a Promise<string\> that resolves to a string representing the claiming interval rewards total
         *
         * @example using Typescript
         * ```ts
         * const claimIntervalRewardsTotal = rp.rewards.pool.getClaimIntervalRewardsTotal().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getClaimIntervalRewardsTotal",
        value: function getClaimIntervalRewardsTotal() {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimIntervalRewardsTotal().call();
            });
        }
        /**
         * Get the claim contract registered time
         * @params contractAddress a string representing the contract address
         * @params trustedNodeAddress a string representing a trusted node address
         * @returns a Promise<string\> that resolves to a string representing the claim contract registered block
         *
         * @example using Typescript
         * ```ts
         * const contractAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const trustedNodeAddress = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const claimContractRegisteredTime = rp.rewards.pool.getClaimContractRegisteredTime(contractAddress, trustedNodeAddress).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getClaimContractRegisteredTime",
        value: function getClaimContractRegisteredTime(contractAddress, trustedNodeAddress) {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimContractRegisteredTime(contractAddress, trustedNodeAddress).call();
            });
        }
        /**
         * Get the number of claimers for the current interval per claiming contract
         * @params contract a string representing the contract address
         * @returns a Promise<string\> that resolves to a string representing the claim contract registered block
         *
         * @example using Typescript
         * ```ts
         * const contract = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const claimingContractTotalClaimed = rp.rewards.pool.getClaimingContractUserTotalCurrent(contract).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getClaimingContractUserTotalCurrent",
        value: function getClaimingContractUserTotalCurrent(contract) {
            return this.rocketRewardsPool.then(function (rocketRewardsPool) {
                return rocketRewardsPool.methods.getClaimingContractUserTotalCurrent(contract).call();
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