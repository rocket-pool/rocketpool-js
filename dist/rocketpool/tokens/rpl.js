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
 * Rocket Pool RPL Token Manager
 */
var RPL = function (_ERC) {
    _inherits(RPL, _ERC);

    /**
     * Create a new RPL instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function RPL(web3, contracts) {
        _classCallCheck(this, RPL);

        return _possibleConstructorReturn(this, (RPL.__proto__ || Object.getPrototypeOf(RPL)).call(this, web3, contracts, "rocketTokenRPL"));
    }
    /**
     * Get the contract address
     * @returns a Promise<string\> that resolves to a string representing the contract address of the token
     *
     * @example using Typescript
     * ```ts
     * const address = rp.tokens.rpl.getAddress().then((val: string) => { val };
     * ```
     */


    _createClass(RPL, [{
        key: "getAddress",
        value: function getAddress() {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.options.address;
            });
        }
        /**
         * Get the inflation intervals that have passed
         * @returns a Promise<number\> that resolves to a number representing the inflation intervals that have passed (in time)
         *
         * @example using Typescript
         * ```ts
         * const address = rp.tokens.rpl.getInflationIntervalsPassed().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getInflationIntervalsPassed",
        value: function getInflationIntervalsPassed() {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getInflationIntervalsPassed().call();
            });
        }
        /**
         * Get the total supply
         * @returns a Promise<number\> that resolves to a number representing the total supply
         *
         * @example using Typescript
         * ```ts
         * const address = rp.tokens.rpl.totalSupply().then((val: number) => { val };
         * ```
         */

    }, {
        key: "totalSupply",
        value: function totalSupply() {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.totalSupply().call();
            });
        }
        /**
         * Swap current RPL fixed supply tokens for new RPL
         * @param amountWei A string representing the amount to swap in Wei
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const toAddress = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const amountWei = web3.utils.toWei("20", "ether");
         * const options = {
         *		from: fromAddress,
         *		gas: 1000000
         * };
         * const txReceipt = rp.tokens.rpl.swapTokens(amountWei, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "swapTokens",
        value: function swapTokens(amountWei, options, onConfirmation) {
            return this.tokenContract.then(function (tokenContract) {
                return (0, _transaction.handleConfirmations)(tokenContract.methods.swapTokens(amountWei).send(options), onConfirmation);
            });
        }
        /**
         * Inflation mint tokens
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const toAddress = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const options = {
         *		from: toAddress,
         *		gas: 1000000
         * };
         * const txReceipt = rp.tokens.rpl.inflationMintTokens(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "inflationMintTokens",
        value: function inflationMintTokens(options, onConfirmation) {
            return this.tokenContract.then(function (tokenContract) {
                return (0, _transaction.handleConfirmations)(tokenContract.methods.inflationMintTokens().send(options), onConfirmation);
            });
        }
    }]);

    return RPL;
}(_erc2.default);
// Exports


exports.default = RPL;
//# sourceMappingURL=rpl.js.map