import ContractVersionSet from './contract-version-set';
import { decodeAbi } from '../../utils/contract';
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
            .then((abi) => decodeAbi(abi));
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
    // Load all versions of a contract by name
    versions(name) {
        return Promise.all([
            this.rocketStorage.then((rocketStorage) => rocketStorage.methods.getAddress(this.web3.utils.soliditySha3('contract.name', name)).call()),
            this.get('rocketUpgrade').then((rocketUpgrade) => rocketUpgrade.getPastEvents('ContractUpgraded', { fromBlock: 0 })),
        ]).then(([currentAddress, upgradeEvents]) => {
            // Get all addresses of the contract versions
            let contractAddresses = [];
            while (currentAddress) {
                contractAddresses.push(currentAddress);
                let lastUpgrade = upgradeEvents.find((event) => event.returnValues._newContractAddress.toLowerCase() == currentAddress.toLowerCase());
                currentAddress = lastUpgrade ? lastUpgrade.returnValues._oldContractAddress : null;
            }
            return contractAddresses.reverse();
        })
            .then((addresses) => Promise.all(addresses.map((address) => this.make(name, address))))
            .then((contracts) => new ContractVersionSet(contracts));
    }
    // Create a new contract instance with the specified ABI name and address
    make(name, address) {
        return this.abi(name).then((abi) => new this.web3.eth.Contract(abi, address));
    }
}
// Exports
export default Contracts;
//# sourceMappingURL=contracts.js.map