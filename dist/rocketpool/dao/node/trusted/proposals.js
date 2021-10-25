"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../../../utils/transaction");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool DAO Trusted Node Proposals
 */
var DAONodeTrustedProposals = function () {
    /**
     * Create a new DAONodeTrustedProposals instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function DAONodeTrustedProposals(web3, contracts) {
        _classCallCheck(this, DAONodeTrustedProposals);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAONodeTrustedProposals contract
     */


    _createClass(DAONodeTrustedProposals, [{
        key: "propose",

        /**
         * Create a DAO proposal with calldata
         * @param message A string representing the message
         * @param payload A string representing the calldata payload
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const proposerDAOMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const toBeKickedDAOMember = "0x6f10Fd508321D27D8F19CBCC2F2f3d5527B637eC";
         * const fineAmount = "5000000000000000000000";
         * const message = "hey guys, this member hasn't logged on for weeks, lets boot them with a 33% fine!";
         * const proposalCalldata = web3.eth.abi.encodeFunctionCall(
         * {
         *				name: "proposalKick",
         *				type: "function",
         *					inputs: [
         *						{ type: "address", name: "_nodeAddress" },
         *						{ type: "uint256", name: "_rplFine" },
         *					],
         * },
         * [toBeKickedDAOMember, registeredNodeTrusted2BondAmountFine.toString()]
         * );
         *
         * const options = {
         *		from: proposerDAOMember,
         *		gas: 1000000
         * }
         * const txReceipt = rp.dao.node.trusted.proposals.propose(message, payload, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */
        value: function propose(message, payload, options, onConfirmation) {
            return this.rocketDAONodeTrustedProposals.then(function (rocketDAONodeTrustedProposals) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedProposals.methods.propose(message, payload).send(options), onConfirmation);
            });
        }
        /**
         * Vote on an existing proposal
         * @param proposalID A number representing the proposalID
         * @param vote A boolean representing the vote
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const proposalID = 1;
         * const vote = true;
         * const daoMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         *
         * const options = {
         *		from: daoMember,
         *		gas: 1000000
         * }
         * const txReceipt = rp.dao.node.trusted.proposals.vote(proposalID, vote, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "vote",
        value: function vote(proposalID, _vote, options, onConfirmation) {
            return this.rocketDAONodeTrustedProposals.then(function (rocketDAONodeTrustedProposals) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedProposals.methods.vote(proposalID, _vote).send(options), onConfirmation);
            });
        }
        /**
         * Execute on an existing proposal
         * @param proposalID A number representing the proposalID
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const proposalID = 1;
         * const daoMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         *
         * const options = {
         *		from: daoMember,
         *		gas: 1000000
         * }
         * const txReceipt = rp.dao.node.trusted.proposals.execute(proposalID, vote, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "execute",
        value: function execute(proposalID, options, onConfirmation) {
            return this.rocketDAONodeTrustedProposals.then(function (rocketDAONodeTrustedProposals) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedProposals.methods.execute(proposalID).send(options), onConfirmation);
            });
        }
        /**
         * Cancel an existing proposal
         * @param proposalID A number representing the proposalID
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const proposalID = 1;
         * const daoMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         *
         * const options = {
         *		from: daoMember,
         *		gas: 1000000
         * }
         * const txReceipt = rp.dao.node.trusted.proposals.cancel(proposalID, vote, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "cancel",
        value: function cancel(proposalID, options, onConfirmation) {
            return this.rocketDAONodeTrustedProposals.then(function (rocketDAONodeTrustedProposals) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedProposals.methods.cancel(proposalID).send(options), onConfirmation);
            });
        }
    }, {
        key: "rocketDAONodeTrustedProposals",
        get: function get() {
            return this.contracts.get("rocketDAONodeTrustedProposals");
        }
    }]);

    return DAONodeTrustedProposals;
}();
// Exports


exports.default = DAONodeTrustedProposals;
//# sourceMappingURL=proposals.js.map