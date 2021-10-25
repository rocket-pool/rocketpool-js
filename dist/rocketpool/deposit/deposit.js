"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../utils/transaction");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Deposit Pool Manager
 */
var Deposit = function () {
    /**
     * Create a new Deposit instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function Deposit(web3, contracts) {
        _classCallCheck(this, Deposit);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDepositPool contract
     */


    _createClass(Deposit, [{
        key: "getBalance",

        /**
         * Get the current deposit pool balance in Wei
         * @returns a Promise<string\> that resolves to a string representing the current deposit pool balance in Wei
         *
         * @example using Typescript
         * ```ts
         * const balanceInWei = rp.deposit.getBalance().then((val: string) => { val };
         * // convert to Ether if needed
         * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
         * ```
         */
        value: function getBalance() {
            return this.rocketDepositPool.then(function (rocketDepositPool) {
                return rocketDepositPool.methods.getBalance().call();
            });
        }
        /**
         * Get the excess balance in Wei
         * @returns a Promise<string\> that resolves to a string representing the current excess balance in Wei
         *
         * @example using Typescript
         * ```ts
         * const balanceInWei = rp.deposit.getExcessBalance().then((val: string) => { val };
         * // convert to Ether if needed
         * const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether')
         * ```
         */

    }, {
        key: "getExcessBalance",
        value: function getExcessBalance() {
            return this.rocketDepositPool.then(function (rocketDepositPool) {
                return rocketDepositPool.methods.getExcessBalance().call();
            });
        }
        /**
         * Get the block of the last user deposit
         * @returns a Promise<number\> that resolves to a number representing the block of the last user deposit
         *
         * @example using Typescript
         * ```ts
         * const block = rp.deposit.getUserLastDepositBlock().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getUserLastDepositBlock",
        value: function getUserLastDepositBlock(address) {
            return this.rocketDepositPool.then(function (rocketDepositPool) {
                return rocketDepositPool.methods.getUserLastDepositBlock(address).call();
            });
        }
        /**
         * Make a deposit
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *	  value: web3.utils.toWei("10", "ether"),
         *		gas: 1000000
         * }
         * const txReceipt = rp.deposit.deposit(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "deposit",
        value: function deposit(options, onConfirmation) {
            return this.rocketDepositPool.then(function (rocketDepositPool) {
                return (0, _transaction.handleConfirmations)(rocketDepositPool.methods.deposit().send(options), onConfirmation);
            });
        }
        /**
         * Assign Deposits
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.deposit.assignDeposits(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "assignDeposits",
        value: function assignDeposits(options, onConfirmation) {
            return this.rocketDepositPool.then(function (rocketDepositPool) {
                return (0, _transaction.handleConfirmations)(rocketDepositPool.methods.assignDeposits().send(options), onConfirmation);
            });
        }
    }, {
        key: "rocketDepositPool",
        get: function get() {
            return this.contracts.get("rocketDepositPool");
        }
    }]);

    return Deposit;
}();
// Exports


exports.default = Deposit;
//# sourceMappingURL=deposit.js.map