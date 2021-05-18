'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require('../../../../utils/transaction');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool DAO Trusted Node Actions
 */
var DAONodeTrustedActions = function () {
    // Constructor
    function DAONodeTrustedActions(web3, contracts) {
        _classCallCheck(this, DAONodeTrustedActions);

        this.web3 = web3;
        this.contracts = contracts;
    }
    // Contract accessors


    _createClass(DAONodeTrustedActions, [{
        key: 'actionJoin',

        /**
         * Getters
         */
        /**
         * Mutators - Public
         */
        // Join the DAO
        value: function actionJoin(options, onConfirmation) {
            return this.rocketDAONodeTrustedActions.then(function (rocketDAONodeTrustedActions) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedActions.methods.actionJoin().send(options), onConfirmation);
            });
        }
        // Leave the DAO

    }, {
        key: 'actionLeave',
        value: function actionLeave(refundAddress, options, onConfirmation) {
            return this.rocketDAONodeTrustedActions.then(function (rocketDAONodeTrustedActions) {
                return (0, _transaction.handleConfirmations)(rocketDAONodeTrustedActions.methods.actionLeave(refundAddress).send(options), onConfirmation);
            });
        }
    }, {
        key: 'rocketDAONodeTrustedActions',
        get: function get() {
            return this.contracts.get('rocketDAONodeTrustedActions');
        }
    }]);

    return DAONodeTrustedActions;
}();
// Exports


exports.default = DAONodeTrustedActions;
//# sourceMappingURL=actions.js.map