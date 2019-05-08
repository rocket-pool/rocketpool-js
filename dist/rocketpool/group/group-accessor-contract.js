import { handleConfirmations } from '../../utils/transaction';
/**
 * RocketGroupContract instance wrapper
 */
class GroupAccessorContract {
    // Constructor
    constructor(web3, contract) {
        this.web3 = web3;
        this.contract = contract;
    }
    /**
     * Mutators - Public
     */
    // Make a deposit
    deposit(durationId, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.deposit(durationId).send(options), onConfirmation);
    }
    // Refund a queued deposit
    refundQueuedDeposit(durationId, depositId, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.refundDepositQueued(durationId, depositId).send(options), onConfirmation);
    }
    // Refund a deposit from a stalled minipool
    refundStalledMinipoolDeposit(depositId, minipoolAddress, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.refundDepositMinipoolStalled(depositId, minipoolAddress).send(options), onConfirmation);
    }
    // Withdraw a deposit from a staking minipool
    withdrawStakingMinipoolDeposit(depositId, minipoolAddress, weiAmount, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.withdrawDepositMinipoolStaking(depositId, minipoolAddress, weiAmount).send(options), onConfirmation);
    }
    // Withdraw a deposit from a withdrawn minipool
    withdrawMinipoolDeposit(depositId, minipoolAddress, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.withdrawDepositMinipool(depositId, minipoolAddress).send(options), onConfirmation);
    }
    // Set a deposit backup withdrawal address
    setDepositBackupAddress(depositId, backupAddress, options, onConfirmation) {
        return handleConfirmations(this.contract.methods.setDepositBackupWithdrawalAddress(depositId, backupAddress).send(options), onConfirmation);
    }
}
// Exports
export default GroupAccessorContract;
//# sourceMappingURL=group-accessor-contract.js.map