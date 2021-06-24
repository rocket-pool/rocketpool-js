'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool DAO Proposals
 */
var DAOProposal = function () {
    // Constructor
    function DAOProposal(web3, contracts) {
        _classCallCheck(this, DAOProposal);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(DAOProposal, [{
        key: 'getTotal',

        /**
         * Getters
         */
        // Get the total of DAO Proposals
        value: function getTotal() {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getTotal().call();
            });
        }
        // Get the state of a DAO Proposal

    }, {
        key: 'getState',
        value: function getState(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getState(proposalID).call();
            });
        }
        // Get the number of votes for DAO Proposal

    }, {
        key: 'getVotesFor',
        value: function getVotesFor(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getVotesFor(proposalID).call();
            });
        }
        // Get the number of required votes for DAO Proposal

    }, {
        key: 'getVotesRequired',
        value: function getVotesRequired(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getVotesRequired(proposalID).call();
            });
        }
        // Get start given a proposal id

    }, {
        key: 'getStart',
        value: function getStart(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getStart(proposalID).call();
            });
        }
        // Get end given a proposal id

    }, {
        key: 'getEnd',
        value: function getEnd(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getEnd(proposalID).call();
            });
        }
        // Get votes against

    }, {
        key: 'getVotesAgainst',
        value: function getVotesAgainst(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getVotesAgainst(proposalID).call();
            });
        }
        // Get the block a proposal expires

    }, {
        key: 'getExpires',
        value: function getExpires(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getExpires(proposalID).call();
            });
        }
    }, {
        key: 'rocketDAOProposal',
        get: function get() {
            return this.contracts.get('rocketDAOProposal');
        }
    }]);

    return DAOProposal;
}();
// Exports


exports.default = DAOProposal;
//# sourceMappingURL=proposals.js.map