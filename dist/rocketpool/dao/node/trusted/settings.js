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
    /**
     * Create a new DAONodeTrustedSettings instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function DAONodeTrustedSettings(web3, contracts) {
        _classCallCheck(this, DAONodeTrustedSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAONodeTrustedSettingsProposals contract
     */


    _createClass(DAONodeTrustedSettings, [{
        key: "getMaximumDepositAssignments",

        /**
         * Get the maximum deposit assignments
         * @returns a Promise<string\> that resolves to a string representing the maximum deposit assignments
         *
         * @example using Typescript
         * ```ts
         * const maxDepositsAssignments = rp.dao.node.trusted.getMaximumDepositAssignments().then((val: string) => { val };
         * ```
         */
        value: function getMaximumDepositAssignments() {
            return this.rocketDAOProtocolSettingsDeposit.then(function (rocketDAOProtocolSettingsDeposit) {
                return rocketDAOProtocolSettingsDeposit.methods.getMaximumDepositAssignments().call();
            });
        }
        /**
         * Get the cost of a challenge (How much it costs a non-member to challenge a members node. It's free for current members to challenge other members.)
         * @returns a Promise<string\> that resolves to a string representing the inflation intervals that have passed (in time)
         *
         * @example using Typescript
         * ```ts
         * const maxDepositsAssignments = rp.dao.node.trusted.getMaximumDepositAssignments().then((val: string) => { val };
         * ```
         */

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
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAONodeTrustedSettingsMembers contract
         */

    }, {
        key: "rocketDAONodeTrustedSettingsMembers",
        get: function get() {
            return this.contracts.get("rocketDAONodeTrustedSettingsMembers");
        }
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsDeposit contract
         */

    }, {
        key: "rocketDAOProtocolSettingsDeposit",
        get: function get() {
            return this.contracts.get("rocketDAOProtocolSettingsDeposit");
        }
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProtocolSettingsMinipool contract
         */

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