// Imports
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import RocketStorage from '../../contracts/RocketStorage.json';
import { decodeAbi } from '../../utils/contract'


/**
 * Rocket Pool contract manager
 */
class ContractManager {


    // Contracts
    private rocketStorage: Promise<Contract>;
    private contracts: {[name: string]: Promise<Contract>} = {};
    private abis: {[name: string]: Promise<AbiItem[]>} = {};


    // Constructor
    constructor(private web3: Web3) {

        // Initialise rocketStorage contract promise
        this.rocketStorage = this.web3.eth.net.getId().then((networkId: number): Contract => new this.web3.eth.Contract(
            (RocketStorage.abi as AbiItem[]),
            (RocketStorage.networks as {[id: string]: {address: string}})[networkId].address
        ));

    }


    // Load an ABI by name
    abi(name: string): Promise<AbiItem[]> {

        // Use cached ABI promise
        if (this.abis[name]) return this.abis[name];

        // Load and decode ABI
        this.abis[name] = this.rocketStorage
        .then((rocketStorage: Contract): string => rocketStorage.methods.getString(this.web3.utils.soliditySha3('contract.abi', name)).call())
        .then((abi: string): AbiItem[] => decodeAbi(abi));

        // Return ABI promise
        return this.abis[name];

    }


    // Load a contract by name
    get(name: string): Promise<Contract> {

        // Use cached contract promise
        if (this.contracts[name]) return this.contracts[name];

        // Load contract
        this.contracts[name] = this.rocketStorage.then((rocketStorage: Contract): Promise<[string, AbiItem[]]> => Promise.all([

            // Get contract address and ABI
            rocketStorage.methods.getAddress(this.web3.utils.soliditySha3('contract.name', name)).call(),
            this.abi(name),

        ])).then(([address, abi]: [string, AbiItem[]]): Contract => new this.web3.eth.Contract(abi, address));

        // Return contract promise
        return this.contracts[name];

    }


    // Create a new contract instance with the specified ABI name and address
    make(name: string, address: string): Promise<Contract> {
        return this.abi(name).then((abi: AbiItem[]): Contract => new this.web3.eth.Contract(abi, address));
    }


}


// Exports
export default ContractManager;
