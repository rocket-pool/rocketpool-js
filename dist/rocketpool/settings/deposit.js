/**
 * Rocket Pool deposit settings manager
 */
class DepositSettings {
    // Constructor
    constructor(web3, contracts) {
        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors
    get rocketDepositSettings() {
        return this.contracts.get('rocketDepositSettings');
    }
    /**
     * Getters
     */
    // Get whether deposits are currently allowed
    getDepositAllowed() {
        return this.rocketDepositSettings.then((rocketDepositSettings) => {
            return rocketDepositSettings.methods.getDepositAllowed().call();
        });
    }
    // Get the deposit chunk size in wei
    getDepositChunkSize() {
        return this.rocketDepositSettings.then((rocketDepositSettings) => {
            return rocketDepositSettings.methods.getDepositChunkSize().call();
        });
    }
    // Get the minimum deposit amount in wei
    getDepositMin() {
        return this.rocketDepositSettings.then((rocketDepositSettings) => {
            return rocketDepositSettings.methods.getDepositMin().call();
        });
    }
    // Get the maximum deposit amount in wei
    getDepositMax() {
        return this.rocketDepositSettings.then((rocketDepositSettings) => {
            return rocketDepositSettings.methods.getDepositMax().call();
        });
    }
    // Get the maximum number of chunks assigned at once
    getChunkAssignMax() {
        return this.rocketDepositSettings.then((rocketDepositSettings) => {
            return rocketDepositSettings.methods.getChunkAssignMax().call();
        }).then((value) => parseInt(value));
    }
    // Get the maximum deposit queue size in wei
    getDepositQueueSizeMax() {
        return this.rocketDepositSettings.then((rocketDepositSettings) => {
            return rocketDepositSettings.methods.getDepositQueueSizeMax().call();
        });
    }
    // Get whether deposit refunds are currently allowed
    getRefundDepositAllowed() {
        return this.rocketDepositSettings.then((rocketDepositSettings) => {
            return rocketDepositSettings.methods.getRefundDepositAllowed().call();
        });
    }
    // Get whether withdrawals are currently allowed
    getWithdrawalAllowed() {
        return this.rocketDepositSettings.then((rocketDepositSettings) => {
            return rocketDepositSettings.methods.getWithdrawalAllowed().call();
        });
    }
    // Get the fee for withdrawing from the minipool while staking, as a fraction
    getStakingWithdrawalFeePerc() {
        return this.rocketDepositSettings.then((rocketDepositSettings) => {
            return rocketDepositSettings.methods.getStakingWithdrawalFeePerc().call();
        }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    // Get the current maximum deposit amount in wei
    getCurrentDepositMax(durationId) {
        return this.rocketDepositSettings.then((rocketDepositSettings) => {
            return rocketDepositSettings.methods.getCurrentDepositMax(durationId).call();
        });
    }
}
// Exports
export default DepositSettings;
//# sourceMappingURL=deposit.js.map