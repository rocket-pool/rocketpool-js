'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool deposit manager
 */
var Deposit = function () {
    // Constructor
    function Deposit(web3, contracts) {
        _classCallCheck(this, Deposit);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(Deposit, [{
        key: 'getDeposits',

        /**
         * Getters
         */
        // Get a user's deposits
        value: function getDeposits(groupId, userId, durationId) {
            var _this = this;

            return this.getDepositCount(groupId, userId, durationId).then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (di) {
                    return _this.getDepositAt(groupId, userId, durationId, di);
                }));
            }).then(function (depositIds) {
                return Promise.all(depositIds.map(function (depositId) {
                    return _this.getDeposit(depositId);
                }));
            });
        }
        // Get a user's queued deposits

    }, {
        key: 'getQueuedDeposits',
        value: function getQueuedDeposits(groupId, userId, durationId) {
            var _this2 = this;

            return this.getQueuedDepositCount(groupId, userId, durationId).then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (di) {
                    return _this2.getQueuedDepositAt(groupId, userId, durationId, di);
                }));
            }).then(function (depositIds) {
                return Promise.all(depositIds.map(function (depositId) {
                    return _this2.getDeposit(depositId);
                }));
            });
        }
        // Get a deposit's details

    }, {
        key: 'getDeposit',
        value: function getDeposit(depositId) {
            return Promise.all([this.getDepositTotalAmount(depositId), this.getDepositQueuedAmount(depositId), this.getDepositStakingAmount(depositId), this.getDepositRefundedAmount(depositId), this.getDepositWithdrawnAmount(depositId), this.getDepositStakingPools(depositId), this.getDepositBackupAddress(depositId)]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 7),
                    totalAmount = _ref2[0],
                    queuedAmount = _ref2[1],
                    stakingAmount = _ref2[2],
                    refundedAmount = _ref2[3],
                    withdrawnAmount = _ref2[4],
                    pools = _ref2[5],
                    backupAddress = _ref2[6];

                return { id: depositId, totalAmount: totalAmount, queuedAmount: queuedAmount, stakingAmount: stakingAmount, refundedAmount: refundedAmount, withdrawnAmount: withdrawnAmount, pools: pools, backupAddress: backupAddress };
            });
        }
        // Get a deposit's staking minipools

    }, {
        key: 'getDepositStakingPools',
        value: function getDepositStakingPools(depositId) {
            var _this3 = this;

            return this.getDepositStakingPoolCount(depositId).then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (pi) {
                    return _this3.getDepositStakingPoolAt(depositId, pi);
                }));
            }).then(function (poolAddresses) {
                return Promise.all(poolAddresses.map(function (poolAddress) {
                    return Promise.all([poolAddress, _this3.getDepositStakingPoolAmount(depositId, poolAddress)]);
                }));
            }).then(function (pools) {
                return pools.map(function (_ref3) {
                    var _ref4 = _slicedToArray(_ref3, 2),
                        address = _ref4[0],
                        stakingAmount = _ref4[1];

                    return { address: address, stakingAmount: stakingAmount };
                });
            });
        }
        // Get a user's deposit count

    }, {
        key: 'getDepositCount',
        value: function getDepositCount(groupId, userId, durationId) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositCount(groupId, userId, durationId).call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get a user's deposit ID by index

    }, {
        key: 'getDepositAt',
        value: function getDepositAt(groupId, userId, durationId, index) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositAt(groupId, userId, durationId, index).call();
            });
        }
        // Get a user's queued deposit count

    }, {
        key: 'getQueuedDepositCount',
        value: function getQueuedDepositCount(groupId, userId, durationId) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserQueuedDepositCount(groupId, userId, durationId).call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get a user's queued deposit ID by index

    }, {
        key: 'getQueuedDepositAt',
        value: function getQueuedDepositAt(groupId, userId, durationId, index) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserQueuedDepositAt(groupId, userId, durationId, index).call();
            });
        }
        // Get the total amount of a user deposit

    }, {
        key: 'getDepositTotalAmount',
        value: function getDepositTotalAmount(depositId) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositTotalAmount(depositId).call();
            });
        }
        // Get the queued amount of a user deposit

    }, {
        key: 'getDepositQueuedAmount',
        value: function getDepositQueuedAmount(depositId) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositQueuedAmount(depositId).call();
            });
        }
        // Get the staking amount of a user deposit

    }, {
        key: 'getDepositStakingAmount',
        value: function getDepositStakingAmount(depositId) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositStakingAmount(depositId).call();
            });
        }
        // Get the refunded amount of a user deposit

    }, {
        key: 'getDepositRefundedAmount',
        value: function getDepositRefundedAmount(depositId) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositRefundedAmount(depositId).call();
            });
        }
        // Get the withdrawn amount of a user deposit

    }, {
        key: 'getDepositWithdrawnAmount',
        value: function getDepositWithdrawnAmount(depositId) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositWithdrawnAmount(depositId).call();
            });
        }
        // Get the number of minipools a user deposit is staking under

    }, {
        key: 'getDepositStakingPoolCount',
        value: function getDepositStakingPoolCount(depositId) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositStakingPoolCount(depositId).call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the address of a minipool a user deposit is staking under by index

    }, {
        key: 'getDepositStakingPoolAt',
        value: function getDepositStakingPoolAt(depositId, index) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositStakingPoolAt(depositId, index).call();
            });
        }
        // Get the amount of a user deposit staking under a minipool

    }, {
        key: 'getDepositStakingPoolAmount',
        value: function getDepositStakingPoolAmount(depositId, minipoolAddress) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositStakingPoolAmount(depositId, minipoolAddress).call();
            });
        }
        // Get the backup address for a user deposit

    }, {
        key: 'getDepositBackupAddress',
        value: function getDepositBackupAddress(depositId) {
            return this.rocketDepositIndex.then(function (rocketDepositIndex) {
                return rocketDepositIndex.methods.getUserDepositBackupAddress(depositId).call();
            }).then(function (value) {
                return value == '0x0000000000000000000000000000000000000000' ? null : value;
            });
        }
    }, {
        key: 'rocketDepositIndex',
        get: function get() {
            return this.contracts.get('rocketDepositIndex');
        }
    }]);

    return Deposit;
}();
// Exports


exports.default = Deposit;
//# sourceMappingURL=deposit.js.map