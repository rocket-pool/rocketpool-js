// Imports
import Web3 from 'web3';
const ssz = require('@chainsafe/ssz');


// Get RP withdrawal credentials
export function getWithdrawalCredentials(web3: Web3): Buffer {
    const withdrawalPubkey: string = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    return Buffer.concat([
        Buffer.from('00', 'hex'), // BLS_WITHDRAWAL_PREFIX_BYTE
        Buffer.from(web3.utils.sha3(Buffer.from(withdrawalPubkey, 'hex')).substr(2), 'hex').slice(1) // Last 31 bytes of withdrawal pubkey hash
    ], 32);
}


// Get validator deposit data root
export function getValidatorDepositDataRoot(depositData): Buffer {
    return ssz.hashTreeRoot(depositData, {fields: [
        ['pubkey', 'bytes48'],
        ['withdrawal_credentials', 'bytes32'],
        ['amount', 'uint64'],
        ['signature', 'bytes96'],
    ]});
}
