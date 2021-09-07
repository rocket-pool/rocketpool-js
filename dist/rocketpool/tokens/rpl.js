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
 * Rocket Pool RPL token manager
 */
var RPL = function (_ERC) {
    _inherits(RPL, _ERC);

    // Constructor
    function RPL(web3, contracts) {
        _classCallCheck(this, RPL);

        return _possibleConstructorReturn(this, (RPL.__proto__ || Object.getPrototypeOf(RPL)).call(this, web3, contracts, "rocketTokenRPL"));
    }
    /**
     * Getters
     */
    // Get contract address


    _createClass(RPL, [{
        key: "getAddress",
        value: function getAddress() {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.options.address;
            });
        }
        // Get the inflation intervals that have passed

    }, {
        key: "getInflationIntervalsPassed",
        value: function getInflationIntervalsPassed() {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.getInflationIntervalsPassed().call();
            });
        }
        // Get the total supply

    }, {
        key: "totalSupply",
        value: function totalSupply() {
            return this.tokenContract.then(function (tokenContract) {
                return tokenContract.methods.totalSupply().call();
            });
        }
        /**
         * Mutators - Public
         */
        // Swap current RPL fixed supply tokens for new RPL

    }, {
        key: "swapTokens",
        value: function swapTokens(amountWei, options, onConfirmation) {
            return this.tokenContract.then(function (tokenContract) {
                return (0, _transaction.handleConfirmations)(tokenContract.methods.swapTokens(amountWei).send(options), onConfirmation);
            });
        }
        // Inflation mint tokens

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