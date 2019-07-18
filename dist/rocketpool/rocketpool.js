'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _contracts = require('./contracts/contracts');

var _contracts2 = _interopRequireDefault(_contracts);

var _deposit = require('./deposit/deposit');

var _deposit2 = _interopRequireDefault(_deposit);

var _group = require('./group/group');

var _group2 = _interopRequireDefault(_group);

var _node = require('./node/node');

var _node2 = _interopRequireDefault(_node);

var _pool = require('./pool/pool');

var _pool2 = _interopRequireDefault(_pool);

var _deposit3 = require('./settings/deposit');

var _deposit4 = _interopRequireDefault(_deposit3);

var _group3 = require('./settings/group');

var _group4 = _interopRequireDefault(_group3);

var _minipool = require('./settings/minipool');

var _minipool2 = _interopRequireDefault(_minipool);

var _node3 = require('./settings/node');

var _node4 = _interopRequireDefault(_node3);

var _reth = require('./tokens/reth');

var _reth2 = _interopRequireDefault(_reth);

var _rpl = require('./tokens/rpl');

var _rpl2 = _interopRequireDefault(_rpl);

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
    this.group = new _group2.default(web3, this.contracts);
    this.node = new _node2.default(web3, this.contracts);
    this.pool = new _pool2.default(web3, this.contracts);
    this.settings = {
        deposit: new _deposit4.default(web3, this.contracts),
        group: new _group4.default(web3, this.contracts),
        minipool: new _minipool2.default(web3, this.contracts),
        node: new _node4.default(web3, this.contracts)
    };
    this.tokens = {
        reth: new _reth2.default(web3, this.contracts),
        rpl: new _rpl2.default(web3, this.contracts)
    };
};
// Exports


exports.default = RocketPool;
//# sourceMappingURL=rocketpool.js.map