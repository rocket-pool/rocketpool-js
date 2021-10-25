"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transaction = require("../../utils/transaction");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Rocket Pool Minipool Contract Instance Wrapper
 */
var MinipoolContract = function () {
    /**
     * Create a new Minipool Contract instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    function MinipoolContract(web3, address, contract) {
        _classCallCheck(this, MinipoolContract);

        this.web3 = web3;
        this.address = address;
        this.contract = contract;
    }
    /**
     * Get status details
     * @returns a Promise<StatusDetails\> that resolves to a StatusDetails object (status, block, time)
     *
     * @example using Typescript
     * ```ts
     * const statusDetails = minipool.getStatusDetails().then((val: StatusDetails) => { val };
     * ```
     */


    _createClass(MinipoolContract, [{
        key: "getStatusDetails",
        value: function getStatusDetails() {
            return Promise.all([this.getStatus(), this.getStatusBlock(), this.getStatusTime()]).then(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 3),
                    status = _ref2[0],
                    block = _ref2[1],
                    time = _ref2[2];

                return {
                    status: status,
                    block: block,
                    time: time
                };
            });
        }
        /**
         * Get status of a minipool
         * @returns a Promise<number\> that resolves to a number representing the minipool status
         *
         * @example using Typescript
         * ```ts
         * const status = minipool.getStatus().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getStatus",
        value: function getStatus() {
            return this.contract.methods.getStatus().call();
        }
        /**
         * Get status block of a minipool
         * @returns a Promise<number\> that resolves to a number representing the status block of a minipool
         *
         * @example using Typescript
         * ```ts
         * const statusBlock = minipool.getStatusBlock().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getStatusBlock",
        value: function getStatusBlock() {
            return this.contract.methods.getStatusBlock().call().then(function (value) {
                return parseInt(value);
            });
        }
        /**
         * Get status timestamp of a minipool
         * @returns a Promise<Date\> that resolves to a Date representing the timestamp a minipool status
         *
         * @example using Typescript
         * ```ts
         * const statusTime = minipool.getStatusBlock().then((val: Date) => { val };
         * ```
         */

    }, {
        key: "getStatusTime",
        value: function getStatusTime() {
            return this.contract.methods.getStatusTime().call().then(function (value) {
                return new Date(parseInt(value) * 1000);
            });
        }
        /**
         * Get the deposit type
         * @returns a Promise<number\> that resolves to a number representing the deposit type
         *
         * @example using Typescript
         * ```ts
         * const depositType = minipool.getDepositType().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getDepositType",
        value: function getDepositType() {
            return this.contract.methods.getDepositType().call();
        }
        /**
         * Get the node details of a minipool
         * @returns a Promise<NodeDetails\> that resolves to a NodeDetails object representing details about the minipool's nodes
         *
         * @example using Typescript
         * ```ts
         * const nodeDetails = minipool.getNodeDetails().then((val: NodeDetails) => { val };
         * ```
         */

    }, {
        key: "getNodeDetails",
        value: function getNodeDetails() {
            return Promise.all([this.getNodeAddress(), this.getNodeFee(), this.getNodeDepositBalance(), this.getNodeRefundBalance(), this.getNodeDepositAssigned()]).then(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 5),
                    address = _ref4[0],
                    fee = _ref4[1],
                    depositBalance = _ref4[2],
                    refundBalance = _ref4[3],
                    depositAssigned = _ref4[4];

                return {
                    address: address,
                    fee: fee,
                    depositBalance: depositBalance,
                    refundBalance: refundBalance,
                    depositAssigned: depositAssigned
                };
            });
        }
        /**
         * Get the node address of a minipool
         * @returns a Promise<string\> that resolves to a string representing the node address of the minipool
         *
         * @example using Typescript
         * ```ts
         * const nodeAddress = minipool.getNodeAddress().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeAddress",
        value: function getNodeAddress() {
            return this.contract.methods.getNodeAddress().call();
        }
        /**
         * Get the node fee of a minipool
         * @returns a Promise<number\> that resolves to a number representing the node fee of the minipool
         *
         * @example using Typescript
         * ```ts
         * const nodeFee = minipool.getNodeFee().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getNodeFee",
        value: function getNodeFee() {
            return this.contract.methods.getNodeFee().call();
        }
        /**
         * Get the node deposit balance of a minipool
         * @returns a Promise<string\> that resolves to a string representing the node deposit balance of a minipool in Wei
         *
         * @example using Typescript
         * ```ts
         * const nodeBalanceDeposit = minipool.getNodeDepositBalance().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeDepositBalance",
        value: function getNodeDepositBalance() {
            return this.contract.methods.getNodeDepositBalance().call();
        }
        /**
         * Get the node refund balance of a minipool
         * @returns a Promise<string\> that resolves to a string representing the node refund balance of a minipool in Wei
         *
         * @example using Typescript
         * ```ts
         * const nodeRefundDeposit = minipool.getNodeRefundBalance().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getNodeRefundBalance",
        value: function getNodeRefundBalance() {
            return this.contract.methods.getNodeRefundBalance().call();
        }
        /**
         * Get if a node deposit has been assigned for a minipool
         * @returns a Promise<boolean\> that resolves to a boolean representing if a node deposit has been assigned for a minipool
         *
         * @example using Typescript
         * ```ts
         * const nodeDepositAssigned = minipool.getNodeDepositAssigned().then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getNodeDepositAssigned",
        value: function getNodeDepositAssigned() {
            return this.contract.methods.getNodeDepositAssigned().call();
        }
        /**
         * Get if a minipool has had scrub votes
         * @returns a Promise<boolean\> that resolves to a boolean representing if a minipool has had scrub votes
         *
         * @example using Typescript
         * ```ts
         * const scrubVoted = minipool.getScrubVoted().then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getScrubVoted",
        value: function getScrubVoted() {
            return this.contract.methods.getScrubVoted().call();
        }
        /**
         * Get the total scrub votes for a minipool
         * @returns a Promise<number\> that resolves to a number representing the total number of scrub votes a minipool has
         *
         * @example using Typescript
         * ```ts
         * const totalScrubVotes = minipool.getTotalScrubVotes().then((val: number) => { val };
         * ```
         */

    }, {
        key: "getTotalScrubVotes",
        value: function getTotalScrubVotes() {
            return this.contract.methods.getNodeFee().call();
        }
        /**
         * Get user deposit details
         * @returns a Promise<UserDetails\> that resolves to a UserDetails object representing the user details (depositBalance, depositAssigned, depositAssignedTime) for a minipool
         *
         * @example using Typescript
         * ```ts
         * const userDetails = minipool.getUserDetails().then((val: UserDetails) => { val };
         * ```
         */

    }, {
        key: "getUserDetails",
        value: function getUserDetails() {
            return Promise.all([this.getUserDepositBalance(), this.getUserDepositAssigned(), this.getUserDepositAssignedTime()]).then(function (_ref5) {
                var _ref6 = _slicedToArray(_ref5, 3),
                    depositBalance = _ref6[0],
                    depositAssigned = _ref6[1],
                    depositAssignedTime = _ref6[2];

                return {
                    depositBalance: depositBalance,
                    depositAssigned: depositAssigned,
                    depositAssignedTime: depositAssignedTime
                };
            });
        }
        /**
         * Get user deposit balance
         * @returns a Promise<string\> that resolves to a string representing the user deposit balance for a minipool in Wei
         *
         * @example using Typescript
         * ```ts
         * const userDepositBalance = minipool.getUserDepositBalance().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getUserDepositBalance",
        value: function getUserDepositBalance() {
            return this.contract.methods.getUserDepositBalance().call();
        }
        /**
         * Get user deposit assigned
         * @returns a Promise<boolean\> that resolves to a boolean representing if the user deposit has been assigned
         *
         * @example using Typescript
         * ```ts
         * const userDepositAssigned = minipool.getUserDepositAssigned().then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getUserDepositAssigned",
        value: function getUserDepositAssigned() {
            return this.contract.methods.getUserDepositAssigned().call();
        }
        /**
         * Get a timestamp for when the user deposit was assigned for the minipool
         * @returns a Promise<Date\> that resolves to a Date representing the timestamp the user deposit was assigned for the minipool
         *
         * @example using Typescript
         * ```ts
         * const userDepositAssignedTime = minipool.getUserDepositAssignedTime().then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getUserDepositAssignedTime",
        value: function getUserDepositAssignedTime() {
            return this.contract.methods.getUserDepositAssignedTime().call().then(function (value) {
                return new Date(parseInt(value) * 1000);
            });
        }
        /**
         * Get a staking details for a minipool
         * @returns a Promise<StakingDetails\> that resolves to a StakingDetails object representing staking details (start & end balance) for a minipool
         *
         * @example using Typescript
         * ```ts
         * const stakingDetails = minipool.getStakingDetails().then((val: StakingDetails) => { val };
         * ```
         */

    }, {
        key: "getStakingDetails",
        value: function getStakingDetails() {
            return Promise.all([this.getStakingStartBalance(), this.getStakingEndBalance()]).then(function (_ref7) {
                var _ref8 = _slicedToArray(_ref7, 2),
                    startBalance = _ref8[0],
                    endBalance = _ref8[1];

                return {
                    startBalance: startBalance,
                    endBalance: endBalance
                };
            });
        }
        /**
         * Get a staking start balance for a minipool
         * @returns a Promise<string\> that resolves to a string representing the staking start balance for a minipool
         *
         * @example using Typescript
         * ```ts
         * const stakingStartBalance = minipool.getStakingStartBalance().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getStakingStartBalance",
        value: function getStakingStartBalance() {
            return this.contract.methods.getStakingStartBalance().call();
        }
        /**
         * Get a staking end balance for a minipool
         * @returns a Promise<string\> that resolves to a string representing the staking end balance for a minipool
         *
         * @example using Typescript
         * ```ts
         * const stakingEndBalance = minipool.getStakingEndBalance().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getStakingEndBalance",
        value: function getStakingEndBalance() {
            return this.contract.methods.getStakingEndBalance().call();
        }
        /**
         * Get a minipool's withdrawal credentials
         * @returns a Promise<string\> that resolves to a string representing the minipool's withdrawal credentials
         *
         * @example using Typescript
         * ```ts
         * const withdrawalCredentials = minipool.getWithdrawalCredentials().then((val: string) => { val };
         * ```
         */

    }, {
        key: "getWithdrawalCredentials",
        value: function getWithdrawalCredentials() {
            return this.contract.methods.getWithdrawalCredentials().call();
        }
        /**
         * Check if a minipool's node is withdrawn
         * @returns a Promise<boolean\> that resolves to a boolean representing if the minipool's node is withdrawn
         *
         * @example using Typescript
         * ```ts
         * const nodeWithdrawn = minipool.getNodeWithdrawn().then((val: boolean) => { val };
         * ```
         */

    }, {
        key: "getNodeWithdrawn",
        value: function getNodeWithdrawn() {
            return this.contract.methods.getNodeWithdrawn().call();
        }
        /**
         * Dissolve the minipool
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const node = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: node,
         *		gas: 1000000
         * };
         * const txReceipt = minipool.dissolve(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "dissolve",
        value: function dissolve(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.dissolve().send(options), onConfirmation);
        }
        /**
         * Slash the minipool
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const node = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294";
         * const options = {
         *		from: node,
         *		gas: 1000000
         * };
         * const txReceipt = minipool.slash(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "slash",
        value: function slash(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.slash().send(options), onConfirmation);
        }
        /**
         * Refund node ETH refinanced from user deposited ETH
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
         * const options = {
         *		from: owner,
         *		gas: 1000000
         * };
         * const txReceipt = minipool.refund(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "refund",
        value: function refund(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.refund().send(options), onConfirmation);
        }
        /**
         * Progress the minipool to staking, sending its ETH deposit to the VRC
         * Only accepts calls from the minipool owner (node) while in prelaunch and once scrub period has ended
         * @param validatorPubkey A buffer
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const validatorPubkey = <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 03>;
         * const validatorSignature = <Buffer 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23 45 67 89 ab cd ef 01 23>;
         * const depositDataRoot = <Buffer 48 ad 0b 82 2c d6 81 f9 c9 8b 06 a1 8b 93 4b df 7f 40 76 80 fb 7a 3b 5c cd 2c 92 a6 4a 58 e9 05>;
         * const owner = "0x8B0EF9f1932A2e44c3D27bE4C70C3BC07A6A27B3"; // must be the owner of the minipool
         * const options = {
         *		from: owner,
         *		gas: 1000000
         * };
         * const txReceipt = minipool.stake(validatorPubkey, validatorSignature, depositDataRoot, options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "stake",
        value: function stake(validatorPubkey, validatorSignature, depositDataRoot, options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.stake(validatorPubkey, validatorSignature, depositDataRoot).send(options), onConfirmation);
        }
        /**
         * Finalise and unlock their RPL stake
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
         * const options = {
         *		from: owner,
         *		gas: 1000000
         * };
         * const txReceipt = minipool.finalise(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "finalise",
        value: function finalise(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.finalise().send(options), onConfirmation);
        }
        /**
         * Withdraw node balances & rewards from the minipool and close it
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
         * const options = {
         *		from: owner,
         *		gas: 1000000
         * };
         * const txReceipt = minipool.withdraw(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "withdraw",
        value: function withdraw(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.withdraw().send(options), onConfirmation);
        }
        /**
         * Distributes the contract's balance and finalises the pool
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
         * const options = {
         *		from: owner,
         *		gas: 1000000
         * };
         * const txReceipt = minipool.distributeBalanceAndFinalise(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "distributeBalanceAndFinalise",
        value: function distributeBalanceAndFinalise(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.distributeBalanceAndFinalise().send(options), onConfirmation);
        }
        /**
         * Distributes the contract's balance
         * When called during staking status, requires 16 ether in the pool
         * When called by non-owner with less than 16 ether, requires 14 days to have passed since being made withdrawable
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
         * const options = {
         *		from: owner,
         *		gas: 1000000
         * };
         * const txReceipt = minipool.distributeBalance(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "distributeBalance",
        value: function distributeBalance(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.distributeBalance().send(options), onConfirmation);
        }
        /**
         * Mark a minipool as scrub, we don't want no scrubs
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const daoMember = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // can only be called by a DAO member
         * const options = {
         *		from: daoMember,
         *		gas: 1000000
         * };
         * const txReceipt = minipool.finalise(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "voteScrub",
        value: function voteScrub(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.voteScrub().send(options), onConfirmation);
        }
        /**
         * Withdraw node balances from the minipool and close it
         * @param options An optional object of web3.eth.Contract SendOptions
         * @param onConfirmation An optional confirmation handler object
         * @returns a Promise<TransactionReceipt\> that resolves to a TransactionReceipt object representing the receipt of the transaction
         *
         * @example using Typescript
         * ```ts
         * const owner = "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294"; // must be the owner of the minipool
         * const options = {
         *		from: owner,
         *		gas: 1000000
         * };
         * const txReceipt = minipool.close(options).then((txReceipt: TransactionReceipt) => { txReceipt };
         * ```
         */

    }, {
        key: "close",
        value: function close(options, onConfirmation) {
            return (0, _transaction.handleConfirmations)(this.contract.methods.close().send(options), onConfirmation);
        }
    }]);

    return MinipoolContract;
}();
// Exports


exports.default = MinipoolContract;
//# sourceMappingURL=minipool-contract.js.map