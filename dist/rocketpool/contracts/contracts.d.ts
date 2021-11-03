import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { ContractArtifact } from "../../utils/contract";
/**
 * Rocket Pool Contract Manager
 */
declare class Contracts {
    private web3;
    private RocketStorage;
    readonly rocketStorage: Promise<Contract>;
    private addresses;
    private abis;
    private contracts;
    /**
     * Create a new Contract instance.
     *
     * @param web3 A valid Web3 instance
     * @param RocketStorage a RocketStorage address as a string or ContractArtifact (JSON ABI file)
     */
    constructor(web3: Web3, RocketStorage: ContractArtifact | string);
    address(name: string): Promise<string>;
    address(names: string[]): Promise<string[]>;
    abi(name: string): Promise<AbiItem[]>;
    abi(names: string[]): Promise<AbiItem[][]>;
    get(name: string): Promise<Contract>;
    get(names: string[]): Promise<Contract[]>;
    /**
     * Create a new contract instance with the specified ABI name and address
     * @param name A string representing the name of the contract
     * @param address A string representing the address of the specific instance
     * @returns a Promise<Contract\> that resolves to a web3.eth.contract instance of the contract
     *
     * @example using Typescript
     * ```ts
     * const minipool = await rp.contracts.make("rocketMinipoolDelegate", "0x24fBeD7Ecd625D3f0FD19a6c9113DEd436172294");
     * ```
     */
    make(name: string, address: string): Promise<Contract>;
}
export default Contracts;
