"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RocketMinipool contract instance wrapper
 */
var MinipoolContract = function () {
    // Constructor
    function MinipoolContract(web3, contract) {
        _classCallCheck(this, MinipoolContract);

        this.web3 = web3;
        this.contract = contract;
    }
    /**
     * Getters - Node
     */
    // Get all node details


    _createClass(MinipoolContract, [{
        key: "getNodeDetails",
        value: function getNodeDetails() {
            return Promise.all([this.getNodeOwner(), this.getNodeContract(), this.getNodeDepositEth(), this.getNodeDepositRpl(), this.getNodeTrusted(), this.getNodeDepositExists(), this.getNodeBalance()]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 7),
                    owner = _ref2[0],
                    contract = _ref2[1],
                    depositEth = _ref2[2],
                    depositRpl = _ref2[3],
                    trusted = _ref2[4],
                    depositExists = _ref2[5],
                    balance = _ref2[6];

                return { owner: owner, contract: contract, depositEth: depositEth, depositRpl: depositRpl, trusted: trusted, depositExists: depositExists, balance: balance };
            });
        }
        // Get the node owner's address

    }, {
        key: "getNodeOwner",
        value: function getNodeOwner() {
            return this.contract.methods.getNodeOwner().call();
        }
        // Get the node contract address

    }, {
        key: "getNodeContract",
        value: function getNodeContract() {
            return this.contract.methods.getNodeContract().call();
        }
        // Get the amount of ETH to be deposited by the node owner in wei

    }, {
        key: "getNodeDepositEth",
        value: function getNodeDepositEth() {
            return this.contract.methods.getNodeDepositEther().call();
        }
        // Get the amount of RPL to be deposited by the node owner in wei

    }, {
        key: "getNodeDepositRpl",
        value: function getNodeDepositRpl() {
            return this.contract.methods.getNodeDepositRPL().call();
        }
        // Get whether the node was trusted when the minipool was created

    }, {
        key: "getNodeTrusted",
        value: function getNodeTrusted() {
            return this.contract.methods.getNodeTrusted().call();
        }
        // Get whether the node owner's deposit currently exists

    }, {
        key: "getNodeDepositExists",
        value: function getNodeDepositExists() {
            return this.contract.methods.getNodeDepositExists().call();
        }
        // Get the node owner's deposited ETH balance in wei

    }, {
        key: "getNodeBalance",
        value: function getNodeBalance() {
            return this.contract.methods.getNodeBalance().call();
        }
        /**
         * Getters - Deposits
         */
        // Get the number of deposits in the minipool

    }, {
        key: "getDepositCount",
        value: function getDepositCount() {
            return this.contract.methods.getDepositCount().call().then(function (value) {
                return parseInt(value);
            });
        }
        // Get all deposit details

    }, {
        key: "getDepositDetails",
        value: function getDepositDetails(depositId) {
            return Promise.all([this.getDepositExists(depositId), this.getDepositUserID(depositId), this.getDepositGroupID(depositId), this.getDepositBalance(depositId), this.getDepositStakingTokensWithdrawn(depositId)]).then(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 5),
                    exists = _ref4[0],
                    userId = _ref4[1],
                    groupId = _ref4[2],
                    balance = _ref4[3],
                    stakingTokensWithdrawn = _ref4[4];

                return { exists: exists, userId: userId, groupId: groupId, balance: balance, stakingTokensWithdrawn: stakingTokensWithdrawn };
            });
        }
        // Get whether a deposit exists in the minipool

    }, {
        key: "getDepositExists",
        value: function getDepositExists(depositId) {
            return this.contract.methods.getDepositExists(depositId).call();
        }
        // Get the user ID of a deposit

    }, {
        key: "getDepositUserID",
        value: function getDepositUserID(depositId) {
            return this.contract.methods.getDepositUserID(depositId).call();
        }
        // Get the group ID of a deposit

    }, {
        key: "getDepositGroupID",
        value: function getDepositGroupID(depositId) {
            return this.contract.methods.getDepositGroupID(depositId).call();
        }
        // Get the current balance of a deposit

    }, {
        key: "getDepositBalance",
        value: function getDepositBalance(depositId) {
            return this.contract.methods.getDepositBalance(depositId).call();
        }
        // Get the amount of RPB tokens withdrawn from a deposit while staking in wei

    }, {
        key: "getDepositStakingTokensWithdrawn",
        value: function getDepositStakingTokensWithdrawn(depositId) {
            return this.contract.methods.getDepositStakingTokensWithdrawn(depositId).call();
        }
        /**
         * Getters - Status
         */
        // Get all status details

    }, {
        key: "getStatusDetails",
        value: function getStatusDetails() {
            return Promise.all([this.getStatus(), this.getStatusChangedTime(), this.getStatusChangedBlock(), this.getStakingDurationId(), this.getStakingDuration(), this.getDepositInput(), this.getUserDepositCapacity(), this.getUserDepositTotal(), this.getStakingUserDepositsWithdrawn()]).then(function (_ref5) {
                var _ref6 = _slicedToArray(_ref5, 9),
                    status = _ref6[0],
                    statusChangedTime = _ref6[1],
                    statusChangedBlock = _ref6[2],
                    stakingDurationId = _ref6[3],
                    stakingDuration = _ref6[4],
                    depositInput = _ref6[5],
                    userDepositCapacity = _ref6[6],
                    userDepositTotal = _ref6[7],
                    stakingUserDepositsWithdrawn = _ref6[8];

                return {
                    status: status, statusChangedTime: statusChangedTime, statusChangedBlock: statusChangedBlock, stakingDurationId: stakingDurationId, stakingDuration: stakingDuration,
                    depositInput: depositInput, userDepositCapacity: userDepositCapacity, userDepositTotal: userDepositTotal, stakingUserDepositsWithdrawn: stakingUserDepositsWithdrawn
                };
            });
        }
        // Get the current minipool status

    }, {
        key: "getStatus",
        value: function getStatus() {
            return this.contract.methods.getStatus().call();
        }
        // Get the time the status was last updated

    }, {
        key: "getStatusChangedTime",
        value: function getStatusChangedTime() {
            return this.contract.methods.getStatusChangedTime().call().then(function (value) {
                return new Date(parseInt(value) * 1000);
            });
        }
        // Get the block the status was last updated at

    }, {
        key: "getStatusChangedBlock",
        value: function getStatusChangedBlock() {
            return this.contract.methods.getStatusChangedBlock().call().then(function (value) {
                return parseInt(value);
            });
        }
        // Get the minipool's staking duration ID

    }, {
        key: "getStakingDurationId",
        value: function getStakingDurationId() {
            return this.contract.methods.getStakingDurationID().call();
        }
        // Get the minipool's staking duration in blocks

    }, {
        key: "getStakingDuration",
        value: function getStakingDuration() {
            return this.contract.methods.getStakingDuration().call().then(function (value) {
                return parseInt(value);
            });
        }
        // Get the minipool's DepositInput data for submission to Casper

    }, {
        key: "getDepositInput",
        value: function getDepositInput() {
            return this.contract.methods.getDepositInput().call();
        }
        // Get the minipool's total capacity for user deposits in wei

    }, {
        key: "getUserDepositCapacity",
        value: function getUserDepositCapacity() {
            return this.contract.methods.getUserDepositCapacity().call();
        }
        // Get the total value of user deposits to the minipool in wei

    }, {
        key: "getUserDepositTotal",
        value: function getUserDepositTotal() {
            return this.contract.methods.getUserDepositTotal().call();
        }
        // Get the total value of user deposits withdrawn while staking in wei

    }, {
        key: "getStakingUserDepositsWithdrawn",
        value: function getStakingUserDepositsWithdrawn() {
            return this.contract.methods.getStakingUserDepositsWithdrawn().call();
        }
    }]);

    return MinipoolContract;
}();
// Exports


exports.default = MinipoolContract;
//# sourceMappingURL=minipool-contract.js.map