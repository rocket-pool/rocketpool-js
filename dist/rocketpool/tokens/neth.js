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
 * Rocket Pool NETH token manager
 */
var NETH = function (_ERC) {
    _inherits(NETH, _ERC);

    // Constructor
    function NETH(web3, contracts) {
        _classCallCheck(this, NETH);

        return _possibleConstructorReturn(this, (NETH.__proto__ || Object.getPrototypeOf(NETH)).call(this, web3, contracts, 'rocketTokenNETH'));
    }
    /**
     * Mutators - Public
     */
    // Burn nETH for ETH


    _createClass(NETH, [{
        key: 'burn',
        value: function burn(amountWei, options, onConfirmation) {
            return this.tokenContract.then(function (tokenContract) {
                return (0, _transaction.handleConfirmations)(tokenContract.methods.burn(amountWei).send(options), onConfirmation);
            });
        }
    }]);

    return NETH;
}(_erc2.default);
// Exports


exports.default = NETH;
//# sourceMappingURL=neth.js.map