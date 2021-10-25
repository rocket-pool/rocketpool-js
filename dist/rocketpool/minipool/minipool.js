"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../utils/transaction");

var _minipoolContract = require("./minipool-contract");

var _minipoolContract2 = _interopRequireDefault(_minipoolContract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Minipool Manager
 */
var Minipool = function () {
    /**
     * Create a new Minipool instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool Contract Manager Instance
     */
    function Minipool(web3, contracts) {
        _classCallCheck(this, Minipool);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketMinipoolManager contract
     */


    _createClass(Minipool, [{
        key: "getMinipools",

        /**
         * Get all minipool details
         * @returns a Promise<MinipoolDetails[]\> that resolves to an array of MinipoolDetails (address, exists, pubkey)
         *
         * @example using Typescript
         * ```ts
         * const minipools = rp.minipool.getMinipools().then((val: MinipoolDetails[]) => { val };
         * ```
         */
        value: function getMinipools() {
            var _this = this;

            return this.getMinipoolAddresses().then(function (addresses) {
                return Promise.all(addresses.map(function (address) {
                    return _this.getMinipoolDetails(address);
                }));
            });
        }
        /**
         * Get all minipool addresses
         * @returns a Promise<string[]\> that resolves to an array of minipool addresses as strings
         *
         * @example using Typescript
         * ```ts
         * const addresses = rp.minipool.getMinipoolAddresses().then((val: string[]) => { val };
         * ```
         */

    }, {
        key: "getMinipoolAddresses",
        value: function getMinipoolAddresses() {
            var _this2 = this;

            return this.getMinipoolCount().then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (index) {
                    return _this2.getMinipoolAt(index);
                }));
            });
        }
        /**
         * Get all node's minipool details
         * @params nodeAddress a string representing the node address you which to return details for
         * @returns a Promise<MinipoolDetails[]\> that resolves to an array of MinipoolDetails about a specific node
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const details = rp.minipool.getNodeMinipools(nodeAddress).then((val: MinipoolDetails[]) => { val };
         * ```
         */

    }, {
        key: "getNodeMinipools",
        value: function getNodeMinipools(nodeAddress) {
            var _this3 = this;

            return this.getNodeMinipoolAddresses(nodeAddress).then(function (addresses) {
                return Promise.all(addresses.map(function (address) {
                    return _this3.getMinipoolDetails(address);
                }));
            });
        }
        /**
         * Get all node's minipool addresses
         * @params nodeAddress a string representing the node address you which to return details for
         * @returns a Promise<string[]\> that resolves to an array of strings containing the minipool addresses
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const minipoolAddresses = rp.minipool.getNodeMinipoolAddresses(nodeAddress).then((val: string[]) => { val };
         * ```
         */

    }, {
        key: "getNodeMinipoolAddresses",
        value: function getNodeMinipoolAddresses(nodeAddress) {
            var _this4 = this;

            return this.getNodeMinipoolCount(nodeAddress).then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (index) {
                    return _this4.getNodeMinipoolAt(nodeAddress, index);
                }));
            });
        }
        /**
         * Get all minipool's details
         * @params nodeAddress a string representing the node address you which to return details for
         * @returns a Promise<MinipoolDetails\> that resolves to a singular MinipoolDetails with details about the minipool you want to look up
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const minipoolDetails = rp.minipool.getMinipoolDetails(nodeAddress).then((val: MinipoolDetails) => { val };
         * ```
         */

    }, {
        key: "getMinipoolDetails",
        value: function getMinipoolDetails(address) {
            return Promise.all([this.getMinipoolExists(address), this.getMinipoolPubkey(address)]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    exists = _ref2[0],
                    pubkey = _ref2[1];

                return {
                    address: address,
                    exists: exists,
                    pubkey: pubkey
                };
            });
        }
        /**
         * Get all the total minipool count
         * @returns a Promise<number\> that resolves to a number representing the total minipool count
         *
         * @example using Typescript
         * ```ts
         * const totalMinipools = rp.minipool.getMinipoolCount().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getMinipoolCount",
        value: function getMinipoolCount() {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolCount().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        /**
         * Get a minipool address by index
         * @params index a number representing the index of the minipool you wish to lookup
         * @returns a Promise<string\> that resolves to a string representing the minipool address
         *
         * @example using Typescript
         * ```ts
         * const index = 5;
         * const address = rp.minipool.getMinipoolAt(index).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getMinipoolAt",
        value: function getMinipoolAt(index) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolAt(index).call();
            });
        }
        /**
         * Get a node's total minipool count
         * @params nodeAddress a string representing the node address you which to return details for
         * @returns a Promise<number\> that resolves to a number representing the node's total minipool count
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const nodeMinipoolCount = rp.minipool.getNodeMinipoolCount(nodeAddress).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getNodeMinipoolCount",
        value: function getNodeMinipoolCount(nodeAddress) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getNodeMinipoolCount(nodeAddress).call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        /**
         * Get the staking minipool count
         * @returns a Promise<number\> that resolves to a number representing the total staking minipool count
         *
         * @example using Typescript
         * ```ts
         * const stakingMinipoolCount = rp.minipool.getStakingMinipoolCount().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getStakingMinipoolCount",
        value: function getStakingMinipoolCount() {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getStakingMinipoolCount().call();
            });
        }
        /**
         * Get the node's staking minipool count
         * @params nodeAddress a string representing the node address you which to return details for
         * @returns a Promise<number\> that resolves to a number representing the node's staking minipool count
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const nodeStakingMinipoolCount = rp.minipool.getNodeStakingMinipoolCount(nodeAddress).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getNodeStakingMinipoolCount",
        value: function getNodeStakingMinipoolCount(nodeAddress) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getNodeStakingMinipoolCount(nodeAddress).call();
            });
        }
        /**
         * Get the node's active minipool count
         * @params nodeAddress a string representing the node address you which to return details for
         * @returns a Promise<number\> that resolves to a number representing the node's active minipool count
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const nodeActiveMinipoolCount = rp.minipool.getNodeActiveMinipoolCount(nodeAddress).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getNodeActiveMinipoolCount",
        value: function getNodeActiveMinipoolCount(nodeAddress) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getNodeActiveMinipoolCount(nodeAddress).call();
            });
        }
        /**
         * Get the node's minipool address by index
         * @params nodeAddress a string representing the node address you which to return details for
         * @params index a number representing the index of
         * @returns a Promise<string\> that resolves to a string representing the minipool address at the desired index
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const index = 2;
         * const address = rp.minipool.getNodeMinipoolAt(nodeAddress, index).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeMinipoolAt",
        value: function getNodeMinipoolAt(nodeAddress, index) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getNodeMinipoolAt(nodeAddress, index).call();
            });
        }
        /**
         * Get a minipool address by validator pubkey
         * @params validatorPubkey a string representing the validator pub key
         * @returns a Promise<string\> that resolves to a string representing the minipool address at the desired pubkey
         *
         * @example using Typescript
         * ```ts
         * const validatorPubkey = "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003";
         * const address = rp.minipool.getMinipoolByPubkey(nodeAddress).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getMinipoolByPubkey",
        value: function getMinipoolByPubkey(validatorPubkey) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolByPubkey(validatorPubkey).call();
            });
        }
        /**
         * Check whether a minipool exists
         * @params address a string representing the minipool address you to check against
         * @returns a Promise<boolean\> that resolves to a boolean representing if a minipool exists at the address
         *
         * @example using Typescript
         * ```ts
         * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const exists = rp.minipool.getMinipoolExists(nodeAddress).then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getMinipoolExists",
        value: function getMinipoolExists(address) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolExists(address).call();
            });
        }
        /**
         * Get a minipool's validator pubkey
         * @params address a string representing the minipool address
         * @returns a Promise<string\> that resolves to a string representing the pubkey for the provided minipool address
         *
         * @example using Typescript
         * ```ts
         * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const address = rp.minipool.getMinipoolPubkey(nodeAddress).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getMinipoolPubkey",
        value: function getMinipoolPubkey(address) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolPubkey(address).call();
            });
        }
        /**
         * Get a minipool's withdrawal credentials
         * @params address a string representing the minipool address
         * @returns a Promise<string\> that resolves to a string representing the minipool credentials
         *
         * @example using Typescript
         * ```ts
         * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const address = rp.minipool.getMinipoolWithdrawalCredentials(nodeAddress).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getMinipoolWithdrawalCredentials",
        value: function getMinipoolWithdrawalCredentials(address) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolWithdrawalCredentials(address).call();
            });
        }
        /**
         * Get the minipool queue length
         * @params depositType a number representing the deposit type
         * @returns a Promise<number\> that resolves to a number representing the minipool queue length
         *
         * @example using Typescript
         * ```ts
         * const length = rp.minipool.getQueueLength(1).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getQueueLength",
        value: function getQueueLength(depositType) {
            return this.rocketMinipoolQueue.then(function (rocketMinipoolQueue) {
                return rocketMinipoolQueue.methods.getLength(depositType).call();
            });
        }
        /**
         * Get the total minipool queue length
         * @returns a Promise<number\> that resolves to a number representing the total minipool queue length
         *
         * @example using Typescript
         * ```ts
         * const totalLength = rp.minipool.getQueueTotalLength().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getQueueTotalLength",
        value: function getQueueTotalLength() {
            return this.rocketMinipoolQueue.then(function (rocketMinipoolQueue) {
                return rocketMinipoolQueue.methods.getTotalLength().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        /**
         * Get the total capacity of queued minipools in Wei
         * @returns a Promise<string\> that resolves to a number representing the total capacity of queued minipools in Wei
         *
         * @example using Typescript
         * ```ts
         * const totalLength = rp.minipool.getQueueTotalCapacity().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getQueueTotalCapacity",
        value: function getQueueTotalCapacity() {
            return this.rocketMinipoolQueue.then(function (rocketMinipoolQueue) {
                return rocketMinipoolQueue.methods.getTotalCapacity().call();
            });
        }
        /**
         * Get the effective capacity of queued minipools in Wei (used in node demand calculations)
         * @returns a Promise<string\> that resolves to a number representing the effective capacity of queued minipools in Wei
         *
         * @example using Typescript
         * ```ts
         * const queueEffectiveCapacity = rp.minipool.getQueueEffectiveCapacity().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getQueueEffectiveCapacity",
        value: function getQueueEffectiveCapacity() {
            return this.rocketMinipoolQueue.then(function (rocketMinipoolQueue) {
                return rocketMinipoolQueue.methods.getEffectiveCapacity().call();
            });
        }
        /**
         * Get the capacity of the next available minipool in Wei
         * @returns a Promise<string\> that resolves to a number representing the capacity of the next available minipool in Wei
         *
         * @example using Typescript
         * ```ts
         * const queueNextCapacity = rp.minipool.getQueueNextCapacity().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getQueueNextCapacity",
        value: function getQueueNextCapacity() {
            return this.rocketMinipoolQueue.then(function (rocketMinipoolQueue) {
                return rocketMinipoolQueue.methods.getNextCapacity().call();
            });
        }
        /**
         * Get the node reward amount for a minipool by node fee, user deposit balance, and staking start & end balances
         * @params nodeFee a number representing the node fee
         * @params userBalanceString a string representing the user balance in Wei
         * @params startBalance a string representing the start balance in Wei
         * @params endBalance a sttring representing the end balance in Wei
         * @returns a Promise<string\> that resolves to a string representing the minipool node rewards amount in Wei
         *
         * @example using Typescript
         * ```ts
         * const rewardsAmount = rp.minipool.getMinipoolNodeRewardAmount(nodeFee, userDepositBalance, startBalance, endBalance).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getMinipoolNodeRewardAmount",
        value: function getMinipoolNodeRewardAmount(nodeFee, userDepositBalance, startBalance, endBalance) {
            var _this5 = this;

            return this.rocketMinipoolStatus.then(function (rocketMinipoolStatus) {
                return rocketMinipoolStatus.methods.getMinipoolNodeRewardAmount(_this5.web3.utils.toWei(nodeFee.toString(), "ether"), userDepositBalance, startBalance, endBalance).call();
            });
        }
        /**
         * Get a MinipoolContract instance
         * @params address a string representing the address of the minipool
         * @returns a Promise<MinipoolContract\> that resolves to a MinipoolContract representing the contract of the minipool
         *
         * @example using Typescript
         * ```ts
         * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const minipoolContract = rp.minipool.getMinipoolContract(address).then((val: MinipoolContract) => { val };
         * ```
         */

    }, {
        key: "getMinipoolContract",
        value: function getMinipoolContract(address) {
            var _this6 = this;

            return this.contracts.make("rocketMinipoolDelegate", address).then(function (rocketMinipool) {
                return new _minipoolContract2.default(_this6.web3, address, rocketMinipool);
            });
        }
        /**
         * Get the effective delegate
         * @params address a string representing the address of the minipool
         * @returns a Promise<string\> that resolves to the address of the effective delegate
         *
         * @example using Typescript
         * ```ts
         * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const effectiveDelegate = rp.minipool.getEffectiveDelegate(address).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getEffectiveDelegate",
        value: function getEffectiveDelegate(address) {
            return this.rocketMinipool.then(function (rocketMinipool) {
                return rocketMinipool.methods.getEffectiveDelegate(address).call();
            });
        }
        /**
         * Submit a minipool as withdrawable
         * @param minipoolAddress A string representing the address of the minipool
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const minipoolAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const trustedNode = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: trustedNode,
         *		gas: 1000000
         * };
         * const txReceipt = rp.minipool.submitWithdrawable(minipoolAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "submitMinipoolWithdrawable",
        value: function submitMinipoolWithdrawable(minipoolAddress, options, onConfirmation) {
            return this.rocketMinipoolStatus.then(function (rocketMinipoolStatus) {
                return (0, _transaction.handleConfirmations)(rocketMinipoolStatus.methods.submitMinipoolWithdrawable(minipoolAddress).send(options), onConfirmation);
            });
        }
    }, {
        key: "rocketMinipoolManager",
        get: function get() {
            return this.contracts.get("rocketMinipoolManager");
        }
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketMinipoolQueue contract
         */

    }, {
        key: "rocketMinipoolQueue",
        get: function get() {
            return this.contracts.get("rocketMinipoolQueue");
        }
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketMinipoolStatus contract
         */

    }, {
        key: "rocketMinipoolStatus",
        get: function get() {
            return this.contracts.get("rocketMinipoolStatus");
        }
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketMinipool contract
         */

    }, {
        key: "rocketMinipool",
        get: function get() {
            return this.contracts.get("rocketMinipool");
        }
    }]);

    return Minipool;
}();
// Exports


exports.default = Minipool;
//# sourceMappingURL=minipool.js.map