"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../../../utils/transaction");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool DAO Trusted Node
 */
var DAONodeTrusted = function () {
    /**
     * Create a new DAONodeTrusted instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function DAONodeTrusted(web3, contracts) {
        _classCallCheck(this, DAONodeTrusted);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAONodeTrusted contract
     */


    _createClass(DAONodeTrusted, [{
        key: "getMemberID",

        /**
         * Return the member id given an address
         * @param account A string representing the address you wish to lookup the member id for
         * @returns a Promise<string\> that resolves to a string representing the member id
         *
         * @example using Typescript
         * const account = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * ```ts
         * const memberID = rp.dao.node.trusted.node.getMemberID(account).then((val: string) => { val };
         * ```
         */
        value: function getMemberID(address) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getMemberID(address).call();
            });
        }
        /**
         * Get the number of DAO Members
         * @returns a Promise<number\> that resolves to a number representing the number of DAO members
         *
         * @example using Typescript
         * ```ts
         * const memberCount = rp.dao.node.trusted.node.getMemberCount().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getMemberCount",
        value: function getMemberCount() {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getMemberCount().call();
            });
        }
        /**
         * Check if Bootstrap Mode is enabled
         * @returns a Promise<boolean\> that resolves to a boolean representing if bootstrap mode is enabled
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.dao.node.trusted.node.getBootstrapModeDisabled().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getBootstrapModeDisabled",
        value: function getBootstrapModeDisabled() {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getBootstrapModeDisabled().call();
            });
        }
        /**
         * Get the number of votes needed for a proposal to pass
         * @returns a Promise<number\> that resolves to a number representing the number of votes needed for a proposal to pass
         *
         * @example using Typescript
         * ```ts
         * const votes = rp.dao.node.trusted.node.getProposalQuorumVotesRequired().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getProposalQuorumVotesRequired",
        value: function getProposalQuorumVotesRequired() {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getProposalQuorumVotesRequired().call();
            });
        }
        /**
         * Check if a member is valid
         * @param address A string representing the address you wish to check if a member is valid
         * @returns a Promise<boolean\> that resolves to a boolean representing if a member is valid
         *
         * @example using Typescript
         * ```ts
         * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const valid = rp.dao.node.trusted.node.getMemberIsValid(address).then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getMemberIsValid",
        value: function getMemberIsValid(address) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getMemberIsValid(address).call();
            });
        }
        /**
         * Get a member's RPL bond amount
         * @param address A string representing the address you wish to lookup
         * @returns a Promise<string\> that resolves to a string representing if a member is valid
         *
         * @example using Typescript
         * ```ts
         * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const bondAmount = rp.dao.node.trusted.node.getMemberRPLBondAmount(address).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getMemberRPLBondAmount",
        value: function getMemberRPLBondAmount(address) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getMemberRPLBondAmount(address).call();
            });
        }
        /**
         * Check if a member has been challenged
         * @param address A string representing the address you wish to lookup
         * @returns a Promise<boolean\> that resolves to a boolean representing if a member is valid
         *
         * @example using Typescript
         * ```ts
         * const address = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const challenged = rp.dao.node.trusted.node.getMemberRPLBondAmount(address).then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getMemberIsChallenged",
        value: function getMemberIsChallenged(address) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return rocketDAONodeTrusted.methods.getMemberIsChallenged(address).call();
            });
        }
        /**
         * Bootstrap a DAO Member
         * @param id A string representing the id or name of the member
         * @param url A string representing the url for the member
         * @param nodeAddress A string representing the address of the member you are adding
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const id = "kermit";
         * const url = "https://kermit.xyz";
         * const guardian = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: guardian, // bootstrap can only be performed by guardian and if bootstrap mode is enabled
         *		gas: 1000000
         * };
         * const txReceipt = rp.dao.node.trusted.bootstrapMember(id, url, nodeAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "bootstrapMember",
        value: function bootstrapMember(id, url, nodeAddress, options, onConfirmation) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrusted.methods.bootstrapMember(id, url, nodeAddress).send(options), onConfirmation);
            });
        }
        /**
         * Bootstrap a Boolean Setting
         * @param settingContractInstance A string representing contract instance
         * @param settingPath A string representing the path for the setting
         * @param value A boolean representing the value of the setting you wish to set
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const settingContractInstance = "kermit";
         * const settingPath = "https://kermit.xyz";
         * const value = true;
         * const guardian = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const options = {
         *		from: guardian, // bootstrap can only be performed by guardian
         *		gas: 1000000
         * };
         * const txReceipt = rp.dao.node.trusted.bootstrapSettingBool(settingContractInstance, settingPath, value, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "bootstrapSettingBool",
        value: function bootstrapSettingBool(settingContractInstance, settingPath, value, options, onConfirmation) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrusted.methods.bootstrapSettingBool(settingContractInstance, settingPath, value).send(options), onConfirmation);
            });
        }
        /**
         * Bootstrap a Uint Setting
         * @param settingContractInstance A string representing contract instance
         * @param settingPath A string representing the path for the setting
         * @param value A string, number or object representing the value of the setting you wish to set
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * // Turn off the ability to create auction lots
         * const settingContractInstance = "rocketDAOProtocolSettingsAuction";
         * const settingPath = "auction.lot.create.enabled";
         * const value = false;
         * const guardian = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const options = {
         *		from: guardian, // bootstrap can only be performed by guardian
         *		gas: 1000000
         * };
         * const txReceipt = rp.dao.node.trusted.bootstrapSettingUint(settingContractInstance, settingPath, value, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "bootstrapSettingUint",
        value: function bootstrapSettingUint(settingContractInstance, settingPath, value, options, onConfirmation) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrusted.methods.bootstrapSettingUint(settingContractInstance, settingPath, value).send(options), onConfirmation);
            });
        }
        /**
         * Disable Bootstrap Mode for RP (only RP can call this to hand over full control to the DAO)
         * @param value A boolean representing if you are turning bootstrap mode on or off
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const mode = true;
         * const guardian = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const options = {
         *		from: guardian, // bootstrap can only be performed by guardian
         *		gas: 1000000
         * };
         * const txReceipt = rp.dao.node.trusted.bootstrapDisable(mode, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "bootstrapDisable",
        value: function bootstrapDisable(value, options, onConfirmation) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrusted.methods.bootstrapDisable(value).send(options), onConfirmation);
            });
        }
        /**
         * In an explicable black swan scenario where the DAO loses more than the min membership required (3), this method can be used by a regular node operator to join the DAO
         * Must have their ID, URL, current RPL bond amount available and must be called by their current registered node account
         * @param id A string representing the id for the member
         * @param url A string representing the url for the member
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const id = "rocketpool_emergency_node_op";
         * const url = "https://rocketpool.net";
         * const registeredNode = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const options = {
         *		from: registeredNode,
         *		gas: 1000000
         * };
         * const txReceipt = rp.dao.node.trusted.memberJoinRequired(id, url, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "memberJoinRequired",
        value: function memberJoinRequired(id, url, options, onConfirmation) {
            return this.rocketDAONodeTrusted.then(function (rocketDAONodeTrusted) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrusted.methods.memberJoinRequired(id, url).send(options), onConfirmation);
            });
        }
    }, {
        key: "rocketDAONodeTrusted",
        get: function get() {
            return this.contracts.get("rocketDAONodeTrusted");
        }
    }]);

    return DAONodeTrusted;
}();
// Exports


exports.default = DAONodeTrusted;
//# sourceMappingURL=node.js.map