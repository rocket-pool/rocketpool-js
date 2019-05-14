'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

var _nodeContract = require('./node-contract');

var _nodeContract2 = _interopRequireDefault(_nodeContract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        key: 'getAvailableCount',

        /**
         * Getters
         */
        // Get the current number of nodes with minipools available for assignment by staking duration ID
        value: function getAvailableCount(stakingDurationId) {
            return this.rocketNode.then(function (rocketNode) {
                return rocketNode.methods.getAvailableNodeCount(stakingDurationId).call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the current RPL ratio by staking duration ID

    }, {
        key: 'getRPLRatio',
        value: function getRPLRatio(stakingDurationId) {
            var _this = this;

            return this.rocketNodeAPI.then(function (rocketNodeAPI) {
                return rocketNodeAPI.methods.getRPLRatio(stakingDurationId).call();
            }).then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get the current RPL requirement for an ether amount by staking duration ID

    }, {
        key: 'getRPLRequired',
        value: function getRPLRequired(weiAmount, stakingDurationId) {
            var _this2 = this;

            return this.rocketNodeAPI.then(function (rocketNodeAPI) {
                return rocketNodeAPI.methods.getRPLRequired(weiAmount, stakingDurationId).call();
            }).then(function (ret) {
                return [ret[0], parseFloat(_this2.web3.utils.fromWei(ret[1], 'ether'))];
            });
        }
        // Get the timezone location of a node

    }, {
        key: 'getTimezoneLocation',
        value: function getTimezoneLocation(nodeOwner) {
            return this.rocketNodeAPI.then(function (rocketNodeAPI) {
                return rocketNodeAPI.methods.getTimezoneLocation(nodeOwner).call();
            });
        }
        // Get a node's contract address by owner address

    }, {
        key: 'getContractAddress',
        value: function getContractAddress(nodeOwner) {
            return this.rocketNodeAPI.then(function (rocketNodeAPI) {
                return rocketNodeAPI.methods.getContract(nodeOwner).call();
            });
        }
        // Get a NodeContract instance

    }, {
        key: 'getContract',
        value: function getContract(address) {
            var _this3 = this;

            return this.contracts.make('rocketNodeContract', address).then(function (rocketNodeContract) {
                return new _nodeContract2.default(_this3.web3, rocketNodeContract);
            });
        }
        /**
         * Mutators - Public
         */
        // Register a node

    }, {
        key: 'add',
        value: function add(timezone, options, onConfirmation) {
            return this.rocketNodeAPI.then(function (rocketNodeAPI) {
                return (0, _transaction.handleConfirmations)(rocketNodeAPI.methods.add(timezone).send(options), onConfirmation);
            });
        }
        /**
         * Mutators - Restricted to the node owner address
         */
        // Set a node's timezone location

    }, {
        key: 'setTimezoneLocation',
        value: function setTimezoneLocation(timezone, options, onConfirmation) {
            return this.rocketNodeAPI.then(function (rocketNodeAPI) {
                return (0, _transaction.handleConfirmations)(rocketNodeAPI.methods.setTimezoneLocation(timezone).send(options), onConfirmation);
            });
        }
    }, {
        key: 'rocketNodeAPI',
        get: function get() {
            return this.contracts.get('rocketNodeAPI');
        }
    }, {
        key: 'rocketNode',
        get: function get() {
            return this.contracts.get('rocketNode');
        }
    }]);

    return Node;
}();
// Exports


exports.default = Node;
//# sourceMappingURL=node.js.map