'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool group settings manager
 */
var GroupSettings = function () {
    // Constructor
    function GroupSettings(web3, contracts) {
        _classCallCheck(this, GroupSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(GroupSettings, [{
        key: 'getDefaultFee',

        /**
         * Getters
         */
        // Get the default fee charged to the group's users by Rocket Pool as a fraction
        value: function getDefaultFee() {
            var _this = this;

            return this.rocketGroupSettings.then(function (rocketGroupSettings) {
                return rocketGroupSettings.methods.getDefaultFee().call();
            }).then(function (value) {
                return parseFloat(_this.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get the maximum fee charged to the group's users by Rocket Pool as a fraction

    }, {
        key: 'getMaxFee',
        value: function getMaxFee() {
            var _this2 = this;

            return this.rocketGroupSettings.then(function (rocketGroupSettings) {
                return rocketGroupSettings.methods.getMaxFee().call();
            }).then(function (value) {
                return parseFloat(_this2.web3.utils.fromWei(value, 'ether'));
            });
        }
        // Get whether new group registration is currently allowed

    }, {
        key: 'getNewAllowed',
        value: function getNewAllowed() {
            return this.rocketGroupSettings.then(function (rocketGroupSettings) {
                return rocketGroupSettings.methods.getNewAllowed().call();
            });
        }
        // Get the group registration fee in wei

    }, {
        key: 'getNewFee',
        value: function getNewFee() {
            return this.rocketGroupSettings.then(function (rocketGroupSettings) {
                return rocketGroupSettings.methods.getNewFee().call();
            });
        }
        // Get the group registration fee payment address

    }, {
        key: 'getNewFeeAddress',
        value: function getNewFeeAddress() {
            return this.rocketGroupSettings.then(function (rocketGroupSettings) {
                return rocketGroupSettings.methods.getNewFeeAddress().call();
            });
        }
    }, {
        key: 'rocketGroupSettings',
        get: function get() {
            return this.contracts.get('rocketGroupSettings');
        }
    }]);

    return GroupSettings;
}();
// Exports


exports.default = GroupSettings;
//# sourceMappingURL=group.js.map