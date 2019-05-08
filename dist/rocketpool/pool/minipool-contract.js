/**
 * RocketMinipool contract instance wrapper
 */
class MinipoolContract {
    // Constructor
    constructor(web3, contract) {
        this.web3 = web3;
        this.contract = contract;
    }
    /**
     * Getters - Node
     */
    // Get all node details
    getNodeDetails() {
        return Promise.all([
            this.getNodeOwner(),
            this.getNodeContract(),
            this.getNodeDepositEth(),
            this.getNodeDepositRpl(),
            this.getNodeTrusted(),
            this.getNodeDepositExists(),
            this.getNodeBalance(),
        ]).then(([owner, contract, depositEth, depositRpl, trusted, depositExists, balance]) => {
            return { owner, contract, depositEth, depositRpl, trusted, depositExists, balance };
        });
    }
    // Get the node owner's address
    getNodeOwner() {
        return this.contract.methods.getNodeOwner().call();
    }
    // Get the node contract address
    getNodeContract() {
        return this.contract.methods.getNodeContract().call();
    }
    // Get the amount of ETH to be deposited by the node owner in wei
    getNodeDepositEth() {
        return this.contract.methods.getNodeDepositEther().call();
    }
    // Get the amount of RPL to be deposited by the node owner in wei
    getNodeDepositRpl() {
        return this.contract.methods.getNodeDepositRPL().call();
    }
    // Get whether the node was trusted when the minipool was created
    getNodeTrusted() {
        return this.contract.methods.getNodeTrusted().call();
    }
    // Get whether the node owner's deposit currently exists
    getNodeDepositExists() {
        return this.contract.methods.getNodeDepositExists().call();
    }
    // Get the node owner's deposited ETH balance in wei
    getNodeBalance() {
        return this.contract.methods.getNodeBalance().call();
    }
    /**
     * Getters - Deposits
     */
    // Get the number of deposits in the minipool
    getDepositCount() {
        return this.contract.methods.getDepositCount().call().then((value) => parseInt(value));
    }
    // Get all deposit details
    getDepositDetails(depositId) {
        return Promise.all([
            this.getDepositExists(depositId),
            this.getDepositUserID(depositId),
            this.getDepositGroupID(depositId),
            this.getDepositBalance(depositId),
            this.getDepositStakingTokensWithdrawn(depositId),
        ]).then(([exists, userId, groupId, balance, stakingTokensWithdrawn]) => {
            return { exists, userId, groupId, balance, stakingTokensWithdrawn };
        });
    }
    // Get whether a deposit exists in the minipool
    getDepositExists(depositId) {
        return this.contract.methods.getDepositExists(depositId).call();
    }
    // Get the user ID of a deposit
    getDepositUserID(depositId) {
        return this.contract.methods.getDepositUserID(depositId).call();
    }
    // Get the group ID of a deposit
    getDepositGroupID(depositId) {
        return this.contract.methods.getDepositGroupID(depositId).call();
    }
    // Get the current balance of a deposit
    getDepositBalance(depositId) {
        return this.contract.methods.getDepositBalance(depositId).call();
    }
    // Get the amount of RPB tokens withdrawn from a deposit while staking in wei
    getDepositStakingTokensWithdrawn(depositId) {
        return this.contract.methods.getDepositStakingTokensWithdrawn(depositId).call();
    }
    /**
     * Getters - Status
     */
    // Get all status details
    getStatusDetails() {
        return Promise.all([
            this.getStatus(),
            this.getStatusChangedTime(),
            this.getStatusChangedBlock(),
            this.getStakingDurationId(),
            this.getStakingDuration(),
            this.getDepositInput(),
            this.getUserDepositCapacity(),
            this.getUserDepositTotal(),
            this.getStakingUserDepositsWithdrawn(),
        ]).then(([status, statusChangedTime, statusChangedBlock, stakingDurationId, stakingDuration, depositInput, userDepositCapacity, userDepositTotal, stakingUserDepositsWithdrawn]) => {
            return {
                status, statusChangedTime, statusChangedBlock, stakingDurationId, stakingDuration,
                depositInput, userDepositCapacity, userDepositTotal, stakingUserDepositsWithdrawn
            };
        });
    }
    // Get the current minipool status
    getStatus() {
        return this.contract.methods.getStatus().call();
    }
    // Get the time the status was last updated
    getStatusChangedTime() {
        return this.contract.methods.getStatusChangedTime().call().then((value) => new Date(parseInt(value) * 1000));
    }
    // Get the block the status was last updated at
    getStatusChangedBlock() {
        return this.contract.methods.getStatusChangedBlock().call().then((value) => parseInt(value));
    }
    // Get the minipool's staking duration ID
    getStakingDurationId() {
        return this.contract.methods.getStakingDurationID().call();
    }
    // Get the minipool's staking duration in blocks
    getStakingDuration() {
        return this.contract.methods.getStakingDuration().call().then((value) => parseInt(value));
    }
    // Get the minipool's DepositInput data for submission to Casper
    getDepositInput() {
        return this.contract.methods.getDepositInput().call();
    }
    // Get the minipool's total capacity for user deposits in wei
    getUserDepositCapacity() {
        return this.contract.methods.getUserDepositCapacity().call();
    }
    // Get the total value of user deposits to the minipool in wei
    getUserDepositTotal() {
        return this.contract.methods.getUserDepositTotal().call();
    }
    // Get the total value of user deposits withdrawn while staking in wei
    getStakingUserDepositsWithdrawn() {
        return this.contract.methods.getStakingUserDepositsWithdrawn().call();
    }
}
// Exports
export default MinipoolContract;
//# sourceMappingURL=minipool-contract.js.map