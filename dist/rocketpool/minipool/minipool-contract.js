'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RocketMinipool contract instance wrapper
 */
var MinipoolContract = function () {
    // Constructor
    function MinipoolContract(web3, address, contract) {
        _classCallCheck(this, MinipoolContract);

        this.web3 = web3;
        this.address = address;
        this.contract = contract;
    }
    /**
     * Getters
     */
    // Status details


    _createClass(MinipoolContract, [{
        key: 'getStatusDetails',
        value: function getStatusDetails() {
            return Promise.all([this.getStatus(), this.getStatusBlock(), this.getStatusTime()]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 3),
                    status = _ref2[0],
                    block = _ref2[1],
                    time = _ref2[2];

                return { status: status, block: block, time: time };
            });
        }
    }, {
        key: 'getStatus',
        value: function getStatus() {
            return this.contract.methods.getStatus().call();
        }
    }, {
        key: 'getStatusBlock',
        value: function getStatusBlock() {
            return this.contract.methods.getStatusBlock().call().then(function (value) {
                return parseInt(value);
            });
        }
    }, {
        key: 'getStatusTime',
        value: function getStatusTime() {
            return this.contract.methods.getStatusTime().call().then(function (value) {
                return new Date(parseInt(value) * 1000);
            });
        }
        // Deposit type

    }, {
        key: 'getDepositType',
        value: function getDepositType() {
            return this.contract.methods.getDepositType().call();
        }
        // Node details

    }, {
        key: 'getNodeDetails',
        value: function getNodeDetails() {
            return Promise.all([this.getNodeAddress(), this.getNodeFee(), this.getNodeDepositBalance(), this.getNodeRefundBalance(), this.getNodeDepositAssigned()]).then(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 5),
                    address = _ref4[0],
                    fee = _ref4[1],
                    depositBalance = _ref4[2],
                    refundBalance = _ref4[3],
                    depositAssigned = _ref4[4];

                return { address: address, fee: fee, depositBalance: depositBalance, refundBalance: refundBalance, depositAssigned: depositAssigned };
            });
        }
    }, {
        key: 'getNodeAddress',
        value: function getNodeAddress() {
            return this.contract.methods.getNodeAddress().call();
        }
    }, {
        key: 'getNodeFee',
        value: function getNodeFee() {
            var _this = this;

            return this.contract.methods.getNodeFee().call().then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, 'ether'));
            });
        }
    }, {
        key: 'getNodeDepositBalance',
        value: function getNodeDepositBalance() {
            return this.contract.methods.getNodeDepositBalance().call();
        }
    }, {
        key: 'getNodeRefundBalance',
        value: function getNodeRefundBalance() {
            return this.contract.methods.getNodeRefundBalance().call();
        }
    }, {
        key: 'getNodeDepositAssigned',
        value: function getNodeDepositAssigned() {
            return this.contract.methods.getNodeDepositAssigned().call();
        }
        // User deposit details

    }, {
        key: 'getUserDetails',
        value: function getUserDetails() {
            return Promise.all([this.getUserDepositBalance(), this.getUserDepositAssigned()]).then(function (_ref5) {
                var _ref6 = _slicedToArray(_ref5, 2),
                    depositBalance = _ref6[0],
                    depositAssigned = _ref6[1];

                return { depositBalance: depositBalance, depositAssigned: depositAssigned };
            });
        }
    }, {
        key: 'getUserDepositBalance',
        value: function getUserDepositBalance() {
            return this.contract.methods.getUserDepositBalance().call();
        }
    }, {
        key: 'getUserDepositAssigned',
        value: function getUserDepositAssigned() {
            return this.contract.methods.getUserDepositAssigned().call();
        }
        // Staking details

    }, {
        key: 'getStakingDetails',
        value: function getStakingDetails() {
            return Promise.all([this.getStakingStartBalance(), this.getStakingEndBalance(), this.getStakingStartBlock(), this.getStakingUserStartBlock(), this.getStakingEndBlock()]).then(function (_ref7) {
                var _ref8 = _slicedToArray(_ref7, 5),
                    startBalance = _ref8[0],
                    endBalance = _ref8[1],
                    startBlock = _ref8[2],
                    userStartBlock = _ref8[3],
                    endBlock = _ref8[4];

                return { startBalance: startBalance, endBalance: endBalance, startBlock: startBlock, userStartBlock: userStartBlock, endBlock: endBlock };
            });
        }
    }, {
        key: 'getStakingStartBalance',
        value: function getStakingStartBalance() {
            return this.contract.methods.getStakingStartBalance().call();
        }
    }, {
        key: 'getStakingEndBalance',
        value: function getStakingEndBalance() {
            return this.contract.methods.getStakingEndBalance().call();
        }
    }, {
        key: 'getStakingStartBlock',
        value: function getStakingStartBlock() {
            return this.contract.methods.getStakingStartBlock().call().then(function (value) {
                return parseInt(value);
            });
        }
    }, {
        key: 'getStakingUserStartBlock',
        value: function getStakingUserStartBlock() {
            return this.contract.methods.getStakingUserStartBlock().call().then(function (value) {
                return parseInt(value);
            });
        }
    }, {
        key: 'getStakingEndBlock',
        value: function getStakingEndBlock() {
            return this.contract.methods.getStakingEndBlock().call().then(function (value) {
                return parseInt(value);
            });
        }
        /**
         * Mutators - Public
         */
        // Dissolve the minipool

    }, {
        key: 'dissolve',
        value: function dissolve(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.dissolve().send(options), onConfirmation);
        }
        /**
         * Mutators - Restricted to minipool owner
         */
        // Refund node ETH refinanced from user deposited ETH

    }, {
        key: 'refund',
        value: function refund(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.refund().send(options), onConfirmation);
        }
        // Progress the minipool to staking

    }, {
        key: 'stake',
        value: function stake(validatorPubkey, validatorSignature, depositDataRoot, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.stake(validatorPubkey, validatorSignature, depositDataRoot).send(options), onConfirmation);
        }
        // Withdraw node balances & rewards from the minipool and close it

    }, {
        key: 'withdraw',
        value: function withdraw(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.withdraw().send(options), onConfirmation);
        }
        // Withdraw node balances from the minipool and close it

    }, {
        key: 'close',
        value: function close(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.close().send(options), onConfirmation);
        }
    }]);

    return MinipoolContract;
}();
// Exports


exports.default = MinipoolContract;
//# sourceMappingURL=minipool-contract.js.map