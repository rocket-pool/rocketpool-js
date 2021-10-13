// Imports
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { ContractArtifact, decodeAbi } from "../../utils/contract";

/**
 * Rocket Pool Contract Manager
 */
class Contracts {
	// Contracts
	public readonly rocketStorage: Promise<Contract>;
	private addresses: { [name: string]: Promise<string> } = {};
	private abis: { [name: string]: Promise<AbiItem[]> } = {};
	private contracts: { [name: string]: Promise<Contract> } = {};

	/**
	 * Create a new Contract instance.
	 *
	 * @param web3 A valid Web3 instance
	 * @param RocketStorage a RocketStorage address as a string or ContractArtifact (JSON ABI file)
	 */
	public constructor(private web3: Web3, private RocketStorage: ContractArtifact | string) {
		// Initialise rocketStorage contract promise
		if (typeof RocketStorage === "string") {
			this.rocketStorage = Promise.resolve(new this.web3.eth.Contract(RocketStorageAbi, RocketStorage));
		} else {
			this.rocketStorage = this.web3.eth.net
				.getId()
				.then((networkId: number): Contract => new this.web3.eth.Contract(RocketStorage.abi, RocketStorage.networks[networkId].address));
		}
	}

	// Load address/es by name
	public address(name: string): Promise<string>;
	public address(names: string[]): Promise<string[]>;
	public address(name: any): any {
		// Array mode
		if (typeof name === "object") return Promise.all(name.map((n: string): Promise<string> => this.address(n)));

		// Use cached address promise
		if (!this.addresses[name]) {
			this.addresses[name] = this.rocketStorage.then(
				(rocketStorage: Contract): Promise<string> => rocketStorage.methods.getAddress(this.web3.utils.soliditySha3("contract.address", name)).call()
			);
			return this.addresses[name];
		} else {
			return this.addresses[name];
		}

		// Load address
	}

	// Load ABI/s by name
	public abi(name: string): Promise<AbiItem[]>;
	public abi(names: string[]): Promise<AbiItem[][]>;
	public abi(name: any): any {
		// Array mode
		if (typeof name === "object") return Promise.all(name.map((n: string): Promise<AbiItem[]> => this.abi(n)));

		// Use cached ABI promise
		if (!this.abis[name]) {
			this.abis[name] = this.rocketStorage
				.then((rocketStorage: Contract): Promise<string> => rocketStorage.methods.getString(this.web3.utils.soliditySha3("contract.abi", name)).call())
				.then((abi: string): AbiItem[] => decodeAbi(abi));
			return this.abis[name];
		} else {
			return this.abis[name];
		}

		// Load and decode ABI
	}

	// Load contract/s by name
	public get(name: string): Promise<Contract>;
	public get(names: string[]): Promise<Contract[]>;
	public get(name: any): any {
		// Array mode
		if (typeof name === "object") return Promise.all(name.map((n: string): Promise<Contract> => this.get(n)));

		// Use cached contract promise
		if (!this.contracts[name]) {
			this.contracts[name] = this.rocketStorage
				.then((rocketStorage: Contract): Promise<[string, AbiItem[]]> => Promise.all([this.address(name), this.abi(name)]))
				.then(([address, abi]: [string, AbiItem[]]): Contract => new this.web3.eth.Contract(abi, address));
			return this.contracts[name];
		} else {
			return this.contracts[name];
		}

		// Load contract data and initialise
	}

	/**
	 * Create a new contract instance with the specified ABI name and address
	 * @param name A string representing the name of the contract
	 * @param address A string representing the address of the specific instance
	 * @returns a Promise<Contract> that resolves to a web3.eth.contract instance of the contract
	 *
	 * @example using Typescript
	 * ```ts
	 * const minipool = await rp.contracts.make("rocketMinipoolDelegate", "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294");
	 * ```
	 */
	public make(name: string, address: string): Promise<Contract> {
		return this.abi(name).then((abi: AbiItem[]): Contract => new this.web3.eth.Contract(abi, address));
	}
}

const RocketStorageAbi = <AbiItem[]>[
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "_key",
				type: "bytes32",
			},
		],
		name: "getAddress",
		outputs: [
			{
				internalType: "address",
				name: "r",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
		constant: true,
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "_key",
				type: "bytes32",
			},
		],
		name: "getString",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
		constant: true,
	},
];

// Exports
export default Contracts;
