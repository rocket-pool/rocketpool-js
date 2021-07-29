'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getValidatorPubkey = getValidatorPubkey;
exports.getValidatorSignature = getValidatorSignature;
exports.getDepositDataRoot = getDepositDataRoot;
// Imports
var ssz = require('@chainsafe/ssz');
var types = require('@chainsafe/lodestar-types/lib/ssz/presets/mainnet').types;
// Current pubkey index
var pubkeyIndex = 0;
// Create a new validator pubkey
function getValidatorPubkey() {
    var index = ++pubkeyIndex;
    return Buffer.from(index.toString(16).padStart(96, '0'), 'hex');
}
// Create a validator signature
// TODO: implement correctly once BLS library found
function getValidatorSignature() {
    return Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' + '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' + '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex');
}
// Create validator deposit data root
function getDepositDataRoot(depositData) {
    return types.DepositData.hashTreeRoot(depositData);
}
//# sourceMappingURL=beacon.js.map