'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RocketGroupContract instance wrapper
 */
var GroupContract = function () {
    // Constructor
    function GroupContract(web3, contract) {
        _classCallCheck(this, GroupContract);

        this.web3 = web3;
        this.contract = contract;
    }
    /**
     * Getters
     */
    // Get all group details


    _createClass(GroupContract, [{
        key: 'getDetails',
        value: function getDetails() {
            return Promise.all([this.getOwner(), this.getGroupFee(), this.getRocketPoolFee(), this.getGroupFeeAddress()]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 4),
                    owner = _ref2[0],
                    groupFee = _ref2[1],
                    rocketPoolFee = _ref2[2],
                    groupFeeAddress = _ref2[3];

                return { owner: owner, groupFee: groupFee, rocketPoolFee: rocketPoolFee, groupFeeAddress: groupFeeAddress };
            });
        }
        // Get the group owner

    }, {
        key: 'getOwner',
        value: function getOwner() {
            return this.contract.methods.getOwner().call();
        }
        // Get the fee charged to the group's users by the group as a fraction

    }, {
        key: 'getGroupFee',
        value: function getGroupFee() {
            var _this = this;

            return this.contract.methods.getFeePerc().call().then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get the fee charged to the group's users by Rocket Pool as a fraction

    }, {
        key: 'getRocketPoolFee',
        value: function getRocketPoolFee() {
            var _this2 = this;

            return this.contract.methods.getFeePercRocketPool().call().then(function (value) {
                return parseFloat(_this2.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get the address group fees are sent to

    }, {
        key: 'getGroupFeeAddress',
        value: function getGroupFeeAddress() {
            return this.contract.methods.getFeeAddress().call();
        }
        /**
         * Mutators - Restricted to the group owner address
         */
        // Set the fee charged to the group's users by the group

    }, {
        key: 'setGroupFee',
        value: function setGroupFee(feeFraction, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.setFeePerc(this.web3.utils.toWei(feeFraction.toString(), 'ether')).send(options), onConfirmation);
        }
        // Set the address group fees are sent to

    }, {
        key: 'setGroupFeeAddress',
        value: function setGroupFeeAddress(address, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.setFeeAddress(address).send(options), onConfirmation);
        }
        // Add a depositor contract to the group

    }, {
        key: 'addDepositor',
        value: function addDepositor(address, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.addDepositor(address).send(options), onConfirmation);
        }
        // Remove a depositor contract from the group

    }, {
        key: 'removeDepositor',
        value: function removeDepositor(address, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.removeDepositor(address).send(options), onConfirmation);
        }
        // Add a withdrawer contract to the group

    }, {
        key: 'addWithdrawer',
        value: function addWithdrawer(address, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.addWithdrawer(address).send(options), onConfirmation);
        }
        // Remove a withdrawer contract from the group

    }, {
        key: 'removeWithdrawer',
        value: function removeWithdrawer(address, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.removeWithdrawer(address).send(options), onConfirmation);
        }
    }]);

    return GroupContract;
}();
// Exports


exports.default = GroupContract;
//# sourceMappingURL=group-contract.js.map