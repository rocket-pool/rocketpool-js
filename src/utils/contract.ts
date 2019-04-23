// Imports
import pako from 'pako';
import { ABIDefinition } from 'web3/eth/abi';


// Contract artifact
export interface ContractArtifact {
	abi: ABIDefinition[],
	networks: {[id: string]: {address: string}},
}


// Decode contract ABI
export function decodeAbi(encodedAbi: string): ABIDefinition[] {
    return (JSON.parse(pako.inflate(Buffer.from(encodedAbi, 'base64'), {to: 'string'})) as ABIDefinition[]);
}
