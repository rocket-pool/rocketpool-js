import { handleConfirmations } from '../../utils/transaction';
/**
 * RocketGroupContract instance wrapper
 */
class GroupContract {
    // Constructor
    constructor(web3, contract) {
        this.web3 = web3;
        this.contract = contract;
    }
    /**
     * Getters
     */
    // Get all group details
    getDetails() {
        return Promise.all([
            this.getOwner(),
            this.getGroupFee(),
            this.getRocketPoolFee(),
            this.getGroupFeeAddress(),
        ]).then(([owner, groupFee, rocketPoolFee, groupFeeAddress]) => {
            return { owner, groupFee, rocketPoolFee, groupFeeAddress };
        });
    }
    // Get the group owner
    getOwner() {
        return this.contract.methods.getOwner().call();
    }
    // Get the fee charged to the group's users by the group as a fraction
    getGroupFee() {
        return this.contract.methods.getFeePerc().call().then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    // Get the fee charged to the group's users by Rocket Pool as a fraction
    getRocketPoolFee() {
        return this.contract.methods.getFeePercRocketPool().call().then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    // Get the address group fees are sent to
    getGroupFeeAddress() {
        return this.contract.methods.getFeeAddress().call();
    }
    /**
     * Mutators - Restricted to the group owner address
     */
    // Set the fee charged to the group's users by the group
    setGroupFee(feeFraction, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.setFeePerc(this.web3.utils.toWei(feeFraction.toString(), 'ether')).send(options), onConfirmation);
    }
    // Set the address group fees are sent to
    setGroupFeeAddress(address, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.setFeeAddress(address).send(options), onConfirmation);
    }
    // Add a depositor contract to the group
    addDepositor(address, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.addDepositor(address).send(options), onConfirmation);
    }
    // Remove a depositor contract from the group
    removeDepositor(address, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.removeDepositor(address).send(options), onConfirmation);
    }
    // Add a withdrawer contract to the group
    addWithdrawer(address, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.addWithdrawer(address).send(options), onConfirmation);
    }
    // Remove a withdrawer contract from the group
    removeWithdrawer(address, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.removeWithdrawer(address).send(options), onConfirmation);
    }
}
// Exports
export default GroupContract;
//# sourceMappingURL=group-contract.js.map