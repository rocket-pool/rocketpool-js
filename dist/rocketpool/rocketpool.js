'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _contracts = require('./contracts/contracts');

var _contracts2 = _interopRequireDefault(_contracts);

var _auction = require('./auction/auction');

var _auction2 = _interopRequireDefault(_auction);

var _proposals = require('./dao/proposals');

var _proposals2 = _interopRequireDefault(_proposals);

var _node = require('./dao/node/trusted/node');

var _node2 = _interopRequireDefault(_node);

var _actions = require('./dao/node/trusted/actions');

var _actions2 = _interopRequireDefault(_actions);

var _proposals3 = require('./dao/node/trusted/proposals');

var _proposals4 = _interopRequireDefault(_proposals3);

var _settings = require('./dao/node/trusted/settings');

var _settings2 = _interopRequireDefault(_settings);

var _settings3 = require('./dao/protocol/settings');

var _settings4 = _interopRequireDefault(_settings3);

var _deposit = require('./deposit/deposit');

var _deposit2 = _interopRequireDefault(_deposit);

var _minipool = require('./minipool/minipool');

var _minipool2 = _interopRequireDefault(_minipool);

var _network = require('./network/network');

var _network2 = _interopRequireDefault(_network);

var _node3 = require('./node/node');

var _node4 = _interopRequireDefault(_node3);

var _auction3 = require('./settings/auction');

var _auction4 = _interopRequireDefault(_auction3);

var _deposit3 = require('./settings/deposit');

var _deposit4 = _interopRequireDefault(_deposit3);

var _minipool3 = require('./settings/minipool');

var _minipool4 = _interopRequireDefault(_minipool3);

var _network3 = require('./settings/network');

var _network4 = _interopRequireDefault(_network3);

var _node5 = require('./settings/node');

var _node6 = _interopRequireDefault(_node5);

var _reth = require('./tokens/reth');

var _reth2 = _interopRequireDefault(_reth);

var _rpl = require('./tokens/rpl');

var _rpl2 = _interopRequireDefault(_rpl);

var _pool = require('./rewards/pool');

var _pool2 = _interopRequireDefault(_pool);

var _claimNode = require('./rewards/claim-node');

var _claimNode2 = _interopRequireDefault(_claimNode);

var _claimDao = require('./rewards/claim-dao');

var _claimDao2 = _interopRequireDefault(_claimDao);

var _claimTrustedNode = require('./rewards/claim-trusted-node');

var _claimTrustedNode2 = _interopRequireDefault(_claimTrustedNode);

var _vault = require('./vault/vault');

var _vault2 = _interopRequireDefault(_vault);

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
    this.auction = new _auction2.default(web3, this.contracts);
    this.dao = {
        node: {
            trusted: {
                actions: new _actions2.default(web3, this.contracts),
                node: new _node2.default(web3, this.contracts),
                proposals: new _proposals4.default(web3, this.contracts),
                settings: new _settings2.default(web3, this.contracts)
            }
        },
        protocol: {
            settings: new _settings4.default(web3, this.contracts)
        },
        proposals: new _proposals2.default(web3, this.contracts)
    };
    this.deposit = new _deposit2.default(web3, this.contracts);
    this.minipool = new _minipool2.default(web3, this.contracts);
    this.network = new _network2.default(web3, this.contracts);
    this.node = new _node4.default(web3, this.contracts);
    this.settings = {
        auction: new _auction4.default(web3, this.contracts),
        deposit: new _deposit4.default(web3, this.contracts),
        minipool: new _minipool4.default(web3, this.contracts),
        network: new _network4.default(web3, this.contracts),
        node: new _node6.default(web3, this.contracts)
    };
    this.tokens = {
        reth: new _reth2.default(web3, this.contracts),
        rpl: new _rpl2.default(web3, this.contracts)
    };
    this.rewards = {
        pool: new _pool2.default(web3, this.contracts),
        claimNode: new _claimNode2.default(web3, this.contracts),
        claimDAO: new _claimDao2.default(web3, this.contracts),
        claimTrustedNode: new _claimTrustedNode2.default(web3, this.contracts)
    };
    this.vault = new _vault2.default(web3, this.contracts);
};
// Exports


exports.default = RocketPool;
//# sourceMappingURL=rocketpool.js.map