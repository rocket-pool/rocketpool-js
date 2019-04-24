/**
 * Rocket Pool deposit manager
 */
class Deposit {
    // Constructor
    constructor(web3, contracts) {
        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors
    get rocketDepositAPI() {
        return this.contracts.get('rocketDepositAPI');
    }
    /**
     * Getters
     */
    // Get a user's queued deposits
    getQueuedDeposits(groupId, userId, durationId) {
        return this.getQueuedDepositCount(groupId, userId, durationId).then((count) => {
            return Promise.all([...Array(count).keys()].map((di) => {
                return this.getQueuedDepositAt(groupId, userId, durationId, di);
            }));
        }).then((depositIds) => {
            return Promise.all([...Array(depositIds.length).keys()].map((di) => {
                return Promise.all([
                    depositIds[di],
                    this.getQueuedDepositBalance(depositIds[di]),
                ]);
            }));
        }).then((deposits) => {
            return deposits.map(([id, balance]) => ({ id, balance }));
        });
    }
    // Get a user's queued deposit count
    getQueuedDepositCount(groupId, userId, durationId) {
        return this.rocketDepositAPI.then((rocketDepositAPI) => {
            return rocketDepositAPI.methods.getUserQueuedDepositCount(groupId, userId, durationId).call();
        }).then((value) => parseInt(value));
    }
    // Get a user's queued deposit ID by index
    getQueuedDepositAt(groupId, userId, durationId, index) {
        return this.rocketDepositAPI.then((rocketDepositAPI) => {
            return rocketDepositAPI.methods.getUserQueuedDepositAt(groupId, userId, durationId, index).call();
        });
    }
    // Get the balance of a user's queued deposit by ID
    getQueuedDepositBalance(depositId) {
        return this.rocketDepositAPI.then((rocketDepositAPI) => {
            return rocketDepositAPI.methods.getUserQueuedDepositBalance(depositId).call();
        });
    }
}
// Exports
export default Deposit;
//# sourceMappingURL=deposit.js.map