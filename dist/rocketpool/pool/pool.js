import MinipoolContract from './minipool-contract';
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
            return new MinipoolContract(this.web3, rocketMinipool);
        });
    }
}
// Exports
export default Pool;
//# sourceMappingURL=pool.js.map