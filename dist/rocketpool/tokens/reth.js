'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

        return _possibleConstructorReturn(this, (RETH.__proto__ || Object.getPrototypeOf(RETH)).call(this, web3, contracts, 'rocketTokenRETH'));
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
        // Get the total amount of ETH collateral available
        // TODO: revert to getTotalCollateral call after new RP deployment

    }, {
        key: 'getTotalCollateral',
        value: function getTotalCollateral() {
            var _this3 = this;

            //return this.tokenContract.then((tokenContract: Contract): Promise<string> => {
            //    return tokenContract.methods.getTotalCollateral().call();
            //});
            return Promise.all([this.contracts.address('rocketTokenRETH').then(function (rethContractAddress) {
                return _this3.web3.eth.getBalance(rethContractAddress);
            }), this.contracts.get('rocketDepositPool').then(function (rocketDepositPool) {
                return rocketDepositPool.methods.getExcessBalance().call();
            })]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    rethContractBalance = _ref2[0],
                    depositPoolExcessBalance = _ref2[1];

                return _this3.web3.utils.toBN(rethContractBalance).add(_this3.web3.utils.toBN(depositPoolExcessBalance)).toString(10);
            });
        }
        // Get the current ETH collateral rate
        // Returns the portion of rETH backed by ETH in the contract as a fraction

    }, {
        key: 'getCollateralRate',
        value: function getCollateralRate() {
            var _this4 = this;

            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getCollateralRate().call();
            }).then(function (value) {
                return parseFloat(_this4.web3.utils.fromWei(value, 'ether'));
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