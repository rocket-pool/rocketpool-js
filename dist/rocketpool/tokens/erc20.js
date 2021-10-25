"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../utils/transaction");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ERC20 Token Contract
 */
var ERC20 = function () {
    /**
     * Create a new ERC20 instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     * @param tokenContractName A string representing the Token Contract Name
     */
    function ERC20(web3, contracts, tokenContractName) {
        _classCallCheck(this, ERC20);

        this.web3 = web3;
        this.contracts = contracts;
        this.tokenContractName = tokenContractName;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the contract passed into the constructor
     */


    _createClass(ERC20, [{
        key: "balanceOf",

        /**
         * Return the token balance of an account
         * @param account A string representing the address you wish to lookup the balance for
         * @returns a Promise<string\> that resolves to a string representing the token balance in Wei
         *
         * @example using Typescript
         * const account = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * ```ts
         * const balance = rp.tokens.rpl.balanceOf(account).then((val: string) => { val };
         * ```
         */
        value: function balanceOf(account) {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.balanceOf(account).call();
            });
        }
        /**
         * Return the token allowance for an account
         * @param account A string representing the address you wish to lookup the balance for
         * @param spender A string representing the spender address (usually a token contract)
         * @returns a Promise<string\> that resolves to a string representing the token balance in Wei
         *
         * @example using Typescript
         * const account = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const contractAddress = rp.api.contracts.get("rocketTokenRPL").then((val: string) => { contract.options.address };
         * ```ts
         * const balance = rp.tokens.rpl.allowance(account, contractAddress).then((val: string) => { val };
         * ```
         */

    }, {
        key: "allowance",
        value: function allowance(account, spender) {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.allowance(account, spender).call();
            });
        }
        /**
         * Transfer tokens to an account to a recipient if approved
         * @param to A string representing the to address
         * @param amountWei A string representing the amount to send in Wei
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const fromAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const toAddress = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const amountWei = web3.utils.toWei("20", "ether");
         * const options = {
         *		from: fromAddress,
         *		gas: 1000000
         * };
         * const txReceipt = rp.tokens.rpl.transfer(toAddress, amountWei, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "transfer",
        value: function transfer(to, amountWei, options, onConfirmation) {
            return this.tokenContract.then(function (tokenContract) {
                return (0, _transaction.handleConfirmations)(tokenContract.methods.transfer(to, amountWei).send(options), onConfirmation);
            });
        }
        /**
         * Approve an allowance for a spender
         * @param spender A string representing the spender address (usually a token contract)
         * @param amountWei A string representing the amount to send in Wei
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const fromAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const contractAddress = rp.api.contracts.get("rocketTokenRPL").then((val: string) => { contract.options.address };
         * const amountWei = web3.utils.toWei("20", "ether");
         * const options = {
         *		from: fromAddress,
         *		gas: 1000000
         * };
         * const txReceipt = rp.tokens.rpl.approve(contractAddress, amountWei, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "approve",
        value: function approve(spender, amountWei, options, onConfirmation) {
            return this.tokenContract.then(function (tokenContract) {
                return (0, _transaction.handleConfirmations)(tokenContract.methods.approve(spender, amountWei).send(options), onConfirmation);
            });
        }
        /**
         * Transfer tokens from an account to a recipient if approved
         * @param from A string representing the from address
         * @param to A string representing the to address
         * @param amountWei A string representing the amount to send in Wei
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const fromAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const toAddress = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const amountWei = web3.utils.toWei("20", "ether");
         * const options = {
         *		from: fromAddress,
         *		gas: 1000000
         * };
         * const txReceipt = rp.tokens.rpl.transferFrom(from, to, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "transferFrom",
        value: function transferFrom(from, to, amountWei, options, onConfirmation) {
            return this.tokenContract.then(function (tokenContract) {
                return (0, _transaction.handleConfirmations)(tokenContract.methods.transferFrom(from, to, amountWei).send(options), onConfirmation);
            });
        }
    }, {
        key: "tokenContract",
        get: function get() {
            return this.contracts.get(this.tokenContractName);
        }
    }]);

    return ERC20;
}();
// Exports


exports.default = ERC20;
//# sourceMappingURL=erc20.js.map