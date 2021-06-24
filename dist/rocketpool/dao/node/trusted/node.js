'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../../../utils/transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool DAO Trusted Node
 */
var DAONodeTrusted = function () {
    // Constructor
    function DAONodeTrusted(web3, contracts) {
        _classCallCheck(this, DAONodeTrusted);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(DAONodeTrusted, [{
        key: 'getMemberID',

        /**
         * Getters
         */
        // Get member id given an address
        value: function getMemberID(address) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getMemberID(address).call();
            });
        }
        // Get the number of DAO Members

    }, {
        key: 'getMemberCount',
        value: function getMemberCount() {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getMemberCount().call();
            });
        }
        // Check if Bootstrap Mode is enabled

    }, {
        key: 'getBootstrapModeDisabled',
        value: function getBootstrapModeDisabled() {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getBootstrapModeDisabled().call();
            });
        }
        // Get the number of votes needed for a proposal to pass

    }, {
        key: 'getProposalQuorumVotesRequired',
        value: function getProposalQuorumVotesRequired() {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getProposalQuorumVotesRequired().call();
            });
        }
        // Check if a member is valid

    }, {
        key: 'getMemberIsValid',
        value: function getMemberIsValid(address) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getMemberIsValid(address).call();
            });
        }
        // Get member RPL bond amount

    }, {
        key: 'getMemberRPLBondAmount',
        value: function getMemberRPLBondAmount(address) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getMemberRPLBondAmount(address).call();
            });
        }
        // Get member is challenger

    }, {
        key: 'getMemberIsChallenged',
        value: function getMemberIsChallenged(address) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getMemberIsChallenged(address).call();
            });
        }
        /**
         * Mutators - Public
         */
        // Bootstrap a DAO Member

    }, {
        key: 'bootstrapMember',
        value: function bootstrapMember(id, url, nodeAddress, options, onConfirmation) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrusted.methods.bootstrapMember(id, url, nodeAddress).send(options), onConfirmation);
            });
        }
        // Bootstrap a Boolean Setting

    }, {
        key: 'bootstrapSettingBool',
        value: function bootstrapSettingBool(settingContractInstance, settingPath, value, options, onConfirmation) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrusted.methods.bootstrapSettingBool(settingContractInstance, settingPath, value).send(options), onConfirmation);
            });
        }
        // Bootstrap disable

    }, {
        key: 'bootstrapDisable',
        value: function bootstrapDisable(value, options, onConfirmation) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrusted.methods.bootstrapDisable(value).send(options), onConfirmation);
            });
        }
        // Bootstrap disable

    }, {
        key: 'memberJoinRequired',
        value: function memberJoinRequired(id, url, options, onConfirmation) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrusted.methods.memberJoinRequired(id, url).send(options), onConfirmation);
            });
        }
    }, {
        key: 'rocketDAONodeTrusted',
        get: function get() {
            return this.contracts.get('rocketDAONodeTrusted');
        }
    }]);

    return DAONodeTrusted;
}();
// Exports


exports.default = DAONodeTrusted;
//# sourceMappingURL=node.js.map