// Imports
import Web3 from 'web3';
const ssz = require('@chainsafe/ssz');


// Deposit data interface
export interface DepositData {
    pubkey: Buffer;
    withdrawal_credentials: Buffer;
    amount: number;
    signature: Buffer;
}


// Get RP withdrawal credentials
export function getWithdrawalCredentials(web3: Web3): Buffer {
    // Hash of pubkey 0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef with first byte zeroed
    return Buffer.from('00d234647c45290c9884ba3aceccc7da5cfd19cfa5ccfed70fe75712578d3bb1', 'hex');
}


// Get validator deposit data root
export function getValidatorDepositDataRoot(depositData: DepositData): Buffer {
    return ssz.hashTreeRoot(depositData, {fields: [
        ['pubkey', 'bytes48'],
        ['withdrawal_credentials', 'bytes32'],
        ['amount', 'uint64'],
        ['signature', 'bytes96'],
    ]});
}
