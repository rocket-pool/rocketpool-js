import { handleConfirmations } from '../../utils/transaction';
import NodeContract from './node-contract';
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
            return new NodeContract(this.web3, rocketNodeContract);
        });
    }
    /**
     * Mutators - Public
     */
    // Register a node
    add(timezone, options, onConfirmation) {
        return this.rocketNodeAPI.then((rocketNodeAPI) => {
            return handleConfirmations(rocketNodeAPI.methods.add(timezone).send(options), onConfirmation);
        });
    }
    /**
     * Mutators - Restricted to the node owner address
     */
    // Set a node's timezone location
    setTimezoneLocation(timezone, options, onConfirmation) {
        return this.rocketNodeAPI.then((rocketNodeAPI) => {
            return handleConfirmations(rocketNodeAPI.methods.setTimezoneLocation(timezone).send(options), onConfirmation);
        });
    }
}
// Exports
export default Node;
//# sourceMappingURL=node.js.map