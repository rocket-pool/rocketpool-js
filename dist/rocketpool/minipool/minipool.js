'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

var _minipoolContract = require('./minipool-contract');

var _minipoolContract2 = _interopRequireDefault(_minipoolContract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool minipool manager
 */
var Minipool = function () {
    // Constructor
    function Minipool(web3, contracts) {
        _classCallCheck(this, Minipool);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Minipool, [{
        key: 'getMinipools',

        /**
         * Getters
         */
        // Get all minipool details
        value: function getMinipools() {
            var _this = this;

            return this.getMinipoolAddresses().then(function (addresses) {
                return Promise.all(addresses.map(function (address) {
                    return _this.getMinipoolDetails(address);
                }));
            });
        }
        // Get all minipool addresses

    }, {
        key: 'getMinipoolAddresses',
        value: function getMinipoolAddresses() {
            var _this2 = this;

            return this.getMinipoolCount().then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (index) {
                    return _this2.getMinipoolAt(index);
                }));
            });
        }
        // Get a node's minipool details

    }, {
        key: 'getNodeMinipools',
        value: function getNodeMinipools(nodeAddress) {
            var _this3 = this;

            return this.getNodeMinipoolAddresses(nodeAddress).then(function (addresses) {
                return Promise.all(addresses.map(function (address) {
                    return _this3.getMinipoolDetails(address);
                }));
            });
        }
        // Get a node's minipool addresses

    }, {
        key: 'getNodeMinipoolAddresses',
        value: function getNodeMinipoolAddresses(nodeAddress) {
            var _this4 = this;

            return this.getNodeMinipoolCount(nodeAddress).then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (index) {
                    return _this4.getNodeMinipoolAt(nodeAddress, index);
                }));
            });
        }
        // Get a minipool's details

    }, {
        key: 'getMinipoolDetails',
        value: function getMinipoolDetails(address) {
            return Promise.all([this.getMinipoolExists(address), this.getMinipoolPubkey(address)]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    exists = _ref2[0],
                    pubkey = _ref2[1];

                return { address: address, exists: exists, pubkey: pubkey };
            });
        }
        // Get the total minipool count

    }, {
        key: 'getMinipoolCount',
        value: function getMinipoolCount() {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolCount().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get a minipool address by index

    }, {
        key: 'getMinipoolAt',
        value: function getMinipoolAt(index) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolAt(index).call();
            });
        }
        // Get a node's total minipool count

    }, {
        key: 'getNodeMinipoolCount',
        value: function getNodeMinipoolCount(nodeAddress) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getNodeMinipoolCount(nodeAddress).call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the staking minipool count

    }, {
        key: 'getStakingMinipoolCount',
        value: function getStakingMinipoolCount() {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getStakingMinipoolCount().call();
            });
        }
        // Get the total staking minipool count

    }, {
        key: 'getNodeStakingMinipoolCount',
        value: function getNodeStakingMinipoolCount(nodeAddress) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getNodeStakingMinipoolCount(nodeAddress).call();
            });
        }
        // Get the node active minipool count

    }, {
        key: 'getNodeActiveMinipoolCount',
        value: function getNodeActiveMinipoolCount(nodeAddress) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getNodeActiveMinipoolCount(nodeAddress).call();
            });
        }
        // Get a node's minipool address by index

    }, {
        key: 'getNodeMinipoolAt',
        value: function getNodeMinipoolAt(nodeAddress, index) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getNodeMinipoolAt(nodeAddress, index).call();
            });
        }
        // Get a minipool address by validator pubkey

    }, {
        key: 'getMinipoolByPubkey',
        value: function getMinipoolByPubkey(validatorPubkey) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolByPubkey(validatorPubkey).call();
            });
        }
        // Check whether a minipool exists

    }, {
        key: 'getMinipoolExists',
        value: function getMinipoolExists(address) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolExists(address).call();
            });
        }
        // Get a minipool's validator pubkey

    }, {
        key: 'getMinipoolPubkey',
        value: function getMinipoolPubkey(address) {
            return this.rocketMinipoolManager.then(function (rocketMinipoolManager) {
                return rocketMinipoolManager.methods.getMinipoolPubkey(address).call();
            });
        }
        // Get the minipool queue length

    }, {
        key: 'getQueueLength',
        value: function getQueueLength(depositType) {
            return this.rocketMinipoolQueue.then(function (rocketMinipoolQueue) {
                return rocketMinipoolQueue.methods.getLength(depositType).call();
            });
        }
        // Get the total minipool queue length

    }, {
        key: 'getQueueTotalLength',
        value: function getQueueTotalLength() {
            return this.rocketMinipoolQueue.then(function (rocketMinipoolQueue) {
                return rocketMinipoolQueue.methods.getTotalLength().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the total capacity of queued minipools in wei

    }, {
        key: 'getQueueTotalCapacity',
        value: function getQueueTotalCapacity() {
            return this.rocketMinipoolQueue.then(function (rocketMinipoolQueue) {
                return rocketMinipoolQueue.methods.getTotalCapacity().call();
            });
        }
        // Get the effective capacity of queued minipools in wei (used in node demand calculations)

    }, {
        key: 'getQueueEffectiveCapacity',
        value: function getQueueEffectiveCapacity() {
            return this.rocketMinipoolQueue.then(function (rocketMinipoolQueue) {
                return rocketMinipoolQueue.methods.getEffectiveCapacity().call();
            });
        }
        // Get the capacity of the next available minipool in wei

    }, {
        key: 'getQueueNextCapacity',
        value: function getQueueNextCapacity() {
            return this.rocketMinipoolQueue.then(function (rocketMinipoolQueue) {
                return rocketMinipoolQueue.methods.getNextCapacity().call();
            });
        }
        // Get the node reward amount for a minipool by node fee, user deposit balance, and staking start & end balances

    }, {
        key: 'getMinipoolNodeRewardAmount',
        value: function getMinipoolNodeRewardAmount(nodeFee, userDepositBalance, startBalance, endBalance) {
            var _this5 = this;

            return this.rocketMinipoolStatus.then(function (rocketMinipoolStatus) {
                return rocketMinipoolStatus.methods.getMinipoolNodeRewardAmount(_this5.web3.utils.toWei(nodeFee.toString(), 'ether'), userDepositBalance, startBalance, endBalance).call();
            });
        }
        // Get a MinipoolContract instance

    }, {
        key: 'getMinipoolContract',
        value: function getMinipoolContract(address) {
            var _this6 = this;

            return this.contracts.make('rocketMinipoolDelegate', address).then(function (rocketMinipool) {
                return new _minipoolContract2.default(_this6.web3, address, rocketMinipool);
            });
        }
        // Get Effective Delegate

    }, {
        key: 'getEffectiveDelegate',
        value: function getEffectiveDelegate(address) {
            return this.rocketMinipool.then(function (rocketMinipool) {
                return rocketMinipool.methods.getEffectiveDelegate(address).call();
            });
        }
        /**
         * Mutators - Restricted to trusted nodes
         */
        // Submit a minipool withdrawable event

    }, {
        key: 'submitMinipoolWithdrawable',
        value: function submitMinipoolWithdrawable(minipoolAddress, options, onConfirmation) {
            return this.rocketMinipoolStatus.then(function (rocketMinipoolStatus) {
                return (0, _transaction.handleConfirmations)(rocketMinipoolStatus.methods.submitMinipoolWithdrawable(minipoolAddress).send(options), onConfirmation);
            });
        }
    }, {
        key: 'rocketMinipoolManager',
        get: function get() {
            return this.contracts.get('rocketMinipoolManager');
        }
    }, {
        key: 'rocketMinipoolQueue',
        get: function get() {
            return this.contracts.get('rocketMinipoolQueue');
        }
    }, {
        key: 'rocketMinipoolStatus',
        get: function get() {
            return this.contracts.get('rocketMinipoolStatus');
        }
    }, {
        key: 'rocketMinipool',
        get: function get() {
            return this.contracts.get('rocketMinipool');
        }
    }]);

    return Minipool;
}();
// Exports


exports.default = Minipool;
//# sourceMappingURL=minipool.js.map