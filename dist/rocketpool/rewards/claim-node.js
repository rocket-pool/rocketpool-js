'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Rewards
 */
var Rewards = function () {
    // Constructor
    function Rewards(web3, contracts) {
        _classCallCheck(this, Rewards);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Rewards, [{
        key: 'getClaimPossible',

        /**
         * Getters
         */
        // Determine if the claim is possible
        value: function getClaimPossible(address) {
            return this.rocketClaimNode.then(function (rocketClaimNode) {
                return rocketClaimNode.methods.getNodeClaimPossible(address).call();
            });
        }
        /**
         * Mutators - Public
         */
        // Make a node claim

    }, {
        key: 'claim',
        value: function claim(options, onConfirmation) {
            return this.rocketClaimNode.then(function (rocketClaimNode) {
                return (0, _transaction.handleConfirmations)(rocketClaimNode.methods.claim().send(options), onConfirmation);
            });
        }
    }, {
        key: 'rocketClaimNode',
        get: function get() {
            return this.contracts.get('rocketClaimNode');
        }
    }]);

    return Rewards;
}();
// Exports


exports.default = Rewards;
//# sourceMappingURL=claim-node.js.map