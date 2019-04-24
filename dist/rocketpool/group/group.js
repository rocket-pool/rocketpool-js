import { handleConfirmations } from '../../utils/transaction';
import GroupContract from './group-contract';
import GroupAccessorContract from './group-accessor-contract';
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
            return new GroupContract(this.web3, rocketGroupContract);
        });
    }
    // Get a GroupAccessorContract instance
    getAccessorContract(address) {
        return this.contracts.make('rocketGroupAccessorContract', address).then((rocketGroupAccessorContract) => {
            return new GroupAccessorContract(this.web3, rocketGroupAccessorContract);
        });
    }
    /**
     * Mutators - Public
     */
    // Register a group
    add(name, stakingFeeFraction, options, onConfirmation) {
        return this.rocketGroupAPI.then((rocketGroupAPI) => {
            return handleConfirmations(rocketGroupAPI.methods.add(name, this.web3.utils.toWei(stakingFeeFraction.toString(), 'ether')).send(options), onConfirmation);
        });
    }
    // Create a default accessor contract for a group
    createDefaultAccessor(groupId, options, onConfirmation) {
        return this.rocketGroupAPI.then((rocketGroupAPI) => {
            return handleConfirmations(rocketGroupAPI.methods.createDefaultAccessor(groupId).send(options), onConfirmation);
        });
    }
}
// Exports
export default Group;
//# sourceMappingURL=group.js.map