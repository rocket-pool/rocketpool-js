// Imports
import pako from 'pako';
import { AbiItem } from 'web3-utils/types';


// Contract artifact
export interface ContractArtifact {
	abi: AbiItem[],
	networks: {[id: string]: {address: string}},
}


// Decode contract ABI
export function decodeAbi(encodedAbi: string): AbiItem[] {
    return (JSON.parse(pako.inflate(Buffer.from(encodedAbi, 'base64'), {to: 'string'})) as AbiItem[]);
}
