'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _erc = require('./erc20');

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

        return _possibleConstructorReturn(this, (RPL.__proto__ || Object.getPrototypeOf(RPL)).call(this, web3, contracts, 'rocketPoolToken'));
    }

    return RPL;
}(_erc2.default);
// Exports


exports.default = RPL;
//# sourceMappingURL=rpl.js.map