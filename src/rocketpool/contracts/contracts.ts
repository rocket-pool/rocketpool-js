// Imports
import Web3 from 'web3';
import { ABIDefinition } from 'web3/eth/abi';
import Contract from 'web3/eth/contract';
import { EventLog } from 'web3/types';
import ContractVersionSet from './contract-version-set';
import { ContractArtifact, decodeAbi } from '../../utils/contract';


/**
 * Rocket Pool contract manager
 */
class Contracts {


    // Contracts
    private rocketStorage: Promise<Contract>;
    private contracts: {[name: string]: Promise<Contract>} = {};
    private abis: {[name: string]: Promise<ABIDefinition[]>} = {};


    // Constructor
    public constructor(private web3: Web3, private RocketStorage: ContractArtifact) {

        // Initialise rocketStorage contract promise
        this.rocketStorage = this.web3.eth.net.getId().then((networkId: number): Contract => new this.web3.eth.Contract(RocketStorage.abi, RocketStorage.networks[networkId].address));

    }


    // Load ABI/s by name
    public abi(name: string): Promise<ABIDefinition[]>;
    public abi(names: string[]): Promise<ABIDefinition[][]>;
    public abi(name: any): any {

        // Array mode
        if (typeof name === "object") return Promise.all(name.map((n: string): Promise<ABIDefinition[]> => this.abi(n)));

        // Use cached ABI promise
        if (this.abis[name]) return this.abis[name];

        // Load and decode ABI
        this.abis[name] = this.rocketStorage
        .then((rocketStorage: Contract): Promise<string> => rocketStorage.methods.getString(this.web3.utils.soliditySha3('contract.abi', name)).call())
        .then((abi: string): ABIDefinition[] => decodeAbi(abi));

        // Return ABI promise
        return this.abis[name];

    }


    // Load contract/s by name
    public get(name: string): Promise<Contract>;
    public get(names: string[]): Promise<Contract[]>;
    public get(name: any): any {

        // Array mode
        if (typeof name === "object") return Promise.all(name.map((n: string): Promise<Contract> => this.get(n)));

        // Use cached contract promise
        if (this.contracts[name]) return this.contracts[name];

        // Load contract data and initialise
        this.contracts[name] = this.rocketStorage.then((rocketStorage: Contract): Promise<[string, ABIDefinition[]]> => Promise.all([
            rocketStorage.methods.getAddress(this.web3.utils.soliditySha3('contract.name', name)).call(),
            this.abi(name),
        ])).then(([address, abi]: [string, ABIDefinition[]]): Contract => new this.web3.eth.Contract(abi, address));

        // Return contract promise
        return this.contracts[name];

    }


    // Load all versions of a contract by name
    public versions(name: string): Promise<ContractVersionSet> {
        return Promise.all([
            this.rocketStorage.then((rocketStorage: Contract): Promise<string> => rocketStorage.methods.getAddress(this.web3.utils.soliditySha3('contract.name', name)).call()),
            this.get('rocketUpgrade').then((rocketUpgrade: Contract): Promise<EventLog[]> => rocketUpgrade.getPastEvents('ContractUpgraded', {fromBlock: 0})),
        ]).then(([currentAddress, upgradeEvents]: [string, EventLog[]]): string[] => {

            // Get all addresses of the contract versions
            let contractAddresses: string[] = [];
            while (currentAddress) {
                contractAddresses.push(currentAddress);
                let lastUpgrade: EventLog | undefined = upgradeEvents.find((event: EventLog) => event.returnValues._newContractAddress.toLowerCase() == currentAddress.toLowerCase());
                currentAddress = lastUpgrade ? lastUpgrade.returnValues._oldContractAddress : null;
            }
            return contractAddresses.reverse();

        })
        .then((addresses: string[]): Promise<Contract[]> => Promise.all(addresses.map((address: string): Promise<Contract> => this.make(name, address))))
        .then((contracts: Contract[]): ContractVersionSet => new ContractVersionSet(contracts));
    }


    // Create a new contract instance with the specified ABI name and address
    public make(name: string, address: string): Promise<Contract> {
        return this.abi(name).then((abi: ABIDefinition[]): Contract => new this.web3.eth.Contract(abi, address));
    }


}


// Exports
export default Contracts;
