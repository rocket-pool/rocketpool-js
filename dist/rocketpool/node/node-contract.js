import { handleConfirmations } from '../../utils/transaction';
/**
 * RocketNodeContract instance wrapper
 */
class NodeContract {
    // Constructor
    constructor(web3, contract) {
        this.web3 = web3;
        this.contract = contract;
    }
    /**
     * Getters
     */
    // Get all node details
    getDetails() {
        return Promise.all([
            this.getOwner(),
            this.getRewardsAddress(),
            this.getEthBalance(),
            this.getRplBalance(),
            this.getHasDepositReservation(),
        ]).then(([owner, rewardsAddress, ethBalance, rplBalance, hasDepositReservation]) => {
            return { owner, rewardsAddress, ethBalance, rplBalance, hasDepositReservation };
        });
    }
    // Get all node deposit reservation details
    getDepositReservation() {
        return Promise.all([
            this.getDepositReservationCreated(),
            this.getDepositReservationEthRequired(),
            this.getDepositReservationRplRequired(),
            this.getDepositReservationDurationId(),
            this.getDepositReservationDepositInput(),
        ]).then(([created, etherRequired, rplRequired, durationId, depositInput]) => {
            return { created, etherRequired, rplRequired, durationId, depositInput };
        });
    }
    // Get the node owner
    getOwner() {
        return this.contract.methods.getOwner().call();
    }
    // Get the node's rewards address
    getRewardsAddress() {
        return this.contract.methods.getRewardsAddress().call();
    }
    // Get the node's current ETH balance in wei
    getEthBalance() {
        return this.contract.methods.getBalanceETH().call();
    }
    // Get the node's current RPL balance in wei
    getRplBalance() {
        return this.contract.methods.getBalanceRPL().call();
    }
    // Check whether the node has an existing deposit reservation
    getHasDepositReservation() {
        return this.contract.methods.getHasDepositReservation().call();
    }
    // Get the deposit reservation created time
    getDepositReservationCreated() {
        return this.contract.methods.getDepositReservedTime().call().then((value) => new Date(parseInt(value) * 1000));
    }
    // Get the deposit reservation ETH requirement in wei
    getDepositReservationEthRequired() {
        return this.contract.methods.getDepositReserveEtherRequired().call();
    }
    // Get the deposit reservation RPL requirement in wei
    getDepositReservationRplRequired() {
        return this.contract.methods.getDepositReserveRPLRequired().call();
    }
    // Get the deposit reservation duration ID
    getDepositReservationDurationId() {
        return this.contract.methods.getDepositReserveDurationID().call();
    }
    // Get the deposit reservation DepositInput data
    getDepositReservationDepositInput() {
        return this.contract.methods.getDepositReserveDepositInput().call();
    }
    /**
     * Mutators - Restricted to the node owner address
     */
    // Set the node's rewards address
    setRewardsAddress(address, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.setRewardsAddress(address).send(options), onConfirmation);
    }
    // Make a deposit reservation
    reserveDeposit(durationId, depositInput, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.depositReserve(durationId, depositInput).send(options), onConfirmation);
    }
    // Cancel a deposit reservation
    cancelDepositReservation(options, onConfirmation) {
        return handleConfirmations(this.contract.methods.depositReserveCancel().send(options), onConfirmation);
    }
    // Can complete a deposit
    completeDeposit(options, onConfirmation) {
        return handleConfirmations(this.contract.methods.deposit().send(options), onConfirmation);
    }
    // Withdraw a deposit from an initialised, timed out or withdrawn minipool
    withdrawMinipoolDeposit(minipoolAddress, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.withdrawMinipoolDeposit(minipoolAddress).send(options), onConfirmation);
    }
    // Withdraw ETH from the node contract
    withdrawEth(weiAmount, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.withdrawEther(weiAmount).send(options), onConfirmation);
    }
    // Withdraw RPL from the node contract
    withdrawRpl(weiAmount, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.withdrawRPL(weiAmount).send(options), onConfirmation);
    }
}
// Exports
export default NodeContract;
//# sourceMappingURL=node-contract.js.map