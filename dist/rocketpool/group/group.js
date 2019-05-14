'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

var _groupContract = require('./group-contract');

var _groupContract2 = _interopRequireDefault(_groupContract);

var _groupAccessorContract = require('./group-accessor-contract');

var _groupAccessorContract2 = _interopRequireDefault(_groupAccessorContract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool groups manager
 */
var Group = function () {
    // Constructor
    function Group(web3, contracts) {
        _classCallCheck(this, Group);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Group, [{
        key: 'getName',

        /**
         * Getters
         */
        // Get the name of a group by ID
        value: function getName(groupId) {
            return this.rocketGroupAPI.then(function (rocketGroupAPI) {
                return rocketGroupAPI.methods.getGroupName(groupId).call();
            });
        }
        // Get a GroupContract instance

    }, {
        key: 'getContract',
        value: function getContract(address) {
            var _this = this;

            return this.contracts.make('rocketGroupContract', address).then(function (rocketGroupContract) {
                return new _groupContract2.default(_this.web3, rocketGroupContract);
            });
        }
        // Get a GroupAccessorContract instance

    }, {
        key: 'getAccessorContract',
        value: function getAccessorContract(address) {
            var _this2 = this;

            return this.contracts.make('rocketGroupAccessorContract', address).then(function (rocketGroupAccessorContract) {
                return new _groupAccessorContract2.default(_this2.web3, rocketGroupAccessorContract);
            });
        }
        /**
         * Mutators - Public
         */
        // Register a group

    }, {
        key: 'add',
        value: function add(name, stakingFeeFraction, options, onConfirmation) {
            var _this3 = this;

            return this.rocketGroupAPI.then(function (rocketGroupAPI) {
                return (0, _transaction.handleConfirmations)(rocketGroupAPI.methods.add(name, _this3.web3.utils.toWei(stakingFeeFraction.toString(), 'ether')).send(options), onConfirmation);
            });
        }
        // Create a default accessor contract for a group

    }, {
        key: 'createDefaultAccessor',
        value: function createDefaultAccessor(groupId, options, onConfirmation) {
            return this.rocketGroupAPI.then(function (rocketGroupAPI) {
                return (0, _transaction.handleConfirmations)(rocketGroupAPI.methods.createDefaultAccessor(groupId).send(options), onConfirmation);
            });
        }
    }, {
        key: 'rocketGroupAPI',
        get: function get() {
            return this.contracts.get('rocketGroupAPI');
        }
    }]);

    return Group;
}();
// Exports


exports.default = Group;
//# sourceMappingURL=group.js.map