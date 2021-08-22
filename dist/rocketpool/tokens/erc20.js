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

var _transaction = require("../../utils/transaction");

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * ERC20 token contract
 */
var ERC20 = (function () {
  // Constructor
  function ERC20(web3, contracts, tokenContractName) {
    _classCallCheck(this, ERC20);

    this.web3 = web3;
    this.contracts = contracts;
    this.tokenContractName = tokenContractName;
  }
  // Contract accessor

  _createClass(ERC20, [
    {
      key: "balanceOf",

      /**
       * Getters
       */
      // Get the token balance of an account
      value: function balanceOf(account) {
        return this.tokenContract.then(function (tokenContract) {
          return tokenContract.methods.balanceOf(account).call();
        });
      },
      // Get the allowance of a spender for an account
    },
    {
      key: "allowance",
      value: function allowance(account, spender) {
        return this.tokenContract.then(function (tokenContract) {
          return tokenContract.methods.allowance(account, spender).call();
        });
      },
      /**
       * Mutators - Public
       */
      // Transfer tokens to a recipient
    },
    {
      key: "transfer",
      value: function transfer(to, amountWei, options, onConfirmation) {
        return this.tokenContract.then(function (tokenContract) {
          return (0,
          _transaction.handleConfirmations)(tokenContract.methods.transfer(to, amountWei).send(options), onConfirmation);
        });
      },
      // Approve an allowance for a spender
    },
    {
      key: "approve",
      value: function approve(spender, amountWei, options, onConfirmation) {
        return this.tokenContract.then(function (tokenContract) {
          return (0,
          _transaction.handleConfirmations)(tokenContract.methods.approve(spender, amountWei).send(options), onConfirmation);
        });
      },
      // Transfer tokens from an account to a recipient if approved
    },
    {
      key: "transferFrom",
      value: function transferFrom(
        from,
        to,
        amountWei,
        options,
        onConfirmation
      ) {
        return this.tokenContract.then(function (tokenContract) {
          return (0,
          _transaction.handleConfirmations)(tokenContract.methods.transferFrom(from, to, amountWei).send(options), onConfirmation);
        });
      },
    },
    {
      key: "tokenContract",
      get: function get() {
        return this.contracts.get(this.tokenContractName);
      },
    },
  ]);

  return ERC20;
})();
// Exports

exports.default = ERC20;
//# sourceMappingURL=erc20.js.map
