import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { AbiInput, AbiItem } from "web3-utils";
export declare function getTxContractEvents(web3: Web3, txReceipt: TransactionReceipt, contractAddress: string, eventName: string, eventParams: AbiInput[]): any;
export declare function compressABI(abi: AbiItem[]): string;
export declare function decompressABI(abi: string): any;
