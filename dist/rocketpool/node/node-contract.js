'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RocketNodeContract instance wrapper
 */
var NodeContract = function () {
    // Constructor
    function NodeContract(web3, contract) {
        _classCallCheck(this, NodeContract);

        this.web3 = web3;
        this.contract = contract;
    }
    /**
     * Getters
     */
    // Get all node details


    _createClass(NodeContract, [{
        key: 'getDetails',
        value: function getDetails() {
            return Promise.all([this.getOwner(), this.getRewardsAddress(), this.getEthBalance(), this.getRplBalance(), this.getHasDepositReservation()]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 5),
                    owner = _ref2[0],
                    rewardsAddress = _ref2[1],
                    ethBalance = _ref2[2],
                    rplBalance = _ref2[3],
                    hasDepositReservation = _ref2[4];

                return { owner: owner, rewardsAddress: rewardsAddress, ethBalance: ethBalance, rplBalance: rplBalance, hasDepositReservation: hasDepositReservation };
            });
        }
        // Get all node deposit reservation details

    }, {
        key: 'getDepositReservation',
        value: function getDepositReservation() {
            return Promise.all([this.getDepositReservationCreated(), this.getDepositReservationEthRequired(), this.getDepositReservationRplRequired(), this.getDepositReservationDurationId(), this.getDepositReservationValidatorPubkey(), this.getDepositReservationValidatorSignature()]).then(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 6),
                    created = _ref4[0],
                    etherRequired = _ref4[1],
                    rplRequired = _ref4[2],
                    durationId = _ref4[3],
                    validatorPubkey = _ref4[4],
                    validatorSignature = _ref4[5];

                return { created: created, etherRequired: etherRequired, rplRequired: rplRequired, durationId: durationId, validatorPubkey: validatorPubkey, validatorSignature: validatorSignature };
            });
        }
        // Get the node owner

    }, {
        key: 'getOwner',
        value: function getOwner() {
            return this.contract.methods.getOwner().call();
        }
        // Get the node's rewards address

    }, {
        key: 'getRewardsAddress',
        value: function getRewardsAddress() {
            return this.contract.methods.getRewardsAddress().call();
        }
        // Get the node's current ETH balance in wei

    }, {
        key: 'getEthBalance',
        value: function getEthBalance() {
            return this.contract.methods.getBalanceETH().call();
        }
        // Get the node's current RPL balance in wei

    }, {
        key: 'getRplBalance',
        value: function getRplBalance() {
            return this.contract.methods.getBalanceRPL().call();
        }
        // Check whether the node has an existing deposit reservation

    }, {
        key: 'getHasDepositReservation',
        value: function getHasDepositReservation() {
            return this.contract.methods.getHasDepositReservation().call();
        }
        // Get the deposit reservation created time

    }, {
        key: 'getDepositReservationCreated',
        value: function getDepositReservationCreated() {
            return this.contract.methods.getDepositReservedTime().call().then(function (value) {
                return new Date(parseInt(value) * 1000);
            });
        }
        // Get the deposit reservation ETH requirement in wei

    }, {
        key: 'getDepositReservationEthRequired',
        value: function getDepositReservationEthRequired() {
            return this.contract.methods.getDepositReserveEtherRequired().call();
        }
        // Get the deposit reservation RPL requirement in wei

    }, {
        key: 'getDepositReservationRplRequired',
        value: function getDepositReservationRplRequired() {
            return this.contract.methods.getDepositReserveRPLRequired().call();
        }
        // Get the deposit reservation duration ID

    }, {
        key: 'getDepositReservationDurationId',
        value: function getDepositReservationDurationId() {
            return this.contract.methods.getDepositReserveDurationID().call();
        }
        // Get the deposit reservation validator pubkey

    }, {
        key: 'getDepositReservationValidatorPubkey',
        value: function getDepositReservationValidatorPubkey() {
            return this.contract.methods.getDepositReserveValidatorPubkey().call();
        }
        // Get the deposit reservation validator signature

    }, {
        key: 'getDepositReservationValidatorSignature',
        value: function getDepositReservationValidatorSignature() {
            return this.contract.methods.getDepositReserveValidatorSignature().call();
        }
        /**
         * Mutators - Restricted to the node owner address
         */
        // Set the node's rewards address

    }, {
        key: 'setRewardsAddress',
        value: function setRewardsAddress(address, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.setRewardsAddress(address).send(options), onConfirmation);
        }
        // Make a deposit reservation

    }, {
        key: 'reserveDeposit',
        value: function reserveDeposit(durationId, validatorPubkey, validatorSignature, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.depositReserve(durationId, validatorPubkey, validatorSignature).send(options), onConfirmation);
        }
        // Cancel a deposit reservation

    }, {
        key: 'cancelDepositReservation',
        value: function cancelDepositReservation(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.depositReserveCancel().send(options), onConfirmation);
        }
        // Can complete a deposit

    }, {
        key: 'completeDeposit',
        value: function completeDeposit(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.deposit().send(options), onConfirmation);
        }
        // Withdraw a deposit from an initialised, timed out or withdrawn minipool

    }, {
        key: 'withdrawMinipoolDeposit',
        value: function withdrawMinipoolDeposit(minipoolAddress, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.withdrawMinipoolDeposit(minipoolAddress).send(options), onConfirmation);
        }
        // Withdraw ETH from the node contract

    }, {
        key: 'withdrawEth',
        value: function withdrawEth(weiAmount, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.withdrawEther(weiAmount).send(options), onConfirmation);
        }
        // Withdraw RPL from the node contract

    }, {
        key: 'withdrawRpl',
        value: function withdrawRpl(weiAmount, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.withdrawRPL(weiAmount).send(options), onConfirmation);
        }
    }]);

    return NodeContract;
}();
// Exports


exports.default = NodeContract;
//# sourceMappingURL=node-contract.js.map