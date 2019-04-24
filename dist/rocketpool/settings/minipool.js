/**
 * Rocket Pool minipool settings manager
 */
class MinipoolSettings {
    // Constructor
    constructor(web3, contracts) {
        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors
    get rocketMinipoolSettings() {
        return this.contracts.get('rocketMinipoolSettings');
    }
    /**
     * Getters
     */
    // Get the total deposit amount required to launch a minipool in wei
    getMinipoolLaunchAmount() {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
            return rocketMinipoolSettings.methods.getMinipoolLaunchAmount().call();
        });
    }
    // Get whether new minipools can currently be created
    getMinipoolCanBeCreated() {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
            return rocketMinipoolSettings.methods.getMinipoolCanBeCreated().call();
        });
    }
    // Get whether new minipool creation is currently allowed
    getMinipoolNewEnabled() {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
            return rocketMinipoolSettings.methods.getMinipoolNewEnabled().call();
        });
    }
    // Get whether minipool closure is currently allowed
    getMinipoolClosingEnabled() {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
            return rocketMinipoolSettings.methods.getMinipoolClosingEnabled().call();
        });
    }
    // Get the maximum number of active minipools
    getMinipoolMax() {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
            return rocketMinipoolSettings.methods.getMinipoolMax().call();
        }).then((value) => parseInt(value));
    }
    // Get the minipool withdrawal fee payment address
    getMinipoolWithdrawalFeeDepositAddress() {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
            return rocketMinipoolSettings.methods.getMinipoolWithdrawalFeeDepositAddress().call();
        });
    }
    // Get the minipool timeout duration in seconds
    getMinipoolTimeout() {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
            return rocketMinipoolSettings.methods.getMinipoolTimeout().call();
        }).then((value) => parseInt(value));
    }
    // Get the maximum size of the active minipool set
    getMinipoolActiveSetSize() {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
            return rocketMinipoolSettings.methods.getMinipoolActiveSetSize().call();
        }).then((value) => parseInt(value));
    }
    // Get the minipool staking duration by ID in blocks
    getMinipoolStakingDuration(durationId) {
        return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
            return rocketMinipoolSettings.methods.getMinipoolStakingDuration(durationId).call();
        }).then((value) => parseInt(value));
    }
}
// Exports
export default MinipoolSettings;
//# sourceMappingURL=minipool.js.map