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
 * Rocket Pool deposit settings manager
 */
var AuctionSettings = (function () {
  // Constructor
  function AuctionSettings(web3, contracts) {
    _classCallCheck(this, AuctionSettings);

    this.web3 = web3;
    this.contracts = contracts;
  }
  // Contract accessors

  _createClass(AuctionSettings, [
    {
      key: "getLotMaximumEthValue",

      /**
       * Getters
       */
      // Return the Lot Maximum Eth Value Setting
      value: function getLotMaximumEthValue() {
        return this.rocketDAOProtocolSettingsAuction.then(function (
          rocketDAOProtocolSettingsAuction
        ) {
          return rocketDAOProtocolSettingsAuction.methods
            .getLotMaximumEthValue()
            .call();
        });
      },
      // Return the Lot Duration Setting
    },
    {
      key: "getLotDuration",
      value: function getLotDuration() {
        return this.rocketDAOProtocolSettingsAuction.then(function (
          rocketDAOProtocolSettingsAuction
        ) {
          return rocketDAOProtocolSettingsAuction.methods
            .getLotDuration()
            .call();
        });
      },
      // Return the Starting Price Ratio Setting
    },
    {
      key: "getStartingPriceRatio",
      value: function getStartingPriceRatio() {
        return this.rocketDAOProtocolSettingsAuction.then(function (
          rocketDAOProtocolSettingsAuction
        ) {
          return rocketDAOProtocolSettingsAuction.methods
            .getStartingPriceRatio()
            .call();
        });
      },
      // Return the Reserve Price Ratio Setting
    },
    {
      key: "getReservePriceRatio",
      value: function getReservePriceRatio() {
        return this.rocketDAOProtocolSettingsAuction.then(function (
          rocketDAOProtocolSettingsAuction
        ) {
          return rocketDAOProtocolSettingsAuction.methods
            .getReservePriceRatio()
            .call();
        });
      },
    },
    {
      key: "rocketDAOProtocolSettingsAuction",
      get: function get() {
        return this.contracts.get("rocketDAOProtocolSettingsAuction");
      },
    },
  ]);

  return AuctionSettings;
})();
// Exports

exports.default = AuctionSettings;
//# sourceMappingURL=auction.js.map
