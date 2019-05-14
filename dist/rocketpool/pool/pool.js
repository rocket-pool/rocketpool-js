'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minipoolContract = require('./minipool-contract');

var _minipoolContract2 = _interopRequireDefault(_minipoolContract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool pools manager
 */
var Pool = function () {
    // Constructor
    function Pool(web3, contracts) {
        _classCallCheck(this, Pool);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Pool, [{
        key: 'getPoolExists',

        /**
         * Getters
         */
        // Get whether a minipool with a given address exists
        value: function getPoolExists(address) {
            return this.rocketPool.then(function (rocketPool) {
                return rocketPool.methods.getPoolExists(address).call();
            });
        }
        // Get the total number of minipools

    }, {
        key: 'getPoolCount',
        value: function getPoolCount() {
            return this.rocketPool.then(function (rocketPool) {
                return rocketPool.methods.getPoolsCount().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get a minipool address by index

    }, {
        key: 'getPoolAt',
        value: function getPoolAt(index) {
            return this.rocketPool.then(function (rocketPool) {
                return rocketPool.methods.getPoolAt(index).call();
            });
        }
        // Get the total network ether assigned by staking duration ID in wei

    }, {
        key: 'getTotalEthAssigned',
        value: function getTotalEthAssigned(stakingDurationId) {
            return this.rocketPool.then(function (rocketPool) {
                return rocketPool.methods.getTotalEther('assigned', stakingDurationId).call();
            });
        }
        // Get the total network ether capacity by staking duration ID in wei

    }, {
        key: 'getTotalEthCapacity',
        value: function getTotalEthCapacity(stakingDurationId) {
            return this.rocketPool.then(function (rocketPool) {
                return rocketPool.methods.getTotalEther('capacity', stakingDurationId).call();
            });
        }
        // Get the current network utilisation by staking duration ID as a fraction

    }, {
        key: 'getNetworkUtilisation',
        value: function getNetworkUtilisation(stakingDurationId) {
            var _this = this;

            return this.rocketPool.then(function (rocketPool) {
                return rocketPool.methods.getNetworkUtilisation(stakingDurationId).call();
            }).then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get a MinipoolContract instance

    }, {
        key: 'getMinipoolContract',
        value: function getMinipoolContract(address) {
            var _this2 = this;

            return this.contracts.make('rocketMinipool', address).then(function (rocketMinipool) {
                return new _minipoolContract2.default(_this2.web3, rocketMinipool);
            });
        }
    }, {
        key: 'rocketPool',
        get: function get() {
            return this.contracts.get('rocketPool');
        }
    }]);

    return Pool;
}();
// Exports


exports.default = Pool;
//# sourceMappingURL=pool.js.map