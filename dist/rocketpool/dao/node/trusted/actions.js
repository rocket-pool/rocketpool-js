"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../../../utils/transaction");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool DAO Trusted Node Actions
 */
var DAONodeTrustedActions = function () {
    /**
     * Create a new DAONodeTrustedActions instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function DAONodeTrustedActions(web3, contracts) {
        _classCallCheck(this, DAONodeTrustedActions);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAONodeTrustedActions contract
     */


    _createClass(DAONodeTrustedActions, [{
        key: "actionJoin",

        /**
         * Join the DAO
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.dao.node.trusted.actions.actionJoin(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */
        value: function actionJoin(options, onConfirmation) {
            return this.rocketDAONodeTrustedActions.then(function (rocketDAONodeTrustedActions) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedActions.methods.actionJoin().send(options), onConfirmation);
            });
        }
        /**
         * Leave the DAO
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.dao.node.trusted.actions.actionLeave(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "actionLeave",
        value: function actionLeave(refundAddress, options, onConfirmation) {
            return this.rocketDAONodeTrustedActions.then(function (rocketDAONodeTrustedActions) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedActions.methods.actionLeave(refundAddress).send(options), onConfirmation);
            });
        }
        /**
         * Challenge another DAO member
         * @param address A string representing the address of the DAO member you want challenge
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const addressToChallenge = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.dao.node.trusted.actions.actionChallengeMake(addressToChallenge, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "actionChallengeMake",
        value: function actionChallengeMake(address, options, onConfirmation) {
            return this.rocketDAONodeTrustedActions.then(function (rocketDAONodeTrustedActions) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedActions.methods.actionChallengeMake(address).send(options), onConfirmation);
            });
        }
        /**
         * Decides the success of a challenge
         * @param address A string representing the address of the DAO member you want challenge
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const addressToChallenge = "0x421433c3f99529A704Ec2270E1A68fa66DD8bD79";
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.dao.node.trusted.actions.actionChallengeMake(addressToChallenge, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "actionChallengeDecide",
        value: function actionChallengeDecide(address, options, onConfirmation) {
            return this.rocketDAONodeTrustedActions.then(function (rocketDAONodeTrustedActions) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedActions.methods.actionChallengeDecide(address).send(options), onConfirmation);
            });
        }
    }, {
        key: "rocketDAONodeTrustedActions",
        get: function get() {
            return this.contracts.get("rocketDAONodeTrustedActions");
        }
    }]);

    return DAONodeTrustedActions;
}();
// Exports


exports.default = DAONodeTrustedActions;
//# sourceMappingURL=actions.js.map