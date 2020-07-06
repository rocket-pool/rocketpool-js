'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _contracts = require('./contracts/contracts');

var _contracts2 = _interopRequireDefault(_contracts);

var _deposit = require('./deposit/deposit');

var _deposit2 = _interopRequireDefault(_deposit);

var _minipool = require('./minipool/minipool');

var _minipool2 = _interopRequireDefault(_minipool);

var _network = require('./network/network');

var _network2 = _interopRequireDefault(_network);

var _node = require('./node/node');

var _node2 = _interopRequireDefault(_node);

var _deposit3 = require('./settings/deposit');

var _deposit4 = _interopRequireDefault(_deposit3);

var _minipool3 = require('./settings/minipool');

var _minipool4 = _interopRequireDefault(_minipool3);

var _network3 = require('./settings/network');

var _network4 = _interopRequireDefault(_network3);

var _node3 = require('./settings/node');

var _node4 = _interopRequireDefault(_node3);

var _neth = require('./tokens/neth');

var _neth2 = _interopRequireDefault(_neth);

var _reth = require('./tokens/reth');

var _reth2 = _interopRequireDefault(_reth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Main Rocket Pool library class
 */
var RocketPool =
// Constructor
function RocketPool(web3, RocketStorage) {
    _classCallCheck(this, RocketPool);

    this.web3 = web3;
    this.RocketStorage = RocketStorage;
    // Initialise services
    this.contracts = new _contracts2.default(web3, RocketStorage);
    this.deposit = new _deposit2.default(web3, this.contracts);
    this.minipool = new _minipool2.default(web3, this.contracts);
    this.network = new _network2.default(web3, this.contracts);
    this.node = new _node2.default(web3, this.contracts);
    this.settings = {
        deposit: new _deposit4.default(web3, this.contracts),
        minipool: new _minipool4.default(web3, this.contracts),
        network: new _network4.default(web3, this.contracts),
        node: new _node4.default(web3, this.contracts)
    };
    this.tokens = {
        neth: new _neth2.default(web3, this.contracts),
        reth: new _reth2.default(web3, this.contracts)
    };
};
// Exports


exports.default = RocketPool;
//# sourceMappingURL=rocketpool.js.map