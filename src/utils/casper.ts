// Imports
const crypto = require('crypto');
const ssz = require('@chainsafesystems/ssz');


// Create a serialised DepositInput object
export function makeDepositInput(web3: any): Buffer {
    const withdrawalPubkey: string = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    // Get pubkey
    let pubkey: Buffer = crypto.randomBytes(48);

    // Get withdrawal credentials
    let withdrawalCredentials: Buffer = Buffer.concat([
        Buffer.from('00', 'hex'), // BLS_WITHDRAWAL_PREFIX_BYTE
        Buffer.from(web3.utils.sha3(Buffer.from(withdrawalPubkey, 'hex')).substr(2), 'hex').slice(1) // Last 31 bytes of withdrawal pubkey hash
    ], 32);

    // Get proof of possession
    // :TODO: implement correctly once BLS library found
    let proofOfPossession: Buffer = Buffer.from(
        '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' +
        '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' +
        '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        'hex'
    );

    // Return depositInput
    return ssz.serialize(
        {
            'pubkey': pubkey,
            'withdrawal_credentials': withdrawalCredentials,
            'proof_of_possession': proofOfPossession,
        },
        {fields: [
            ['pubkey', 'bytes48'],
            ['withdrawal_credentials', 'bytes32'],
            ['proof_of_possession', 'bytes96'],
        ]}
    );

}
