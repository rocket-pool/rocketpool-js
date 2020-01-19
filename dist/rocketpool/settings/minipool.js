'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool minipool settings manager
 */
var MinipoolSettings = function () {
    // Constructor
    function MinipoolSettings(web3, contracts) {
        _classCallCheck(this, MinipoolSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(MinipoolSettings, [{
        key: 'getMinipoolLaunchAmount',

        /**
         * Getters
         */
        // Get the total deposit amount required to launch a minipool in wei
        value: function getMinipoolLaunchAmount() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolLaunchAmount().call();
            });
        }
        // Get whether new minipools can currently be created

    }, {
        key: 'getMinipoolCanBeCreated',
        value: function getMinipoolCanBeCreated() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolCanBeCreated().call();
            });
        }
        // Get whether new minipool creation is currently allowed

    }, {
        key: 'getMinipoolNewEnabled',
        value: function getMinipoolNewEnabled() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolNewEnabled().call();
            });
        }
        // Get whether minipool closure is currently allowed

    }, {
        key: 'getMinipoolClosingEnabled',
        value: function getMinipoolClosingEnabled() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolClosingEnabled().call();
            });
        }
        // Get the maximum number of active minipools

    }, {
        key: 'getMinipoolMax',
        value: function getMinipoolMax() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolMax().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the minipool withdrawal fee payment address

    }, {
        key: 'getMinipoolWithdrawalFeeDepositAddress',
        value: function getMinipoolWithdrawalFeeDepositAddress() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolWithdrawalFeeDepositAddress().call();
            });
        }
        // Get the minipool timeout duration in seconds

    }, {
        key: 'getMinipoolTimeout',
        value: function getMinipoolTimeout() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolTimeout().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the maximum size of the active minipool set

    }, {
        key: 'getMinipoolActiveSetSize',
        value: function getMinipoolActiveSetSize() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolActiveSetSize().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the minipool staking durations

    }, {
        key: 'getMinipoolStakingDurations',
        value: function getMinipoolStakingDurations() {
            var _this = this;

            return this.getMinipoolStakingDurationCount().then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (di) {
                    return _this.getMinipoolStakingDurationAt(di);
                }));
            }).then(function (durationIds) {
                return Promise.all(durationIds.map(function (durationId) {
                    return _this.getMinipoolStakingDuration(durationId);
                }));
            });
        }
        // Get the details for a minipool staking duration

    }, {
        key: 'getMinipoolStakingDuration',
        value: function getMinipoolStakingDuration(id) {
            return Promise.all([this.getMinipoolStakingDurationExists(id), this.getMinipoolStakingDurationEpochs(id), this.getMinipoolStakingDurationEnabled(id)]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 3),
                    exists = _ref2[0],
                    epochs = _ref2[1],
                    enabled = _ref2[2];

                return { id: id, exists: exists, epochs: epochs, enabled: enabled };
            });
        }
        // Get the minipool staking duration count

    }, {
        key: 'getMinipoolStakingDurationCount',
        value: function getMinipoolStakingDurationCount() {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolStakingDurationCount().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get the minipool staking duration ID by index

    }, {
        key: 'getMinipoolStakingDurationAt',
        value: function getMinipoolStakingDurationAt(index) {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolStakingDurationAt(index).call();
            });
        }
        // Get whether a minipool staking duration exists

    }, {
        key: 'getMinipoolStakingDurationExists',
        value: function getMinipoolStakingDurationExists(id) {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolStakingDurationExists(id).call();
            });
        }
        // Get the number of epochs for a minipool staking duration

    }, {
        key: 'getMinipoolStakingDurationEpochs',
        value: function getMinipoolStakingDurationEpochs(id) {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolStakingDurationEpochs(id).call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        // Get whether a minipool staking duration is enabled

    }, {
        key: 'getMinipoolStakingDurationEnabled',
        value: function getMinipoolStakingDurationEnabled(id) {
            return this.rocketMinipoolSettings.then(function (rocketMinipoolSettings) {
                return rocketMinipoolSettings.methods.getMinipoolStakingDurationEnabled(id).call();
            });
        }
    }, {
        key: 'rocketMinipoolSettings',
        get: function get() {
            return this.contracts.get('rocketMinipoolSettings');
        }
    }]);

    return MinipoolSettings;
}();
// Exports


exports.default = MinipoolSettings;
//# sourceMappingURL=minipool.js.map