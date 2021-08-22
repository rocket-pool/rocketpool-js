"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Rocket Pool node settings manager
 */
var NodeSettings = (function () {
  // Constructor
  function NodeSettings(web3, contracts) {
    _classCallCheck(this, NodeSettings);

    this.web3 = web3;
    this.contracts = contracts;
  }
  // Contract accessors

  _createClass(NodeSettings, [
    {
      key: "getRegistrationEnabled",

      /**
       * Getters
       */
      // Node registrations are currently enabled
      value: function getRegistrationEnabled() {
        return this.rocketDAOProtocolSettingsNode.then(function (
          rocketDAOProtocolSettingsNode
        ) {
          return rocketDAOProtocolSettingsNode.methods
            .getRegistrationEnabled()
            .call();
        });
      },
      // Node deposits are currently enabled
    },
    {
      key: "getDepositEnabled",
      value: function getDepositEnabled() {
        return this.rocketDAOProtocolSettingsNode.then(function (
          rocketDAOProtocolSettingsNode
        ) {
          return rocketDAOProtocolSettingsNode.methods
            .getDepositEnabled()
            .call();
        });
      },
    },
    {
      key: "rocketDAOProtocolSettingsNode",
      get: function get() {
        return this.contracts.get("rocketDAOProtocolSettingsNode");
      },
    },
  ]);

  return NodeSettings;
})();
// Exports

exports.default = NodeSettings;
//# sourceMappingURL=node.js.map
