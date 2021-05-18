'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../../../utils/transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool DAO Trusted Node Proposals
 */
var DAONodeTrustedProposals = function () {
    // Constructor
    function DAONodeTrustedProposals(web3, contracts) {
        _classCallCheck(this, DAONodeTrustedProposals);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(DAONodeTrustedProposals, [{
        key: 'propose',

        /**
         * Getters
         */
        /**
         * Mutators - Public
         */
        // Make a Proposal to the DAO
        value: function propose(message, payload, options, onConfirmation) {
            return this.rocketDAONodeTrustedProposals.then(function (rocketDAONodeTrustedProposals) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedProposals.methods.propose(message, payload).send(options), onConfirmation);
            });
        }
        // Vote on an existing DAO Proposal

    }, {
        key: 'vote',
        value: function vote(proposalID, _vote, options, onConfirmation) {
            return this.rocketDAONodeTrustedProposals.then(function (rocketDAONodeTrustedProposals) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedProposals.methods.vote(proposalID, _vote).send(options), onConfirmation);
            });
        }
        // Execute an existing DAO Proposal

    }, {
        key: 'execute',
        value: function execute(proposalID, options, onConfirmation) {
            return this.rocketDAONodeTrustedProposals.then(function (rocketDAONodeTrustedProposals) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedProposals.methods.execute(proposalID).send(options), onConfirmation);
            });
        }
    }, {
        key: 'rocketDAONodeTrustedProposals',
        get: function get() {
            return this.contracts.get('rocketDAONodeTrustedProposals');
        }
    }]);

    return DAONodeTrustedProposals;
}();
// Exports


exports.default = DAONodeTrustedProposals;
//# sourceMappingURL=proposals.js.map