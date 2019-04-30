/**
 * Contract version set wrapper
 */
class ContractVersionSet {
    // Constructor
    constructor(contracts) {
        this.contracts = contracts;
    }
    /**
     * Getters
     */
    // Get past events from contract instances
    getPastEvents(eventName, options) {
        return Promise.all(this.contracts.map((contract) => contract.getPastEvents(eventName, options)))
            .then((eventLists) => eventLists.reduce((acc, val) => acc.concat(val), []));
    }
}
// Exports
export default ContractVersionSet;
//# sourceMappingURL=contract-version-set.js.map