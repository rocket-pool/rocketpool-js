'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../utils/transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RocketGroupContract instance wrapper
 */
var GroupAccessorContract = function () {
    // Constructor
    function GroupAccessorContract(web3, contract) {
        _classCallCheck(this, GroupAccessorContract);

        this.web3 = web3;
        this.contract = contract;
    }
    /**
     * Mutators - Public
     */
    // Make a deposit


    _createClass(GroupAccessorContract, [{
        key: 'deposit',
        value: function deposit(durationId, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.deposit(durationId).send(options), onConfirmation);
        }
        // Refund a queued deposit

    }, {
        key: 'refundQueuedDeposit',
        value: function refundQueuedDeposit(durationId, depositId, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.depositRefundQueued(durationId, depositId).send(options), onConfirmation);
        }
        // Refund a deposit from a stalled minipool

    }, {
        key: 'refundStalledMinipoolDeposit',
        value: function refundStalledMinipoolDeposit(depositId, minipoolAddress, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.depositRefundMinipoolStalled(depositId, minipoolAddress).send(options), onConfirmation);
        }
        // Withdraw a deposit from a staking minipool

    }, {
        key: 'withdrawStakingMinipoolDeposit',
        value: function withdrawStakingMinipoolDeposit(depositId, minipoolAddress, weiAmount, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.depositWithdrawMinipoolStaking(depositId, minipoolAddress, weiAmount).send(options), onConfirmation);
        }
        // Withdraw a deposit from a withdrawn minipool

    }, {
        key: 'withdrawMinipoolDeposit',
        value: function withdrawMinipoolDeposit(depositId, minipoolAddress, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.depositWithdrawMinipool(depositId, minipoolAddress).send(options), onConfirmation);
        }
        // Set a deposit backup withdrawal address

    }, {
        key: 'setDepositBackupAddress',
        value: function setDepositBackupAddress(depositId, backupAddress, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.setDepositBackupWithdrawalAddress(depositId, backupAddress).send(options), onConfirmation);
        }
    }]);

    return GroupAccessorContract;
}();
// Exports


exports.default = GroupAccessorContract;
//# sourceMappingURL=group-accessor-contract.js.map