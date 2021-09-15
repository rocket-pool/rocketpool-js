"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _contract = require("../../utils/contract");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool contract manager
 */
var Contracts = function () {
    // Constructor
    function Contracts(web3, RocketStorage) {
        var _this = this;

        _classCallCheck(this, Contracts);

        this.web3 = web3;
        this.RocketStorage = RocketStorage;
        this.addresses = {};
        this.abis = {};
        this.contracts = {};
        // Initialise rocketStorage contract promise
        if (typeof RocketStorage === "string") {
            this.rocketStorage = Promise.resolve(new this.web3.eth.Contract(RocketStorageAbi, RocketStorage));
        } else {
            this.rocketStorage = this.web3.eth.net.getId().then(function (networkId) {
                return new _this.web3.eth.Contract(RocketStorage.abi, RocketStorage.networks[networkId].address);
            });
        }
    }

    _createClass(Contracts, [{
        key: "address",
        value: function address(name) {
            var _this2 = this;

            // Array mode
            if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "object") return Promise.all(name.map(function (n) {
                return _this2.address(n);
            }));
            // Use cached address promise
            if (this.addresses[name]) return this.addresses[name];
            // Load address
            this.addresses[name] = this.rocketStorage.then(function (rocketStorage) {
                return rocketStorage.methods.getAddress(_this2.web3.utils.soliditySha3("contract.address", name)).call();
            });
            // Return address promise
            return this.addresses[name];
        }
    }, {
        key: "abi",
        value: function abi(name) {
            var _this3 = this;

            // Array mode
            if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "object") return Promise.all(name.map(function (n) {
                return _this3.abi(n);
            }));
            // Use cached ABI promise
            if (this.abis[name]) return this.abis[name];
            // Load and decode ABI
            this.abis[name] = this.rocketStorage.then(function (rocketStorage) {
                return rocketStorage.methods.getString(_this3.web3.utils.soliditySha3("contract.abi", name)).call();
            }).then(function (abi) {
                return (0, _contract.decodeAbi)(abi);
            });
            // Return ABI promise
            return this.abis[name];
        }
    }, {
        key: "get",
        value: function get(name) {
            var _this4 = this;

            // Array mode
            if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === "object") return Promise.all(name.map(function (n) {
                return _this4.get(n);
            }));
            // Use cached contract promise
            if (this.contracts[name]) return this.contracts[name];
            // Load contract data and initialise
            this.contracts[name] = this.rocketStorage.then(function (rocketStorage) {
                return Promise.all([_this4.address(name), _this4.abi(name)]);
            }).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    address = _ref2[0],
                    abi = _ref2[1];

                return new _this4.web3.eth.Contract(abi, address);
            });
            // Return contract promise
            return this.contracts[name];
        }
        // Create a new contract instance with the specified ABI name and address

    }, {
        key: "make",
        value: function make(name, address) {
            var _this5 = this;

            return this.abi(name).then(function (abi) {
                return new _this5.web3.eth.Contract(abi, address);
            });
        }
    }]);

    return Contracts;
}();

var RocketStorageAbi = [{
    inputs: [{
        internalType: "bytes32",
        name: "_key",
        type: "bytes32"
    }],
    name: "getAddress",
    outputs: [{
        internalType: "address",
        name: "r",
        type: "address"
    }],
    stateMutability: "view",
    type: "function",
    constant: true
}, {
    inputs: [{
        internalType: "bytes32",
        name: "_key",
        type: "bytes32"
    }],
    name: "getString",
    outputs: [{
        internalType: "string",
        name: "",
        type: "string"
    }],
    stateMutability: "view",
    type: "function",
    constant: true
}];
// Exports
exports.default = Contracts;
//# sourceMappingURL=contracts.js.map