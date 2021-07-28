'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool deposit pool manager
 */
var Deposit = function () {
    // Constructor
    function Deposit(web3, contracts) {
        _classCallCheck(this, Deposit);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Deposit, [{
        key: 'getBalance',

        /**
         * Getters
         */
        // Get the current deposit pool balance in wei
        value: function getBalance() {
            return this.rocketDepositPool.then(function (rocketDepositPool) {
                return rocketDepositPool.methods.getBalance().call();
            });
        }
        // Get the excess balance

    }, {
        key: 'getExcessBalance',
        value: function getExcessBalance() {
            return this.rocketDepositPool.then(function (rocketDepositPool) {
                return rocketDepositPool.methods.getExcessBalance().call();
            });
        }
        // Get the users last deposit block

    }, {
        key: 'getUserLastDepositBlock',
        value: function getUserLastDepositBlock(address) {
            return this.rocketDepositPool.then(function (rocketDepositPool) {
                return rocketDepositPool.methods.getUserLastDepositBlock(address).call();
            });
        }
        /**
         * Mutators - Public
         */
        // Make a deposit

    }, {
        key: 'deposit',
        value: function deposit(options, onConfirmation) {
            return this.rocketDepositPool.then(function (rocketDepositPool) {
                return (0, _transaction.handleConfirmations)(rocketDepositPool.methods.deposit().send(options), onConfirmation);
            });
        }
        // Assign deposits

    }, {
        key: 'assignDeposits',
        value: function assignDeposits(options, onConfirmation) {
            return this.rocketDepositPool.then(function (rocketDepositPool) {
                return (0, _transaction.handleConfirmations)(rocketDepositPool.methods.assignDeposits().send(options), onConfirmation);
            });
        }
    }, {
        key: 'rocketDepositPool',
        get: function get() {
            return this.contracts.get('rocketDepositPool');
        }
    }]);

    return Deposit;
}();
// Exports


exports.default = Deposit;
//# sourceMappingURL=deposit.js.map