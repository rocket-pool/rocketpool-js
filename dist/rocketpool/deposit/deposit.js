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
    get rocketDepositIndex() {
        return this.contracts.get('rocketDepositIndex');
    }
    /**
     * Getters
     */
    // Get a user's deposits
    getDeposits(groupId, userId, durationId) {
        return this.getDepositCount(groupId, userId, durationId).then((count) => {
            return Promise.all([...Array(count).keys()].map((di) => {
                return this.getDepositAt(groupId, userId, durationId, di);
            }));
        }).then((depositIds) => {
            return Promise.all(depositIds.map((depositId) => this.getDeposit(depositId)));
        });
    }
    // Get a user's queued deposits
    getQueuedDeposits(groupId, userId, durationId) {
        return this.getQueuedDepositCount(groupId, userId, durationId).then((count) => {
            return Promise.all([...Array(count).keys()].map((di) => {
                return this.getQueuedDepositAt(groupId, userId, durationId, di);
            }));
        }).then((depositIds) => {
            return Promise.all(depositIds.map((depositId) => this.getDeposit(depositId)));
        });
    }
    // Get a deposit's details
    getDeposit(depositId) {
        return Promise.all([
            this.getDepositTotalAmount(depositId),
            this.getDepositQueuedAmount(depositId),
            this.getDepositStakingAmount(depositId),
            this.getDepositRefundedAmount(depositId),
            this.getDepositWithdrawnAmount(depositId),
            this.getDepositStakingPools(depositId),
            this.getDepositBackupAddress(depositId),
        ]).then(([totalAmount, queuedAmount, stakingAmount, refundedAmount, withdrawnAmount, pools, backupAddress]) => {
            return { id: depositId, totalAmount, queuedAmount, stakingAmount, refundedAmount, withdrawnAmount, pools, backupAddress };
        });
    }
    // Get a deposit's staking minipools
    getDepositStakingPools(depositId) {
        return this.getDepositStakingPoolCount(depositId).then((count) => {
            return Promise.all([...Array(count).keys()].map((pi) => {
                return this.getDepositStakingPoolAt(depositId, pi);
            }));
        }).then((poolAddresses) => {
            return Promise.all(poolAddresses.map((poolAddress) => {
                return Promise.all([poolAddress, this.getDepositStakingPoolAmount(depositId, poolAddress)]);
            }));
        }).then((pools) => {
            return pools.map(([address, stakingAmount]) => ({ address, stakingAmount }));
        });
    }
    // Get a user's deposit count
    getDepositCount(groupId, userId, durationId) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositCount(groupId, userId, durationId).call();
        }).then((value) => parseInt(value));
    }
    // Get a user's deposit ID by index
    getDepositAt(groupId, userId, durationId, index) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositAt(groupId, userId, durationId, index).call();
        });
    }
    // Get a user's queued deposit count
    getQueuedDepositCount(groupId, userId, durationId) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserQueuedDepositCount(groupId, userId, durationId).call();
        }).then((value) => parseInt(value));
    }
    // Get a user's queued deposit ID by index
    getQueuedDepositAt(groupId, userId, durationId, index) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserQueuedDepositAt(groupId, userId, durationId, index).call();
        });
    }
    // Get the total amount of a user deposit
    getDepositTotalAmount(depositId) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositTotalAmount(depositId).call();
        });
    }
    // Get the queued amount of a user deposit
    getDepositQueuedAmount(depositId) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositQueuedAmount(depositId).call();
        });
    }
    // Get the staking amount of a user deposit
    getDepositStakingAmount(depositId) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositStakingAmount(depositId).call();
        });
    }
    // Get the refunded amount of a user deposit
    getDepositRefundedAmount(depositId) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositRefundedAmount(depositId).call();
        });
    }
    // Get the withdrawn amount of a user deposit
    getDepositWithdrawnAmount(depositId) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositWithdrawnAmount(depositId).call();
        });
    }
    // Get the number of minipools a user deposit is staking under
    getDepositStakingPoolCount(depositId) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositStakingPoolCount(depositId).call();
        }).then((value) => parseInt(value));
    }
    // Get the address of a minipool a user deposit is staking under by index
    getDepositStakingPoolAt(depositId, index) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositStakingPoolAt(depositId, index).call();
        });
    }
    // Get the amount of a user deposit staking under a minipool
    getDepositStakingPoolAmount(depositId, minipoolAddress) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositStakingPoolAmount(depositId, minipoolAddress).call();
        });
    }
    // Get the backup address for a user deposit
    getDepositBackupAddress(depositId) {
        return this.rocketDepositIndex.then((rocketDepositIndex) => {
            return rocketDepositIndex.methods.getUserDepositBackupAddress(depositId).call();
        }).then((value) => (value == '0x0000000000000000000000000000000000000000') ? null : value);
    }
}
// Exports
export default Deposit;
//# sourceMappingURL=deposit.js.map