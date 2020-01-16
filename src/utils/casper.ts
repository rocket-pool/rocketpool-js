// Imports
const crypto = require('crypto');


// Create a random validator pubkey
export function getValidatorPubkey(): Buffer {
    return crypto.randomBytes(48);
}


// Create a validator signature
// TODO: implement correctly once BLS library found
export function getValidatorSignature(): Buffer {
    return Buffer.from(
        '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' +
        '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' +
        '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    'hex');
}
