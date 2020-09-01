'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

var _erc = require('./erc20');

var _erc2 = _interopRequireDefault(_erc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Rocket Pool RETH token manager
 */
var RETH = function (_ERC) {
    _inherits(RETH, _ERC);

    // Constructor
    function RETH(web3, contracts) {
        _classCallCheck(this, RETH);

        return _possibleConstructorReturn(this, (RETH.__proto__ || Object.getPrototypeOf(RETH)).call(this, web3, contracts, 'rocketETHToken'));
    }
    /**
     * Getters
     */
    // Get the amount of ETH backing an amount of rETH


    _createClass(RETH, [{
        key: 'getEthValue',
        value: function getEthValue(rethAmountWei) {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getEthValue(rethAmountWei).call();
            });
        }
        // Get the amount of rETH backing an amount of ETH

    }, {
        key: 'getRethValue',
        value: function getRethValue(ethAmountWei) {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getRethValue(ethAmountWei).call();
            });
        }
        // Get the current ETH : rETH exchange rate
        // Returns the amount of ETH backing 1 rETH

    }, {
        key: 'getExchangeRate',
        value: function getExchangeRate() {
            var _this2 = this;

            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getExchangeRate().call();
            }).then(function (value) {
                return parseFloat(_this2.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get the current ETH collateral rate
        // Returns the portion of rETH backed by ETH in the contract as a fraction

    }, {
        key: 'getCollateralRate',
        value: function getCollateralRate() {
            var _this3 = this;

            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getCollateralRate().call();
            }).then(function (value) {
                return parseFloat(_this3.web3.utils.fromWei(value, 'ether'));
            });
        }
        /**
         * Mutators - Public
         */
        // Burn rETH for ETH

    }, {
        key: 'burn',
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