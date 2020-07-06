// Imports
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { ContractArtifact, decodeAbi } from '../../utils/contract';


/**
 * Rocket Pool contract manager
 */
class Contracts {


    // Contracts
    public readonly rocketStorage: Promise<Contract>;
    private addresses: {[name: string]: Promise<string>} = {};
    private abis: {[name: string]: Promise<AbiItem[]>} = {};
    private contracts: {[name: string]: Promise<Contract>} = {};


    // Constructor
    public constructor(private web3: Web3, private RocketStorage: ContractArtifact) {

        // Initialise rocketStorage contract promise
        this.rocketStorage = this.web3.eth.net.getId().then((networkId: number): Contract => new this.web3.eth.Contract(RocketStorage.abi, RocketStorage.networks[networkId].address));

    }


    // Load address/es by name
    public address(name: string): Promise<string>;
    public address(names: string[]): Promise<string[]>;
    public address(name: any): any {

        // Array mode
        if (typeof name === "object") return Promise.all(name.map((n: string): Promise<string> => this.address(n)));

        // Use cached address promise
        if (this.addresses[name]) return this.addresses[name];

        // Load address
        this.addresses[name] = this.rocketStorage
        .then((rocketStorage: Contract): Promise<string> => rocketStorage.methods.getAddress(this.web3.utils.soliditySha3('contract.name', name)).call());

        // Return address promise
        return this.addresses[name];

    }


    // Load ABI/s by name
    public abi(name: string): Promise<AbiItem[]>;
    public abi(names: string[]): Promise<AbiItem[][]>;
    public abi(name: any): any {

        // Array mode
        if (typeof name === "object") return Promise.all(name.map((n: string): Promise<AbiItem[]> => this.abi(n)));

        // Use cached ABI promise
        if (this.abis[name]) return this.abis[name];

        // Load and decode ABI
        this.abis[name] = this.rocketStorage
        .then((rocketStorage: Contract): Promise<string> => rocketStorage.methods.getString(this.web3.utils.soliditySha3('contract.abi', name)).call())
        .then((abi: string): AbiItem[] => decodeAbi(abi));

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
        this.contracts[name] = this.rocketStorage.then((rocketStorage: Contract): Promise<[string, AbiItem[]]> => Promise.all([
            this.address(name),
            this.abi(name),
        ])).then(([address, abi]: [string, AbiItem[]]): Contract => new this.web3.eth.Contract(abi, address));

        // Return contract promise
        return this.contracts[name];

    }


    // Create a new contract instance with the specified ABI name and address
    public make(name: string, address: string): Promise<Contract> {
        return this.abi(name).then((abi: AbiItem[]): Contract => new this.web3.eth.Contract(abi, address));
    }


}


// Exports
export default Contracts;
