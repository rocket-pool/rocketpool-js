"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool DAO Trusted Node Settings
 */
var DAONodeTrustedSettings = function () {
    // Constructor
    function DAONodeTrustedSettings(web3, contracts) {
        _classCallCheck(this, DAONodeTrustedSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(DAONodeTrustedSettings, [{
        key: "getMaximumDepositAssignments",

        /**
         * Getters
         */
        // Get member id given an address
        value: function getMaximumDepositAssignments() {
            return this.rocketDAOProtocolSettingsDeposit.then(function (rocketDAOProtocolSettingsDeposit) {
                return rocketDAOProtocolSettingsDeposit.methods.getMaximumDepositAssignments().call();
            });
        }
        // How much it costs a non-member to challenge a members node. It's free for current members to challenge other members.

    }, {
        key: "getChallengeCost",
        value: function getChallengeCost() {
            return this.rocketDAONodeTrustedSettingsMembers.then(function (rocketDAONodeTrustedSettingsMembers) {
                return rocketDAONodeTrustedSettingsMembers.methods.getChallengeCost().call();
            });
        }
    }, {
        key: "rocketDAONodeTrustedSettingsProposals",
        get: function get() {
            return this.contracts.get("rocketDAONodeTrustedSettingsProposals");
        }
    }, {
        key: "rocketDAONodeTrustedSettingsMembers",
        get: function get() {
            return this.contracts.get("rocketDAONodeTrustedSettingsMembers");
        }
    }, {
        key: "rocketDAOProtocolSettingsDeposit",
        get: function get() {
            return this.contracts.get("rocketDAOProtocolSettingsDeposit");
        }
    }, {
        key: "rocketDAOProtocolSettingsMinipool",
        get: function get() {
            return this.contracts.get("rocketDAOProtocolSettingsMinipool");
        }
    }]);

    return DAONodeTrustedSettings;
}();
// Exports


exports.default = DAONodeTrustedSettings;
//# sourceMappingURL=settings.js.map