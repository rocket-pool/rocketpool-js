/**
 * Contract version set wrapper
 */
class ContractVersionSet {
    // Constructor
    constructor(contracts) {
        this.contracts = contracts;
    } // Oldest contract versions first
    /**
     * Getters
     */
    // Get the current version of the contract
    current() {
        return this.contracts[this.contracts.length - 1];
    }
    // Get the first version of the contract
    first() {
        return this.contracts[0];
    }
    // Get the version of the contract at the specified version index
    at(versionIndex) {
        return this.contracts[versionIndex - 1];
    }
    // Get past events from contract instances (oldest events first)
    getPastEvents(eventName, options) {
        return Promise.all(this.contracts.map((contract) => contract.getPastEvents(eventName, options)))
            .then((eventLists) => eventLists.reduce((acc, val) => acc.concat(val), []));
    }
}
// Exports
export default ContractVersionSet;
//# sourceMappingURL=contract-version-set.js.map