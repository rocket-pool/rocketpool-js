/**
 * Rocket Pool group settings manager
 */
class GroupSettings {
    // Constructor
    constructor(web3, contracts) {
        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors
    get rocketGroupSettings() {
        return this.contracts.get('rocketGroupSettings');
    }
    /**
     * Getters
     */
    // Get the default fee charged to the group's users by Rocket Pool as a fraction
    getDefaultFee() {
        return this.rocketGroupSettings.then((rocketGroupSettings) => {
            return rocketGroupSettings.methods.getDefaultFee().call();
        }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    // Get the maximum fee charged to the group's users by Rocket Pool as a fraction
    getMaxFee() {
        return this.rocketGroupSettings.then((rocketGroupSettings) => {
            return rocketGroupSettings.methods.getMaxFee().call();
        }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    // Get whether new group registration is currently allowed
    getNewAllowed() {
        return this.rocketGroupSettings.then((rocketGroupSettings) => {
            return rocketGroupSettings.methods.getNewAllowed().call();
        });
    }
    // Get the group registration fee in wei
    getNewFee() {
        return this.rocketGroupSettings.then((rocketGroupSettings) => {
            return rocketGroupSettings.methods.getNewFee().call();
        });
    }
    // Get the group registration fee payment address
    getNewFeeAddress() {
        return this.rocketGroupSettings.then((rocketGroupSettings) => {
            return rocketGroupSettings.methods.getNewFeeAddress().call();
        });
    }
}
// Exports
export default GroupSettings;
//# sourceMappingURL=group.js.map