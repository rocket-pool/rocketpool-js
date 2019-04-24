/**
 * Rocket Pool node settings manager
 */
class NodeSettings {
    // Constructor
    constructor(web3, contracts) {
        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors
    get rocketNodeSettings() {
        return this.contracts.get('rocketNodeSettings');
    }
    /**
     * Getters
     */
    // Get whether new node registration is currently allowed
    getNewAllowed() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getNewAllowed().call();
        });
    }
    // Get the minimum ether balance for a node to register in wei
    getEtherMin() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getEtherMin().call();
        });
    }
    // Get the gas price to be used for node checkins in wei
    getCheckinGasPrice() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getCheckinGasPrice().call();
        });
    }
    // Get whether nodes are automatically set as inactive
    getInactiveAutomatic() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getInactiveAutomatic().call();
        });
    }
    // Get the duration after which to set a node failing to check in as inactive, in seconds
    getInactiveDuration() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getInactiveDuration().call();
        }).then((value) => parseInt(value));
    }
    // Get the maximum number of other nodes to check for activity on checkin
    getMaxInactiveNodeChecks() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getMaxInactiveNodeChecks().call();
        }).then((value) => parseInt(value));
    }
    // Get the fee charged to users by node operators as a fraction
    getFeePerc() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getFeePerc().call();
        }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    // Get the maximum fee charged to users by node operators as a fraction
    getMaxFeePerc() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getMaxFeePerc().call();
        }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    // Get the fee voting cycle duration in seconds
    getFeeVoteCycleDuration() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getFeeVoteCycleDuration().call();
        }).then((value) => parseInt(value));
    }
    // Get the fee change per voting cycle as a fraction
    getFeeVoteCyclePercChange() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getFeeVoteCyclePercChange().call();
        }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    // Get whether node deposits are currently allowed
    getDepositAllowed() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getDepositAllowed().call();
        });
    }
    // Get the duration that a node deposit reservation is valid for in seconds
    getDepositReservationTime() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getDepositReservationTime().call();
        }).then((value) => parseInt(value));
    }
    // Get whether node withdrawals are currently allowed
    getWithdrawalAllowed() {
        return this.rocketNodeSettings.then((rocketNodeSettings) => {
            return rocketNodeSettings.methods.getWithdrawalAllowed().call();
        });
    }
}
// Exports
export default NodeSettings;
//# sourceMappingURL=node.js.map