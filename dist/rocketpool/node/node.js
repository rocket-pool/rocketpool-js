'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool node manager
 */
var Node = function () {
    // Constructor
    function Node(web3, contracts) {
        _classCallCheck(this, Node);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Node, [{
        key: 'getNodes',

        /**
         * Getters
         */
        // Get all node details
        value: function getNodes() {
            var _this = this;

            return this.getNodeAddresses().then(function (addresses) {
                return Promise.all(addresses.map(function (address) {
                    return _this.getNodeDetails(address);
                }));
            });
        }
        // Get all node addresses

    }, {
        key: 'getNodeAddresses',
        value: function getNodeAddresses() {
            var _this2 = this;

            return this.getNodeCount().then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (index) {
                    return _this2.getNodeAt(index);
                }));
            });
        }
        // Get all trusted node details

    }, {
        key: 'getTrustedNodes',
        value: function getTrustedNodes() {
            var _this3 = this;

            return this.getTrustedNodeAddresses().then(function (addresses) {
                return Promise.all(addresses.map(function (address) {
                    return _this3.getNodeDetails(address);
                }));
            });
        }
        // Get all trusted node addresses

    }, {
        key: 'getTrustedNodeAddresses',
        value: function getTrustedNodeAddresses() {
            var _this4 = this;

            return this.getTrustedNodeCount().then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (index) {
                    return _this4.getTrustedNodeAt(index);
                }));
            });
        }
        // Get a node's details

    }, {
        key: 'getNodeDetails',
        value: function getNodeDetails(address) {
            return Promise.all([this.getNodeExists(address), this.getNodeTrusted(address), this.getNodeTimezoneLocation(address)]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 3),
                    exists = _ref2[0],
                    trusted = _ref2[1],
                    timezoneLocation = _ref2[2];

                return { address: address, exists: exists, trusted: trusted, timezoneLocation: timezoneLocation };
            });
        }
        // Get the total node count

    }, {
        key: 'getNodeCount',
        value: function getNodeCount() {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getNodeCount().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get a node address by index

    }, {
        key: 'getNodeAt',
        value: function getNodeAt(index) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getNodeAt(index).call();
            });
        }
        // Get the total trusted node count

    }, {
        key: 'getTrustedNodeCount',
        value: function getTrustedNodeCount() {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getTrustedNodeCount().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get a trusted node address by index

    }, {
        key: 'getTrustedNodeAt',
        value: function getTrustedNodeAt(index) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getTrustedNodeAt(index).call();
            });
        }
        // Check whether a node exists

    }, {
        key: 'getNodeExists',
        value: function getNodeExists(address) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getNodeExists(address).call();
            });
        }
        // Check whether a node is trusted

    }, {
        key: 'getNodeTrusted',
        value: function getNodeTrusted(address) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getNodeTrusted(address).call();
            });
        }
        // Get a node's timezone location

    }, {
        key: 'getNodeTimezoneLocation',
        value: function getNodeTimezoneLocation(address) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getNodeTimezoneLocation(address).call();
            });
        }
        /**
         * Mutators - Public
         */
        // Register a node

    }, {
        key: 'registerNode',
        value: function registerNode(timezoneLocation, options, onConfirmation) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return (0, _transaction.handleConfirmations)(rocketNodeManager.methods.registerNode(timezoneLocation).send(options), onConfirmation);
            });
        }
        /**
         * Mutators - Restricted to registered nodes
         */
        // Set the node's timezone location

    }, {
        key: 'setTimezoneLocation',
        value: function setTimezoneLocation(timezoneLocation, options, onConfirmation) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return (0, _transaction.handleConfirmations)(rocketNodeManager.methods.setTimezoneLocation(timezoneLocation).send(options), onConfirmation);
            });
        }
        // Make a node deposit

    }, {
        key: 'deposit',
        value: function deposit(minimumNodeFee, options, onConfirmation) {
            var _this5 = this;

            return this.rocketNodeDeposit.then(function (rocketNodeDeposit) {
                return (0, _transaction.handleConfirmations)(rocketNodeDeposit.methods.deposit(_this5.web3.utils.toWei(minimumNodeFee.toString(), 'ether')).send(options), onConfirmation);
            });
        }
        /**
         * Mutators - Restricted to super users
         */
        // Set a node's trusted status

    }, {
        key: 'setNodeTrusted',
        value: function setNodeTrusted(address, trusted, options, onConfirmation) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return (0, _transaction.handleConfirmations)(rocketNodeManager.methods.setNodeTrusted(address, trusted).send(options), onConfirmation);
            });
        }
    }, {
        key: 'rocketNodeDeposit',
        get: function get() {
            return this.contracts.get('rocketNodeDeposit');
        }
    }, {
        key: 'rocketNodeManager',
        get: function get() {
            return this.contracts.get('rocketNodeManager');
        }
    }]);

    return Node;
}();
// Exports


exports.default = Node;
//# sourceMappingURL=node.js.map