var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("utils/contract", ["require", "exports", "pako"], function (require, exports, pako_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    pako_1 = __importDefault(pako_1);
    // Decode contract ABI
    function decodeAbi(encodedAbi) {
        return JSON.parse(pako_1.default.inflate(Buffer.from(encodedAbi, 'base64'), { to: 'string' }));
    }
    exports.decodeAbi = decodeAbi;
});
define("rocketpool/contracts/contracts", ["require", "exports", "utils/contract"], function (require, exports, contract_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rocket Pool contract manager
     */
    class Contracts {
        // Constructor
        constructor(web3, RocketStorage) {
            this.web3 = web3;
            this.RocketStorage = RocketStorage;
            this.contracts = {};
            this.abis = {};
            // Initialise rocketStorage contract promise
            this.rocketStorage = this.web3.eth.net.getId().then((networkId) => new this.web3.eth.Contract(RocketStorage.abi, RocketStorage.networks[networkId].address));
        }
        abi(name) {
            // Array mode
            if (typeof name === "object")
                return Promise.all(name.map((n) => this.abi(n)));
            // Use cached ABI promise
            if (this.abis[name])
                return this.abis[name];
            // Load and decode ABI
            this.abis[name] = this.rocketStorage
                .then((rocketStorage) => rocketStorage.methods.getString(this.web3.utils.soliditySha3('contract.abi', name)).call())
                .then((abi) => contract_1.decodeAbi(abi));
            // Return ABI promise
            return this.abis[name];
        }
        get(name) {
            // Array mode
            if (typeof name === "object")
                return Promise.all(name.map((n) => this.get(n)));
            // Use cached contract promise
            if (this.contracts[name])
                return this.contracts[name];
            // Load contract data and initialise
            this.contracts[name] = this.rocketStorage.then((rocketStorage) => Promise.all([
                rocketStorage.methods.getAddress(this.web3.utils.soliditySha3('contract.name', name)).call(),
                this.abi(name),
            ])).then(([address, abi]) => new this.web3.eth.Contract(abi, address));
            // Return contract promise
            return this.contracts[name];
        }
        // Create a new contract instance with the specified ABI name and address
        make(name, address) {
            return this.abi(name).then((abi) => new this.web3.eth.Contract(abi, address));
        }
    }
    // Exports
    exports.default = Contracts;
});
define("rocketpool/deposit/deposit", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rocket Pool deposit manager
     */
    class Deposit {
        // Constructor
        constructor(web3, contracts) {
            this.web3 = web3;
            this.contracts = contracts;
        }
        // Contract accessors
        get rocketDepositAPI() {
            return this.contracts.get('rocketDepositAPI');
        }
        /**
         * Getters
         */
        // Get a user's queued deposits
        getQueuedDeposits(groupId, userId, durationId) {
            return this.getQueuedDepositCount(groupId, userId, durationId).then((count) => {
                return Promise.all([...Array(count).keys()].map((di) => {
                    return this.getQueuedDepositAt(groupId, userId, durationId, di);
                }));
            }).then((depositIds) => {
                return Promise.all([...Array(depositIds.length).keys()].map((di) => {
                    return Promise.all([
                        depositIds[di],
                        this.getQueuedDepositBalance(depositIds[di]),
                    ]);
                }));
            }).then((deposits) => {
                return deposits.map(([id, balance]) => ({ id, balance }));
            });
        }
        // Get a user's queued deposit count
        getQueuedDepositCount(groupId, userId, durationId) {
            return this.rocketDepositAPI.then((rocketDepositAPI) => {
                return rocketDepositAPI.methods.getUserQueuedDepositCount(groupId, userId, durationId).call();
            }).then((value) => parseInt(value));
        }
        // Get a user's queued deposit ID by index
        getQueuedDepositAt(groupId, userId, durationId, index) {
            return this.rocketDepositAPI.then((rocketDepositAPI) => {
                return rocketDepositAPI.methods.getUserQueuedDepositAt(groupId, userId, durationId, index).call();
            });
        }
        // Get the balance of a user's queued deposit by ID
        getQueuedDepositBalance(depositId) {
            return this.rocketDepositAPI.then((rocketDepositAPI) => {
                return rocketDepositAPI.methods.getUserQueuedDepositBalance(depositId).call();
            });
        }
    }
    // Exports
    exports.default = Deposit;
});
define("utils/transaction", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Handle transaction confirmations
    function handleConfirmations(pe, onConfirmation) {
        if (onConfirmation !== undefined)
            pe.on('confirmation', onConfirmation);
        return pe;
    }
    exports.handleConfirmations = handleConfirmations;
});
define("rocketpool/group/group-contract", ["require", "exports", "utils/transaction"], function (require, exports, transaction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * RocketGroupContract instance wrapper
     */
    class GroupContract {
        // Constructor
        constructor(web3, contract) {
            this.web3 = web3;
            this.contract = contract;
        }
        /**
         * Getters
         */
        // Get all group details
        getDetails() {
            return Promise.all([
                this.getOwner(),
                this.getGroupFee(),
                this.getRocketPoolFee(),
                this.getGroupFeeAddress(),
            ]).then(([owner, groupFee, rocketPoolFee, groupFeeAddress]) => {
                return { owner, groupFee, rocketPoolFee, groupFeeAddress };
            });
        }
        // Get the group owner
        getOwner() {
            return this.contract.methods.getOwner().call();
        }
        // Get the fee charged to the group's users by the group as a fraction
        getGroupFee() {
            return this.contract.methods.getFeePerc().call().then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
        }
        // Get the fee charged to the group's users by Rocket Pool as a fraction
        getRocketPoolFee() {
            return this.contract.methods.getFeePercRocketPool().call().then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
        }
        // Get the address group fees are sent to
        getGroupFeeAddress() {
            return this.contract.methods.getFeeAddress().call();
        }
        /**
         * Mutators - Restricted to the group owner address
         */
        // Set the fee charged to the group's users by the group
        setGroupFee(feeFraction, options, onConfirmation) {
            return transaction_1.handleConfirmations(this.contract.methods.setFeePerc(this.web3.utils.toWei(feeFraction.toString(), 'ether')).send(options), onConfirmation);
        }
        // Set the address group fees are sent to
        setGroupFeeAddress(address, options, onConfirmation) {
            return transaction_1.handleConfirmations(this.contract.methods.setFeeAddress(address).send(options), onConfirmation);
        }
        // Add a depositor contract to the group
        addDepositor(address, options, onConfirmation) {
            return transaction_1.handleConfirmations(this.contract.methods.addDepositor(address).send(options), onConfirmation);
        }
        // Remove a depositor contract from the group
        removeDepositor(address, options, onConfirmation) {
            return transaction_1.handleConfirmations(this.contract.methods.removeDepositor(address).send(options), onConfirmation);
        }
        // Add a withdrawer contract to the group
        addWithdrawer(address, options, onConfirmation) {
            return transaction_1.handleConfirmations(this.contract.methods.addWithdrawer(address).send(options), onConfirmation);
        }
        // Remove a withdrawer contract from the group
        removeWithdrawer(address, options, onConfirmation) {
            return transaction_1.handleConfirmations(this.contract.methods.removeWithdrawer(address).send(options), onConfirmation);
        }
    }
    // Exports
    exports.default = GroupContract;
});
define("rocketpool/group/group-accessor-contract", ["require", "exports", "utils/transaction"], function (require, exports, transaction_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * RocketGroupContract instance wrapper
     */
    class GroupAccessorContract {
        // Constructor
        constructor(web3, contract) {
            this.web3 = web3;
            this.contract = contract;
        }
        /**
         * Mutators - Public
         */
        // Make a deposit
        deposit(durationId, options, onConfirmation) {
            return transaction_2.handleConfirmations(this.contract.methods.deposit(durationId).send(options), onConfirmation);
        }
        // Refund a queued deposit
        refundQueuedDeposit(durationId, depositId, options, onConfirmation) {
            return transaction_2.handleConfirmations(this.contract.methods.refundDepositQueued(durationId, depositId).send(options), onConfirmation);
        }
        // Refund a deposit from a stalled minipool
        refundStalledMinipoolDeposit(depositId, minipoolAddress, options, onConfirmation) {
            return transaction_2.handleConfirmations(this.contract.methods.refundDepositMinipoolStalled(depositId, minipoolAddress).send(options), onConfirmation);
        }
        // Withdraw a deposit from a staking minipool
        withdrawStakingMinipoolDeposit(depositId, minipoolAddress, weiAmount, options, onConfirmation) {
            return transaction_2.handleConfirmations(this.contract.methods.withdrawDepositMinipoolStaking(depositId, minipoolAddress, weiAmount).send(options), onConfirmation);
        }
        // Withdraw a deposit from a withdrawn minipool
        withdrawMinipoolDeposit(depositId, minipoolAddress, options, onConfirmation) {
            return transaction_2.handleConfirmations(this.contract.methods.withdrawDepositMinipool(depositId, minipoolAddress).send(options), onConfirmation);
        }
    }
    // Exports
    exports.default = GroupAccessorContract;
});
define("rocketpool/group/group", ["require", "exports", "utils/transaction", "rocketpool/group/group-contract", "rocketpool/group/group-accessor-contract"], function (require, exports, transaction_3, group_contract_1, group_accessor_contract_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    group_contract_1 = __importDefault(group_contract_1);
    group_accessor_contract_1 = __importDefault(group_accessor_contract_1);
    /**
     * Rocket Pool groups manager
     */
    class Group {
        // Constructor
        constructor(web3, contracts) {
            this.web3 = web3;
            this.contracts = contracts;
        }
        // Contract accessors
        get rocketGroupAPI() {
            return this.contracts.get('rocketGroupAPI');
        }
        /**
         * Getters
         */
        // Get the name of a group by ID
        getName(groupId) {
            return this.rocketGroupAPI.then((rocketGroupAPI) => {
                return rocketGroupAPI.methods.getGroupName(groupId).call();
            });
        }
        // Get a GroupContract instance
        getContract(address) {
            return this.contracts.make('rocketGroupContract', address).then((rocketGroupContract) => {
                return new group_contract_1.default(this.web3, rocketGroupContract);
            });
        }
        // Get a GroupAccessorContract instance
        getAccessorContract(address) {
            return this.contracts.make('rocketGroupAccessorContract', address).then((rocketGroupAccessorContract) => {
                return new group_accessor_contract_1.default(this.web3, rocketGroupAccessorContract);
            });
        }
        /**
         * Mutators - Public
         */
        // Register a group
        add(name, stakingFeeFraction, options, onConfirmation) {
            return this.rocketGroupAPI.then((rocketGroupAPI) => {
                return transaction_3.handleConfirmations(rocketGroupAPI.methods.add(name, this.web3.utils.toWei(stakingFeeFraction.toString(), 'ether')).send(options), onConfirmation);
            });
        }
        // Create a default accessor contract for a group
        createDefaultAccessor(groupId, options, onConfirmation) {
            return this.rocketGroupAPI.then((rocketGroupAPI) => {
                return transaction_3.handleConfirmations(rocketGroupAPI.methods.createDefaultAccessor(groupId).send(options), onConfirmation);
            });
        }
    }
    // Exports
    exports.default = Group;
});
define("rocketpool/node/node-contract", ["require", "exports", "utils/transaction"], function (require, exports, transaction_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * RocketNodeContract instance wrapper
     */
    class NodeContract {
        // Constructor
        constructor(web3, contract) {
            this.web3 = web3;
            this.contract = contract;
        }
        /**
         * Getters
         */
        // Get all node details
        getDetails() {
            return Promise.all([
                this.getOwner(),
                this.getRewardsAddress(),
                this.getEthBalance(),
                this.getRplBalance(),
                this.getHasDepositReservation(),
            ]).then(([owner, rewardsAddress, ethBalance, rplBalance, hasDepositReservation]) => {
                return { owner, rewardsAddress, ethBalance, rplBalance, hasDepositReservation };
            });
        }
        // Get all node deposit reservation details
        getDepositReservation() {
            return Promise.all([
                this.getDepositReservationCreated(),
                this.getDepositReservationEthRequired(),
                this.getDepositReservationRplRequired(),
                this.getDepositReservationDurationId(),
                this.getDepositReservationDepositInput(),
            ]).then(([created, etherRequired, rplRequired, durationId, depositInput]) => {
                return { created, etherRequired, rplRequired, durationId, depositInput };
            });
        }
        // Get the node owner
        getOwner() {
            return this.contract.methods.getOwner().call();
        }
        // Get the node's rewards address
        getRewardsAddress() {
            return this.contract.methods.getRewardsAddress().call();
        }
        // Get the node's current ETH balance in wei
        getEthBalance() {
            return this.contract.methods.getBalanceETH().call();
        }
        // Get the node's current RPL balance in wei
        getRplBalance() {
            return this.contract.methods.getBalanceRPL().call();
        }
        // Check whether the node has an existing deposit reservation
        getHasDepositReservation() {
            return this.contract.methods.getHasDepositReservation().call();
        }
        // Get the deposit reservation created time
        getDepositReservationCreated() {
            return this.contract.methods.getDepositReservedTime().call().then((value) => new Date(parseInt(value) * 1000));
        }
        // Get the deposit reservation ETH requirement in wei
        getDepositReservationEthRequired() {
            return this.contract.methods.getDepositReserveEtherRequired().call();
        }
        // Get the deposit reservation RPL requirement in wei
        getDepositReservationRplRequired() {
            return this.contract.methods.getDepositReserveRPLRequired().call();
        }
        // Get the deposit reservation duration ID
        getDepositReservationDurationId() {
            return this.contract.methods.getDepositReserveDurationID().call();
        }
        // Get the deposit reservation DepositInput data
        getDepositReservationDepositInput() {
            return this.contract.methods.getDepositReserveDepositInput().call();
        }
        /**
         * Mutators - Restricted to the node owner address
         */
        // Set the node's rewards address
        setRewardsAddress(address, options, onConfirmation) {
            return transaction_4.handleConfirmations(this.contract.methods.setRewardsAddress(address).send(options), onConfirmation);
        }
        // Make a deposit reservation
        reserveDeposit(durationId, depositInput, options, onConfirmation) {
            return transaction_4.handleConfirmations(this.contract.methods.depositReserve(durationId, depositInput).send(options), onConfirmation);
        }
        // Cancel a deposit reservation
        cancelDepositReservation(options, onConfirmation) {
            return transaction_4.handleConfirmations(this.contract.methods.depositReserveCancel().send(options), onConfirmation);
        }
        // Can complete a deposit
        completeDeposit(options, onConfirmation) {
            return transaction_4.handleConfirmations(this.contract.methods.deposit().send(options), onConfirmation);
        }
        // Withdraw a deposit from an initialised, timed out or withdrawn minipool
        withdrawMinipoolDeposit(minipoolAddress, options, onConfirmation) {
            return transaction_4.handleConfirmations(this.contract.methods.withdrawMinipoolDeposit(minipoolAddress).send(options), onConfirmation);
        }
        // Withdraw ETH from the node contract
        withdrawEth(weiAmount, options, onConfirmation) {
            return transaction_4.handleConfirmations(this.contract.methods.withdrawEther(weiAmount).send(options), onConfirmation);
        }
        // Withdraw RPL from the node contract
        withdrawRpl(weiAmount, options, onConfirmation) {
            return transaction_4.handleConfirmations(this.contract.methods.withdrawRPL(weiAmount).send(options), onConfirmation);
        }
    }
    // Exports
    exports.default = NodeContract;
});
define("rocketpool/node/node", ["require", "exports", "utils/transaction", "rocketpool/node/node-contract"], function (require, exports, transaction_5, node_contract_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    node_contract_1 = __importDefault(node_contract_1);
    /**
     * Rocket Pool node manager
     */
    class Node {
        // Constructor
        constructor(web3, contracts) {
            this.web3 = web3;
            this.contracts = contracts;
        }
        // Contract accessors
        get rocketNodeAPI() {
            return this.contracts.get('rocketNodeAPI');
        }
        get rocketNode() {
            return this.contracts.get('rocketNode');
        }
        /**
         * Getters
         */
        // Get the current number of nodes with minipools available for assignment by staking duration ID
        getAvailableCount(stakingDurationId) {
            return this.rocketNode.then((rocketNode) => {
                return rocketNode.methods.getAvailableNodeCount(stakingDurationId).call();
            }).then((value) => parseInt(value));
        }
        // Get the current RPL ratio by staking duration ID
        getRPLRatio(stakingDurationId) {
            return this.rocketNodeAPI.then((rocketNodeAPI) => {
                return rocketNodeAPI.methods.getRPLRatio(stakingDurationId).call();
            }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
        }
        // Get the current RPL requirement for an ether amount by staking duration ID
        getRPLRequired(weiAmount, stakingDurationId) {
            return this.rocketNodeAPI.then((rocketNodeAPI) => {
                return rocketNodeAPI.methods.getRPLRequired(weiAmount, stakingDurationId).call();
            }).then((ret) => [ret[0], parseFloat(this.web3.utils.fromWei(ret[1], 'ether'))]);
        }
        // Get the timezone location of a node
        getTimezoneLocation(nodeOwner) {
            return this.rocketNodeAPI.then((rocketNodeAPI) => {
                return rocketNodeAPI.methods.getTimezoneLocation(nodeOwner).call();
            });
        }
        // Get a node's contract address by owner address
        getContractAddress(nodeOwner) {
            return this.rocketNodeAPI.then((rocketNodeAPI) => {
                return rocketNodeAPI.methods.getContract(nodeOwner).call();
            });
        }
        // Get a NodeContract instance
        getContract(address) {
            return this.contracts.make('rocketNodeContract', address).then((rocketNodeContract) => {
                return new node_contract_1.default(this.web3, rocketNodeContract);
            });
        }
        /**
         * Mutators - Public
         */
        // Register a node
        add(timezone, options, onConfirmation) {
            return this.rocketNodeAPI.then((rocketNodeAPI) => {
                return transaction_5.handleConfirmations(rocketNodeAPI.methods.add(timezone).send(options), onConfirmation);
            });
        }
        /**
         * Mutators - Restricted to the node owner address
         */
        // Set a node's timezone location
        setTimezoneLocation(timezone, options, onConfirmation) {
            return this.rocketNodeAPI.then((rocketNodeAPI) => {
                return transaction_5.handleConfirmations(rocketNodeAPI.methods.setTimezoneLocation(timezone).send(options), onConfirmation);
            });
        }
    }
    // Exports
    exports.default = Node;
});
define("rocketpool/pool/minipool-contract", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * RocketMinipool contract instance wrapper
     */
    class MinipoolContract {
        // Constructor
        constructor(web3, contract) {
            this.web3 = web3;
            this.contract = contract;
        }
        /**
         * Getters - Node
         */
        // Get all node details
        getNodeDetails() {
            return Promise.all([
                this.getNodeOwner(),
                this.getNodeContract(),
                this.getNodeDepositEth(),
                this.getNodeDepositRpl(),
                this.getNodeTrusted(),
                this.getNodeDepositExists(),
                this.getNodeBalance(),
            ]).then(([owner, contract, depositEth, depositRpl, trusted, depositExists, balance]) => {
                return { owner, contract, depositEth, depositRpl, trusted, depositExists, balance };
            });
        }
        // Get the node owner's address
        getNodeOwner() {
            return this.contract.methods.getNodeOwner().call();
        }
        // Get the node contract address
        getNodeContract() {
            return this.contract.methods.getNodeContract().call();
        }
        // Get the amount of ETH to be deposited by the node owner in wei
        getNodeDepositEth() {
            return this.contract.methods.getNodeDepositEther().call();
        }
        // Get the amount of RPL to be deposited by the node owner in wei
        getNodeDepositRpl() {
            return this.contract.methods.getNodeDepositRPL().call();
        }
        // Get whether the node was trusted when the minipool was created
        getNodeTrusted() {
            return this.contract.methods.getNodeTrusted().call();
        }
        // Get whether the node owner's deposit currently exists
        getNodeDepositExists() {
            return this.contract.methods.getNodeDepositExists().call();
        }
        // Get the node owner's deposited ETH balance in wei
        getNodeBalance() {
            return this.contract.methods.getNodeBalance().call();
        }
        /**
         * Getters - Users
         */
        // Get the number of users in the minipool
        getUserCount() {
            return this.contract.methods.getUserCount().call().then((value) => parseInt(value));
        }
        // Get whether a user exists in the minipool
        getUserExists(userId, groupId) {
            return this.contract.methods.getUserExists(userId, groupId).call();
        }
        // Get whether a user has a deposit in the minipool
        getUserHasDeposit(userId, groupId) {
            return this.contract.methods.getUserHasDeposit(userId, groupId).call();
        }
        // Get a user's deposit amount in the minipool in wei
        getUserDeposit(userId, groupId) {
            return this.contract.methods.getUserDeposit(userId, groupId).call();
        }
        // Get the amount of RPB tokens withdrawn by a user while staking in wei
        getUserStakingTokensWithdrawn(userId, groupId) {
            return this.contract.methods.getUserStakingTokensWithdrawn(userId, groupId).call();
        }
        /**
         * Getters - Status
         */
        // Get all status details
        getStatusDetails() {
            return Promise.all([
                this.getStatus(),
                this.getStatusChangedTime(),
                this.getStatusChangedBlock(),
                this.getStakingDurationId(),
                this.getStakingDuration(),
                this.getDepositInput(),
                this.getUserDepositCapacity(),
                this.getUserDepositTotal(),
                this.getStakingUserDepositsWithdrawn(),
            ]).then(([status, statusChangedTime, statusChangedBlock, stakingDurationId, stakingDuration, depositInput, userDepositCapacity, userDepositTotal, stakingUserDepositsWithdrawn]) => {
                return {
                    status, statusChangedTime, statusChangedBlock, stakingDurationId, stakingDuration,
                    depositInput, userDepositCapacity, userDepositTotal, stakingUserDepositsWithdrawn
                };
            });
        }
        // Get the current minipool status
        getStatus() {
            return this.contract.methods.getStatus().call();
        }
        // Get the time the status was last updated
        getStatusChangedTime() {
            return this.contract.methods.getStatusChangedTime().call().then((value) => new Date(parseInt(value) * 1000));
        }
        // Get the block the status was last updated at
        getStatusChangedBlock() {
            return this.contract.methods.getStatusChangedBlock().call().then((value) => parseInt(value));
        }
        // Get the minipool's staking duration ID
        getStakingDurationId() {
            return this.contract.methods.getStakingDurationID().call();
        }
        // Get the minipool's staking duration in blocks
        getStakingDuration() {
            return this.contract.methods.getStakingDuration().call().then((value) => parseInt(value));
        }
        // Get the minipool's DepositInput data for submission to Casper
        getDepositInput() {
            return this.contract.methods.getDepositInput().call();
        }
        // Get the minipool's total capacity for user deposits in wei
        getUserDepositCapacity() {
            return this.contract.methods.getUserDepositCapacity().call();
        }
        // Get the total value of user deposits to the minipool in wei
        getUserDepositTotal() {
            return this.contract.methods.getUserDepositTotal().call();
        }
        // Get the total value of user deposits withdrawn while staking in wei
        getStakingUserDepositsWithdrawn() {
            return this.contract.methods.getStakingUserDepositsWithdrawn().call();
        }
    }
    // Exports
    exports.default = MinipoolContract;
});
define("rocketpool/pool/pool", ["require", "exports", "rocketpool/pool/minipool-contract"], function (require, exports, minipool_contract_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    minipool_contract_1 = __importDefault(minipool_contract_1);
    /**
     * Rocket Pool pools manager
     */
    class Pool {
        // Constructor
        constructor(web3, contracts) {
            this.web3 = web3;
            this.contracts = contracts;
        }
        // Contract accessors
        get rocketPool() {
            return this.contracts.get('rocketPool');
        }
        /**
         * Getters
         */
        // Get whether a minipool with a given address exists
        getPoolExists(address) {
            return this.rocketPool.then((rocketPool) => {
                return rocketPool.methods.getPoolExists(address).call();
            });
        }
        // Get the total number of minipools
        getPoolCount() {
            return this.rocketPool.then((rocketPool) => {
                return rocketPool.methods.getPoolsCount().call();
            }).then((value) => parseInt(value));
        }
        // Get a minipool address by index
        getPoolAt(index) {
            return this.rocketPool.then((rocketPool) => {
                return rocketPool.methods.getPoolAt(index).call();
            });
        }
        // Get the total network ether assigned by staking duration ID in wei
        getTotalEthAssigned(stakingDurationId) {
            return this.rocketPool.then((rocketPool) => {
                return rocketPool.methods.getTotalEther('assigned', stakingDurationId).call();
            });
        }
        // Get the total network ether capacity by staking duration ID in wei
        getTotalEthCapacity(stakingDurationId) {
            return this.rocketPool.then((rocketPool) => {
                return rocketPool.methods.getTotalEther('capacity', stakingDurationId).call();
            });
        }
        // Get the current network utilisation by staking duration ID as a fraction
        getNetworkUtilisation(stakingDurationId) {
            return this.rocketPool.then((rocketPool) => {
                return rocketPool.methods.getNetworkUtilisation(stakingDurationId).call();
            }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
        }
        // Get a MinipoolContract instance
        getMinipoolContract(address) {
            return this.contracts.make('rocketMinipool', address).then((rocketMinipool) => {
                return new minipool_contract_1.default(this.web3, rocketMinipool);
            });
        }
    }
    // Exports
    exports.default = Pool;
});
define("rocketpool/settings/deposit", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rocket Pool deposit settings manager
     */
    class DepositSettings {
        // Constructor
        constructor(web3, contracts) {
            this.web3 = web3;
            this.contracts = contracts;
        }
        // Contract accessors
        get rocketDepositSettings() {
            return this.contracts.get('rocketDepositSettings');
        }
        /**
         * Getters
         */
        // Get whether deposits are currently allowed
        getDepositAllowed() {
            return this.rocketDepositSettings.then((rocketDepositSettings) => {
                return rocketDepositSettings.methods.getDepositAllowed().call();
            });
        }
        // Get the deposit chunk size in wei
        getDepositChunkSize() {
            return this.rocketDepositSettings.then((rocketDepositSettings) => {
                return rocketDepositSettings.methods.getDepositChunkSize().call();
            });
        }
        // Get the minimum deposit amount in wei
        getDepositMin() {
            return this.rocketDepositSettings.then((rocketDepositSettings) => {
                return rocketDepositSettings.methods.getDepositMin().call();
            });
        }
        // Get the maximum deposit amount in wei
        getDepositMax() {
            return this.rocketDepositSettings.then((rocketDepositSettings) => {
                return rocketDepositSettings.methods.getDepositMax().call();
            });
        }
        // Get the maximum number of chunks assigned at once
        getChunkAssignMax() {
            return this.rocketDepositSettings.then((rocketDepositSettings) => {
                return rocketDepositSettings.methods.getChunkAssignMax().call();
            }).then((value) => parseInt(value));
        }
        // Get the maximum deposit queue size in wei
        getDepositQueueSizeMax() {
            return this.rocketDepositSettings.then((rocketDepositSettings) => {
                return rocketDepositSettings.methods.getDepositQueueSizeMax().call();
            });
        }
        // Get whether deposit refunds are currently allowed
        getRefundDepositAllowed() {
            return this.rocketDepositSettings.then((rocketDepositSettings) => {
                return rocketDepositSettings.methods.getRefundDepositAllowed().call();
            });
        }
        // Get whether withdrawals are currently allowed
        getWithdrawalAllowed() {
            return this.rocketDepositSettings.then((rocketDepositSettings) => {
                return rocketDepositSettings.methods.getWithdrawalAllowed().call();
            });
        }
        // Get the fee for withdrawing from the minipool while staking, as a fraction
        getStakingWithdrawalFeePerc() {
            return this.rocketDepositSettings.then((rocketDepositSettings) => {
                return rocketDepositSettings.methods.getStakingWithdrawalFeePerc().call();
            }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
        }
        // Get the current maximum deposit amount in wei
        getCurrentDepositMax(durationId) {
            return this.rocketDepositSettings.then((rocketDepositSettings) => {
                return rocketDepositSettings.methods.getCurrentDepositMax(durationId).call();
            });
        }
    }
    // Exports
    exports.default = DepositSettings;
});
define("rocketpool/settings/group", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rocket Pool group settings manager
     */
    class GroupSettings {
        // Constructor
        constructor(web3, contracts) {
            this.web3 = web3;
            this.contracts = contracts;
        }
        // Contract accessors
        get rocketGroupSettings() {
            return this.contracts.get('rocketGroupSettings');
        }
        /**
         * Getters
         */
        // Get the default fee charged to the group's users by Rocket Pool as a fraction
        getDefaultFee() {
            return this.rocketGroupSettings.then((rocketGroupSettings) => {
                return rocketGroupSettings.methods.getDefaultFee().call();
            }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
        }
        // Get the maximum fee charged to the group's users by Rocket Pool as a fraction
        getMaxFee() {
            return this.rocketGroupSettings.then((rocketGroupSettings) => {
                return rocketGroupSettings.methods.getMaxFee().call();
            }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
        }
        // Get whether new group registration is currently allowed
        getNewAllowed() {
            return this.rocketGroupSettings.then((rocketGroupSettings) => {
                return rocketGroupSettings.methods.getNewAllowed().call();
            });
        }
        // Get the group registration fee in wei
        getNewFee() {
            return this.rocketGroupSettings.then((rocketGroupSettings) => {
                return rocketGroupSettings.methods.getNewFee().call();
            });
        }
        // Get the group registration fee payment address
        getNewFeeAddress() {
            return this.rocketGroupSettings.then((rocketGroupSettings) => {
                return rocketGroupSettings.methods.getNewFeeAddress().call();
            });
        }
    }
    // Exports
    exports.default = GroupSettings;
});
define("rocketpool/settings/minipool", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rocket Pool minipool settings manager
     */
    class MinipoolSettings {
        // Constructor
        constructor(web3, contracts) {
            this.web3 = web3;
            this.contracts = contracts;
        }
        // Contract accessors
        get rocketMinipoolSettings() {
            return this.contracts.get('rocketMinipoolSettings');
        }
        /**
         * Getters
         */
        // Get the total deposit amount required to launch a minipool in wei
        getMinipoolLaunchAmount() {
            return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
                return rocketMinipoolSettings.methods.getMinipoolLaunchAmount().call();
            });
        }
        // Get whether new minipools can currently be created
        getMinipoolCanBeCreated() {
            return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
                return rocketMinipoolSettings.methods.getMinipoolCanBeCreated().call();
            });
        }
        // Get whether new minipool creation is currently allowed
        getMinipoolNewEnabled() {
            return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
                return rocketMinipoolSettings.methods.getMinipoolNewEnabled().call();
            });
        }
        // Get whether minipool closure is currently allowed
        getMinipoolClosingEnabled() {
            return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
                return rocketMinipoolSettings.methods.getMinipoolClosingEnabled().call();
            });
        }
        // Get the maximum number of active minipools
        getMinipoolMax() {
            return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
                return rocketMinipoolSettings.methods.getMinipoolMax().call();
            }).then((value) => parseInt(value));
        }
        // Get the minipool withdrawal fee payment address
        getMinipoolWithdrawalFeeDepositAddress() {
            return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
                return rocketMinipoolSettings.methods.getMinipoolWithdrawalFeeDepositAddress().call();
            });
        }
        // Get the minipool timeout duration in seconds
        getMinipoolTimeout() {
            return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
                return rocketMinipoolSettings.methods.getMinipoolTimeout().call();
            }).then((value) => parseInt(value));
        }
        // Get the maximum size of the active minipool set
        getMinipoolActiveSetSize() {
            return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
                return rocketMinipoolSettings.methods.getMinipoolActiveSetSize().call();
            }).then((value) => parseInt(value));
        }
        // Get the minipool staking duration by ID in blocks
        getMinipoolStakingDuration(durationId) {
            return this.rocketMinipoolSettings.then((rocketMinipoolSettings) => {
                return rocketMinipoolSettings.methods.getMinipoolStakingDuration(durationId).call();
            }).then((value) => parseInt(value));
        }
    }
    // Exports
    exports.default = MinipoolSettings;
});
define("rocketpool/settings/node", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Rocket Pool node settings manager
     */
    class NodeSettings {
        // Constructor
        constructor(web3, contracts) {
            this.web3 = web3;
            this.contracts = contracts;
        }
        // Contract accessors
        get rocketNodeSettings() {
            return this.contracts.get('rocketNodeSettings');
        }
        /**
         * Getters
         */
        // Get whether new node registration is currently allowed
        getNewAllowed() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getNewAllowed().call();
            });
        }
        // Get the minimum ether balance for a node to register in wei
        getEtherMin() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getEtherMin().call();
            });
        }
        // Get the gas price to be used for node checkins in wei
        getCheckinGasPrice() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getCheckinGasPrice().call();
            });
        }
        // Get whether nodes are automatically set as inactive
        getInactiveAutomatic() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getInactiveAutomatic().call();
            });
        }
        // Get the duration after which to set a node failing to check in as inactive, in seconds
        getInactiveDuration() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getInactiveDuration().call();
            }).then((value) => parseInt(value));
        }
        // Get the maximum number of other nodes to check for activity on checkin
        getMaxInactiveNodeChecks() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getMaxInactiveNodeChecks().call();
            }).then((value) => parseInt(value));
        }
        // Get the fee charged to users by node operators as a fraction
        getFeePerc() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getFeePerc().call();
            }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
        }
        // Get the maximum fee charged to users by node operators as a fraction
        getMaxFeePerc() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getMaxFeePerc().call();
            }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
        }
        // Get the fee voting cycle duration in seconds
        getFeeVoteCycleDuration() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getFeeVoteCycleDuration().call();
            }).then((value) => parseInt(value));
        }
        // Get the fee change per voting cycle as a fraction
        getFeeVoteCyclePercChange() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getFeeVoteCyclePercChange().call();
            }).then((value) => parseFloat(this.web3.utils.fromWei(value, 'ether')));
        }
        // Get whether node deposits are currently allowed
        getDepositAllowed() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getDepositAllowed().call();
            });
        }
        // Get the duration that a node deposit reservation is valid for in seconds
        getDepositReservationTime() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getDepositReservationTime().call();
            }).then((value) => parseInt(value));
        }
        // Get whether node withdrawals are currently allowed
        getWithdrawalAllowed() {
            return this.rocketNodeSettings.then((rocketNodeSettings) => {
                return rocketNodeSettings.methods.getWithdrawalAllowed().call();
            });
        }
    }
    // Exports
    exports.default = NodeSettings;
});
define("rocketpool/tokens/ERC20", ["require", "exports", "utils/transaction"], function (require, exports, transaction_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * ERC20 token contract
     */
    class ERC20 {
        // Constructor
        constructor(web3, contracts, tokenContractName) {
            this.web3 = web3;
            this.contracts = contracts;
            this.tokenContractName = tokenContractName;
        }
        // Contract accessor
        get tokenContract() {
            return this.contracts.get(this.tokenContractName);
        }
        /**
         * Getters
         */
        // Get the token balance of an account
        balanceOf(account) {
            return this.tokenContract.then((tokenContract) => {
                return tokenContract.methods.balanceOf(account).call();
            });
        }
        // Get the allowance of a spender for an account
        allowance(account, spender) {
            return this.tokenContract.then((tokenContract) => {
                return tokenContract.methods.allowance(account, spender).call();
            });
        }
        /**
         * Mutators - Public
         */
        // Transfer tokens to a recipient
        transfer(to, amountWei, options, onConfirmation) {
            return this.tokenContract.then((tokenContract) => {
                return transaction_6.handleConfirmations(tokenContract.methods.transfer(to, amountWei).send(options), onConfirmation);
            });
        }
        // Approve an allowance for a spender
        approve(spender, amountWei, options, onConfirmation) {
            return this.tokenContract.then((tokenContract) => {
                return transaction_6.handleConfirmations(tokenContract.methods.approve(spender, amountWei).send(options), onConfirmation);
            });
        }
        // Transfer tokens from an account to a recipient if approved
        transferFrom(from, to, amountWei, options, onConfirmation) {
            return this.tokenContract.then((tokenContract) => {
                return transaction_6.handleConfirmations(tokenContract.methods.transferFrom(from, to, amountWei).send(options), onConfirmation);
            });
        }
    }
    // Exports
    exports.default = ERC20;
});
define("rocketpool/tokens/rpb", ["require", "exports", "utils/transaction", "rocketpool/tokens/ERC20"], function (require, exports, transaction_7, ERC20_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ERC20_1 = __importDefault(ERC20_1);
    /**
     * Rocket Pool RPB token manager
     */
    class RPB extends ERC20_1.default {
        // Constructor
        constructor(web3, contracts) {
            super(web3, contracts, 'rocketBETHToken');
        }
        /**
         * Mutators - Public
         */
        // Burn RPB for ETH
        burnForEth(amountWei, options, onConfirmation) {
            return this.tokenContract.then((tokenContract) => {
                return transaction_7.handleConfirmations(tokenContract.methods.burnTokensForEther(amountWei).send(options), onConfirmation);
            });
        }
    }
    // Exports
    exports.default = RPB;
});
define("rocketpool/tokens/rpl", ["require", "exports", "rocketpool/tokens/ERC20"], function (require, exports, ERC20_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ERC20_2 = __importDefault(ERC20_2);
    /**
     * Rocket Pool RPL token manager
     */
    class RPL extends ERC20_2.default {
        // Constructor
        constructor(web3, contracts) {
            super(web3, contracts, 'rocketPoolToken');
        }
    }
    // Exports
    exports.default = RPL;
});
define("rocketpool/rocketpool", ["require", "exports", "rocketpool/contracts/contracts", "rocketpool/deposit/deposit", "rocketpool/group/group", "rocketpool/node/node", "rocketpool/pool/pool", "rocketpool/settings/deposit", "rocketpool/settings/group", "rocketpool/settings/minipool", "rocketpool/settings/node", "rocketpool/tokens/rpb", "rocketpool/tokens/rpl"], function (require, exports, contracts_1, deposit_1, group_1, node_1, pool_1, deposit_2, group_2, minipool_1, node_2, rpb_1, rpl_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    contracts_1 = __importDefault(contracts_1);
    deposit_1 = __importDefault(deposit_1);
    group_1 = __importDefault(group_1);
    node_1 = __importDefault(node_1);
    pool_1 = __importDefault(pool_1);
    deposit_2 = __importDefault(deposit_2);
    group_2 = __importDefault(group_2);
    minipool_1 = __importDefault(minipool_1);
    node_2 = __importDefault(node_2);
    rpb_1 = __importDefault(rpb_1);
    rpl_1 = __importDefault(rpl_1);
    /**
     * Main Rocket Pool library class
     */
    class RocketPool {
        // Constructor
        constructor(web3, RocketStorage) {
            this.web3 = web3;
            this.RocketStorage = RocketStorage;
            // Initialise services
            this.contracts = new contracts_1.default(web3, RocketStorage);
            this.deposit = new deposit_1.default(web3, this.contracts);
            this.group = new group_1.default(web3, this.contracts);
            this.node = new node_1.default(web3, this.contracts);
            this.pool = new pool_1.default(web3, this.contracts);
            this.settings = {
                deposit: new deposit_2.default(web3, this.contracts),
                group: new group_2.default(web3, this.contracts),
                minipool: new minipool_1.default(web3, this.contracts),
                node: new node_2.default(web3, this.contracts),
            };
            this.tokens = {
                rpb: new rpb_1.default(web3, this.contracts),
                rpl: new rpl_1.default(web3, this.contracts),
            };
        }
    }
    // Exports
    exports.default = RocketPool;
});
//# sourceMappingURL=rocketpool.js.map