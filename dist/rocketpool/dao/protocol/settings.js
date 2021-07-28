'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool DAO Protocol Settings
 */
var DAOProtocolSettings = function () {
    // Constructor
    function DAOProtocolSettings(web3, contracts) {
        _classCallCheck(this, DAOProtocolSettings);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(DAOProtocolSettings, [{
        key: 'getRethDepositDelay',

        /**
         * Getters
         */
        // Get member id given an address
        value: function getRethDepositDelay() {
            return this.rocketDAOProtocolSettingsNetwork.then(function (rocketDAOProtocolSettingsNetwork) {
                return rocketDAOProtocolSettingsNetwork.methods.getRethDepositDelay().call();
            });
        }
    }, {
        key: 'rocketDAOProtocolSettings',
        get: function get() {
            return this.contracts.get('rocketDAOProtocolSettings');
        }
    }, {
        key: 'rocketDAOProtocolSettingsNetwork',
        get: function get() {
            return this.contracts.get('rocketDAOProtocolSettingsNetwork');
        }
    }]);

    return DAOProtocolSettings;
}();
// Exports


exports.default = DAOProtocolSettings;
//# sourceMappingURL=settings.js.map