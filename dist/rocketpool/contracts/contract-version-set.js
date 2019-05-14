"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Contract version set wrapper
 */
var ContractVersionSet = function () {
    // Constructor
    function ContractVersionSet(contracts) {
        _classCallCheck(this, ContractVersionSet);

        this.contracts = contracts;
    } // Oldest contract versions first
    /**
     * Getters
     */
    // Get the current version of the contract


    _createClass(ContractVersionSet, [{
        key: "current",
        value: function current() {
            return this.contracts[this.contracts.length - 1];
        }
        // Get the first version of the contract

    }, {
        key: "first",
        value: function first() {
            return this.contracts[0];
        }
        // Get the version of the contract at the specified version index

    }, {
        key: "at",
        value: function at(versionIndex) {
            return this.contracts[versionIndex - 1];
        }
        // Get past events from contract instances (oldest events first)

    }, {
        key: "getPastEvents",
        value: function getPastEvents(eventName, options) {
            return Promise.all(this.contracts.map(function (contract) {
                return contract.getPastEvents(eventName, options);
            })).then(function (eventLists) {
                return eventLists.reduce(function (acc, val) {
                    return acc.concat(val);
                }, []);
            });
        }
    }]);

    return ContractVersionSet;
}();
// Exports


exports.default = ContractVersionSet;
//# sourceMappingURL=contract-version-set.js.map