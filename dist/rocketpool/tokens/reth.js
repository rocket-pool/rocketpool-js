"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../utils/transaction");

var _erc = require("./erc20");

var _erc2 = _interopRequireDefault(_erc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Rocket Pool RETH Token Manager
 */
var RETH = function (_ERC) {
    _inherits(RETH, _ERC);

    /**
     * Create a new rETH instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function RETH(web3, contracts) {
        _classCallCheck(this, RETH);

        return _possibleConstructorReturn(this, (RETH.__proto__ || Object.getPrototypeOf(RETH)).call(this, web3, contracts, "rocketTokenRETH"));
    }
    /**
     * Get the amount of ETH backing an amount of rETH
     * @params rethAmountWei a string representing the rETH amount in Wei
     * @returns a Promise<string\> that resolves to a string representing the amount amount of rETH backing an amount of ETH
     *
     * @example using Typescript
     * ```ts
     * const rethAmountWei = web3.utils.toWei("1", "ether");
     * const ethValue = rp.tokens.reth.getEthValue(rethAmountWei).then((val: string) => { val };
     * ```
     */


    _createClass(RETH, [{
        key: "getEthValue",
        value: function getEthValue(rethAmountWei) {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getEthValue(rethAmountWei).call();
            });
        }
        /**
         * Get the amount of rETH backing an amount of ETH
         * @params ethAmountWei a string representing the ETH amount in Wei
         * @returns a Promise<string\> that resolves to a string representing the amount amount of rETH backing an amount of ETH
         *
         * @example using Typescript
         * ```ts
         * const ethAmountWei = web3.utils.toWei("1", "ether");
         * const rethValue = rp.tokens.reth.getRethValue(ethAmountWei).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getRethValue",
        value: function getRethValue(ethAmountWei) {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getRethValue(ethAmountWei).call();
            });
        }
        /**
         * Get the current ETH to rETH exchange rate
         * @returns a Promise<number\> that resolves to a number representing the amount of ETH backing 1 rETH
         *
         * @example using Typescript
         * ```ts
         * const exchangeRate = rp.tokens.reth.getTotalCollateral().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getExchangeRate",
        value: function getExchangeRate() {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getExchangeRate().call();
            });
        }
        /**
         * Get the total amount of ETH collateral available
         * @returns a Promise<string\> that resolves to a string representing the portion of rETH backed by ETH in the contract as a fraction
         *
         * @example using Typescript
         * ```ts
         * const totalCollateral = rp.tokens.reth.getTotalCollateral().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getTotalCollateral",
        value: function getTotalCollateral() {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getTotalCollateral().call();
            });
        }
        /**
         * Get the current ETH collateral rate
         * @returns a Promise<number\> that resolves to a number representing the portion of rETH backed by ETH in the contract as a fraction
         *
         * @example using Typescript
         * ```ts
         * const rate = rp.tokens.reth.getCollateralRate().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getCollateralRate",
        value: function getCollateralRate() {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getCollateralRate().call();
            });
        }
        /**
         * Get the total supply
         * @returns a Promise<number\> that resolves to a number representing the total supply
         *
         * @example using Typescript
         * ```ts
         * const supply = rp.tokens.reth.totalSupply().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getTotalSupply",
        value: function getTotalSupply() {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.totalSupply().call();
            });
        }
        /**
         * Burn rETH for ETH
         * @param amountWei A string representing the amount to burn in Wei
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const fromAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const amountWei = web3.utils.toWei("1", "ether");
         * const options = {
         *		from: fromAddress,
         *		gas: 1000000
         * };
         * const txReceipt = rp.tokens.reth.burn(amountWei, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "burn",
        value: function burn(amountWei, options, onConfirmation) {
            return this.tokenContract.then(function (tokenContract) {
                return (0, _transaction.handleConfirmations)(tokenContract.methods.burn(amountWei).send(options), onConfirmation);
            });
        }
    }]);

    return RETH;
}(_erc2.default);
// Exports


exports.default = RETH;
//# sourceMappingURL=reth.js.map