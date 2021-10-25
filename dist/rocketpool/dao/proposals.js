"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool DAO Proposals
 */
var DAOProposal = function () {
    /**
     * Create a new DAOProposal instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function DAOProposal(web3, contracts) {
        _classCallCheck(this, DAOProposal);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketDAOProposal contract
     */


    _createClass(DAOProposal, [{
        key: "getTotal",

        /**
         * Return the total of DAO Proposals
         * @returns a Promise<number\> that resolves to a number representing if node registrations are enabled
         *
         * @example using Typescript
         * ```ts
         * const enabled = rp.dao.proposals.getTotal().then((val: number) => { val };
         * ```
         */
        value: function getTotal() {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getTotal().call();
            });
        }
        /**
         * Return the state of a DAO proposal
         * @param proposalID A number representing proposalID
         * @returns a Promise<number\> that resolves to a number representing the state of a DAO proposal
         *
         * @example using Typescript
         * ```ts
         * const proposalID = 5; // fictional proposal to invite user Kermit
         * const state = rp.dao.proposals.getState(proposalID).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getState",
        value: function getState(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getState(proposalID).call();
            });
        }
        /**
         * Return the number of votes for a specific DAO proposal
         * @param proposalID A number representing proposalID
         * @returns a Promise<number\> that resolves to a number representing the votes for a specific DAO proposal
         *
         * @example using Typescript
         * ```ts
         * const proposalID = 5; // fictional proposal to invite user Kermit
         * const voteFor = rp.dao.proposals.getVotesFor(proposalID).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getVotesFor",
        value: function getVotesFor(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getVotesFor(proposalID).call();
            });
        }
        /**
         * Return the number of votes required for a specific DAO proposal
         * @param proposalID A number representing proposalID
         * @returns a Promise<number\> that resolves to a number representing the votes required for a specific DAO proposal
         *
         * @example using Typescript
         * ```ts
         * const proposalID = 5; // fictional proposal to invite user Kermit
         * const votesRequired = rp.dao.proposals.getVotesRequired(proposalID).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getVotesRequired",
        value: function getVotesRequired(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getVotesRequired(proposalID).call();
            });
        }
        /**
         * Return the start block of this proposal
         * @param proposalID A number representing proposalID
         * @returns a Promise<number\> that resolves to a number representing the start block for the specific DAO proposal
         *
         * @example using Typescript
         * ```ts
         * const proposalID = 5; // fictional proposal to invite user Kermit
         * const state = rp.dao.proposals.getStart(proposalID).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getStart",
        value: function getStart(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getStart(proposalID).call();
            });
        }
        /**
         * Return the end block of this proposal
         * @param proposalID A number representing proposalID
         * @returns a Promise<number\> that resolves to a number representing the end block for the specific DAO proposal
         *
         * @example using Typescript
         * ```ts
         * const proposalID = 5; // fictional proposal to invite user Kermit
         * const state = rp.dao.proposals.getEnd(proposalID).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getEnd",
        value: function getEnd(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getEnd(proposalID).call();
            });
        }
        /**
         * Return the number of votes against a specific DAO proposal
         * @param proposalID A number representing proposalID
         * @returns a Promise<number\> that resolves to a number representing the votes against a specific DAO proposal
         *
         * @example using Typescript
         * ```ts
         * const proposalID = 5; // fictional proposal to invite user Kermit
         * const voteFor = rp.dao.proposals.getVotesAgainst(proposalID).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getVotesAgainst",
        value: function getVotesAgainst(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getVotesAgainst(proposalID).call();
            });
        }
        /**
         * Return the block a specific DAO proposal expires
         * @param proposalID A number representing proposalID
         * @returns a Promise<number\> that resolves to a number representing the block that a specific DAO proposal expires
         *
         * @example using Typescript
         * ```ts
         * const proposalID = 5; // fictional proposal to invite user Kermit
         * const state = rp.dao.proposals.getEnd(proposalID).then((val: number) => { val };
         * ```
         */

    }, {
        key: "getExpires",
        value: function getExpires(proposalID) {
            return this.rocketDAOProposal.then(function (rocketDAOProposal) {
                return rocketDAOProposal.methods.getExpires(proposalID).call();
            });
        }
    }, {
        key: "rocketDAOProposal",
        get: function get() {
            return this.contracts.get("rocketDAOProposal");
        }
    }]);

    return DAOProposal;
}();
// Exports


exports.default = DAOProposal;
//# sourceMappingURL=proposals.js.map