"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../utils/transaction");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Node Manager
 */
var Node = function () {
    /**
     * Create a new Node instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function Node(web3, contracts) {
        _classCallCheck(this, Node);

        this.web3 = web3;
        this.contracts = contracts;
    }
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeDeposit contract
     */


    _createClass(Node, [{
        key: "getNodes",

        /**
         * Get an array of Node Details
         * @returns a Promise<NodeDetails[]\> that resolves to an array of NodeDetails
         *
         * @example using Typescript
         * ```ts
         * const nodes = rp.node.getNodes().then((val: string) => { val };
         * ```
         */
        value: function getNodes() {
            var _this = this;

            return this.getNodeAddresses().then(function (addresses) {
                return Promise.all(addresses.map(function (address) {
                    return _this.getNodeDetails(address);
                }));
            });
        }
        /**
         * Get an array of node addresses
         * @returns a Promise<string[]\> that resolves to an array of node addresses
         *
         * @example using Typescript
         * ```ts
         * const addresses = rp.node.getNodesAddresses().then((val: string[]) => { val };
         * ```
         */

    }, {
        key: "getNodeAddresses",
        value: function getNodeAddresses() {
            var _this2 = this;

            return this.getNodeCount().then(function (count) {
                return Promise.all([].concat(_toConsumableArray(Array(count).keys())).map(function (index) {
                    return _this2.getNodeAt(index);
                }));
            });
        }
        /**
         * Get a node's details
         * @param address A string representing a node address
         * @returns a Promise<NodeDetails\> that resolves to a NodeDetails object
         *
         * @example using Typescript
         * ```ts
         * const nodeDetail = rp.node.getNodeDetails("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: NodeDetails) => { val }
         * ```
         */

    }, {
        key: "getNodeDetails",
        value: function getNodeDetails(address) {
            return Promise.all([this.getNodeExists(address), this.getNodeTimezoneLocation(address)]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    exists = _ref2[0],
                    timezoneLocation = _ref2[1];

                return {
                    address: address,
                    exists: exists,
                    timezoneLocation: timezoneLocation
                };
            });
        }
        /**
         * Get the total node count
         * @returns a Promise<number\> that resolves to a number representing the quantity of total nodes
         *
         * @example using Typescript
         * ```ts
         * const nodeCount = rp.node.getNodeCount().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getNodeCount",
        value: function getNodeCount() {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getNodeCount().call();
            }).then(function (value) {
                return parseInt(value);
            });
        }
        /**
         * Get a node address by index
         * @param index A number representing the index of the node
         * @returns a Promise<string\> that resolves to a string representing a node address
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = rp.node.getNodeAt(5).then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeAt",
        value: function getNodeAt(index) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getNodeAt(index).call();
            });
        }
        /**
         * Check whether a node exists
         * @param address A string representing a node address
         * @returns a Promise<boolean\> that resolves to a boolean representing whether the node exists or not
         *
         * @example using Typescript
         * ```ts
         * const exists = rp.node.getNodeExists("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getNodeExists",
        value: function getNodeExists(address) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getNodeExists(address).call();
            });
        }
        /**
         * Get a node's timezone location
         * @param address A string representing a node address
         * @returns a Promise<string\> that resolves to a string representing the node's timezone
         *
         * @example using Typescript
         * ```ts
         * const tz = rp.node.getNodeTimezoneLocation("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeTimezoneLocation",
        value: function getNodeTimezoneLocation(address) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getNodeTimezoneLocation(address).call();
            });
        }
        /**
         * Get a node's withdrawal address
         * @param address A string representing a node address
         * @returns a Promise<string\> that resolves to a string representing the node's withdrawal address
         *
         * @example using Typescript
         * ```ts
         * const withdrawalAddress = rp.node.getNodeWithdrawalAddress("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeWithdrawalAddress",
        value: function getNodeWithdrawalAddress(address) {
            return this.rocketStorage.then(function (rocketStorage) {
                return rocketStorage.methods.getNodeWithdrawalAddress(address).call();
            });
        }
        /**
         * Get a node's RPL stake
         * @param address A string representing a node address
         * @returns a Promise<string\> that resolves to a string representing the node's RPL stake
         *
         * @example using Typescript
         * ```ts
         * const nodeRPLStake = rp.node.getNodeRPLStake("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeRPLStake",
        value: function getNodeRPLStake(address) {
            return this.rocketNodeStaking.then(function (rocketNodeStaking) {
                return rocketNodeStaking.methods.getNodeRPLStake(address).call();
            });
        }
        /**
         * Get a node's effective RPL stake
         * @param address A string representing a node address
         * @returns a Promise<string\> that resolves to a string representing the node's effective RPL stake
         *
         * @example using Typescript
         * ```ts
         * const nodeEffectiveRPLStake = rp.node.getNodeEffectiveRPLStake("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeEffectiveRPLStake",
        value: function getNodeEffectiveRPLStake(address) {
            return this.rocketNodeStaking.then(function (rocketNodeStaking) {
                return rocketNodeStaking.methods.getNodeEffectiveRPLStake(address).call();
            });
        }
        /**
         * Get the node minipool limit
         * @param address A string representing a node address
         * @returns a Promise<string\> that resolves to a string representing the node minipool limit
         *
         * @example using Typescript
         * ```ts
         * const nodeMinipoolLimit = rp.node.getNodeMinipoolLimit("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeMinipoolLimit",
        value: function getNodeMinipoolLimit(address) {
            return this.rocketNodeStaking.then(function (rocketNodeStaking) {
                return rocketNodeStaking.methods.getNodeMinipoolLimit(address).call();
            });
        }
        /**
         * Get a node's total effective RPL stake
         * @param address A string representing a node address
         * @returns a Promise<string\> that resolves to a string representing the node's RPL stake
         *
         * @example using Typescript
         * ```ts
         * const nodeTotalEffectiveRPLStake = rp.node.getNodeTotalEffectiveRPLStake("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeTotalEffectiveRPLStake",
        value: function getNodeTotalEffectiveRPLStake() {
            return this.rocketNodeStaking.then(function (rocketNodeStaking) {
                return rocketNodeStaking.methods.getTotalEffectiveRPLStake().call();
            });
        }
        /**
         * Get a node's minimum RPL stake
         * @param address A string representing a node address
         * @returns a Promise<string\> that resolves to a string representing the node's minimum RPL stake
         *
         * @example using Typescript
         * ```ts
         * const nodeRPLStake = rp.node.getNodeRPLStake("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeMinimumRPLStake",
        value: function getNodeMinimumRPLStake(address) {
            return this.rocketNodeStaking.then(function (rocketNodeStaking) {
                return rocketNodeStaking.methods.getNodeMinimumRPLStake(address).call();
            });
        }
        /**
         * Get a node's pending withdrawal address
         * @param address A string representing a node address
         * @returns a Promise<string\> that resolves to a string representing the node's pending withdrawal address
         *
         * @example using Typescript
         * ```ts
         * const pendingWithdrawalAddress = rp.node.getNodePendingWithdrawalAddress("0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294").then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodePendingWithdrawalAddress",
        value: function getNodePendingWithdrawalAddress(address) {
            return this.rocketStorage.then(function (rocketStorage) {
                return rocketStorage.methods.getNodePendingWithdrawalAddress(address).call();
            });
        }
        /**
         * Get the total effective RPL stake
         * @returns a Promise<string\> that resolves to a string representing the total effective rpl stake
         *
         * @example using Typescript
         * ```ts
         * const totalEffectiveRPLStake = rp.node.getTotalEffectiveRPLStake().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getTotalEffectiveRPLStake",
        value: function getTotalEffectiveRPLStake() {
            return this.rocketNodeStaking.then(function (rocketNodeStaking) {
                return rocketNodeStaking.methods.getTotalEffectiveRPLStake().call();
            });
        }
        /**
         * Get the total RPL stake
         * @returns a Promise<string\> that resolves to a string representing the total rpl stake
         *
         * @example using Typescript
         * ```ts
         * const totalRPLStake = rp.node.getTotalRPLStake().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getTotalRPLStake",
        value: function getTotalRPLStake() {
            return this.rocketNodeStaking.then(function (rocketNodeStaking) {
                return rocketNodeStaking.methods.getTotalRPLStake().call();
            });
        }
        /**
         * Calculate the total effective RPL stake provided inputs
         * @params offset a number representing the offset
         * @params limit a number representing the limit
         * @params rplPrice a string representing the rplPrice
         * @returns a Promise<string\> that resolves to a string representing the calculated RPL stake given inputs
         *
         * @example using Typescript
         * ```ts
         * const calculatedTotalEffectiveRPLStake = rp.node.calculateTotalEffectiveRPLStake(offset, limit, rplPrice).then((val: string) => { val };
         * ```
         */

    }, {
        key: "calculateTotalEffectiveRPLStake",
        value: function calculateTotalEffectiveRPLStake(offset, limit, rplPrice) {
            return this.rocketNodeStaking.then(function (rocketNodeStaking) {
                return rocketNodeStaking.methods.calculateTotalEffectiveRPLStake(offset, limit, rplPrice).call();
            });
        }
        /**
         * Get a breakdown of the number of nodes per timezone
         * @params offset a number representing the offset
         * @params limit a number representing the limit
         * @returns a Promise<object\> that resolves to an object node counts per timezone
         *
         * @example using Typescript
         * ```ts
         * const nodeCountPerTimezone = rp.node.getNodeCountPerTimezone(offset, limit).then((val: object) => { val };
         * ```
         */

    }, {
        key: "getNodeCountPerTimezone",
        value: function getNodeCountPerTimezone(offset, limit) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return rocketNodeManager.methods.getNodeCountPerTimezone(offset, limit).call();
            });
        }
        /**
         * Get the deposit type
         * @params amount a number representing the deposit amount
         * @returns a Promise<number\> that resolves to a number representing the minipool deposit enum value type
         *
         * @example using Typescript
         * ```ts
         * const nodeCountPerTimezone = rp.node.getNodeCountPerTimezone(offset, limit).then((val: object) => { val };
         * ```
         */

    }, {
        key: "getDepositType",
        value: function getDepositType(amount) {
            return this.rocketNodeDeposit.then(function (rocketNodeDeposit) {
                return rocketNodeDeposit.methods.getDepositType(amount).call();
            });
        }
        /**
         * Register a node
         * @param timezoneLocation A string representing the timezone location
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const timezoneLocation = "Australia/Brisbane";
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.node.registerNode(timezoneLocation, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "registerNode",
        value: function registerNode(timezoneLocation, options, onConfirmation) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return (0, _transaction.handleConfirmations)(rocketNodeManager.methods.registerNode(timezoneLocation).send(options), onConfirmation);
            });
        }
        /**
         * Set a node's withdrawal address
         * @param nodeAddress A string representing the node's address
         * @param withdrawalAddress A string representing the withdrawalAddress
         * @param confirm A boolean representing as to whether you which to auto confirm, true will auto confirm (negating the
         * need to prove your ownership of the withdrawal address), false will set the withdrawal address to pending and will
         * require an additional transaction (see confirmWithdrawalAddress) signed by the withdrawalAddress to prove ownership.
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const withdrawalAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
         * const confirm = false; // will set the withdrawalAddress to pending
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.node.setWithdrawalAddress(nodeAddress, withdrawalAddress, confirm, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "setWithdrawalAddress",
        value: function setWithdrawalAddress(nodeAddress, withdrawalAddress, confirm, options, onConfirmation) {
            return this.rocketStorage.then(function (rocketStorage) {
                return (0, _transaction.handleConfirmations)(rocketStorage.methods.setWithdrawalAddress(nodeAddress, withdrawalAddress, confirm).send(options), onConfirmation);
            });
        }
        /**
         * Stake RPL for a node address
         * @param amount A string representing the amount in Wei
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const amount = web3.utils.toWei("5000", "ether");
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.node.stakeRPL(nodeAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "stakeRPL",
        value: function stakeRPL(amount, options, onConfirmation) {
            return this.rocketNodeStaking.then(function (rocketNodeStaking) {
                return (0, _transaction.handleConfirmations)(rocketNodeStaking.methods.stakeRPL(amount).send(options), onConfirmation);
            });
        }
        /**
         * Confirm a  node's withdrawal address
         * @param nodeAddress A string representing the node's address
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const withdrawalAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
         * const options = {
         *		from: withdrawalAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.node.confirmWithdrawalAddress(nodeAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "confirmWithdrawalAddress",
        value: function confirmWithdrawalAddress(nodeAddress, options, onConfirmation) {
            return this.rocketStorage.then(function (rocketStorage) {
                return (0, _transaction.handleConfirmations)(rocketStorage.methods.confirmWithdrawalAddress(nodeAddress).send(options), onConfirmation);
            });
        }
        /**
         * Withdraw RPL for a node address
         * @param amount A string representing the amount in Wei
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const amount = web3.utils.toWei("5000", "ether");
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.node.withdrawRPL(nodeAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "withdrawRPL",
        value: function withdrawRPL(amount, options, onConfirmation) {
            return this.rocketNodeStaking.then(function (rocketNodeStaking) {
                return (0, _transaction.handleConfirmations)(rocketNodeStaking.methods.withdrawRPL(amount).send(options), onConfirmation);
            });
        }
        /**
         * Set the node's timezone location
         * @param timezoneLocation A string representing the timezone location
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const timezoneLocation = "Brisbane/Australia";
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.node.setTimezoneLocation(nodeAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "setTimezoneLocation",
        value: function setTimezoneLocation(timezoneLocation, options, onConfirmation) {
            return this.rocketNodeManager.then(function (rocketNodeManager) {
                return (0, _transaction.handleConfirmations)(rocketNodeManager.methods.setTimezoneLocation(timezoneLocation).send(options), onConfirmation);
            });
        }
        /**
         * Make a node deposit
         * @param minimumNodeFee A string representing the minimumNodeFee in Wei
         * @param validatorPubKey A buffer representing the validator pub key
         * @param validatorSignature A buffer representing the validator signature
         * @param depositDataRoot A buffer representing the deposit data root
         * @param salt A number representing the salt
         * @param expectedMinipoolAddress A string representing the expected minipool address
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const minimumNodeFee = web3.utils.toWei("0", "ether");
         * const nodeAddress = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: nodeAddress,
         *		gas: 1000000
         * }
         * const txReceipt = rp.node.deposit(minimumNodeFee, depositData.pubkey, depositData.signature, depositDataRoot, salt, minipoolAddress, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "deposit",
        value: function deposit(minimumNodeFee, validatorPubKey, validatorSignature, depositDataRoot, salt, expectedMinipoolAddress, options, onConfirmation) {
            return this.rocketNodeDeposit.then(function (rocketNodeDeposit) {
                return (0, _transaction.handleConfirmations)(rocketNodeDeposit.methods.deposit(minimumNodeFee, validatorPubKey, validatorSignature, depositDataRoot, salt, expectedMinipoolAddress).send(options), onConfirmation);
            });
        }
    }, {
        key: "rocketNodeDeposit",
        get: function get() {
            return this.contracts.get("rocketNodeDeposit");
        }
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeManager contract
         */

    }, {
        key: "rocketNodeManager",
        get: function get() {
            return this.contracts.get("rocketNodeManager");
        }
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketNodeStaking contract
         */

    }, {
        key: "rocketNodeStaking",
        get: function get() {
            return this.contracts.get("rocketNodeStaking");
        }
        /**
         * Private accessor use to retrieve the related contract
         * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketStorage contract
         */

    }, {
        key: "rocketStorage",
        get: function get() {
            return this.contracts.get("rocketStorage");
        }
    }]);

    return Node;
}();
// Exports


exports.default = Node;
//# sourceMappingURL=node.js.map