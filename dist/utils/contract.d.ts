import { AbiItem } from "web3-utils";
export interface ContractArtifact {
    abi: AbiItem[];
    networks: {
        [id: string]: {
            address: string;
        };
    };
}
export declare function decodeAbi(encodedAbi: string): AbiItem[];
