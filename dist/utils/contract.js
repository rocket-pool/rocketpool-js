// Imports
import pako from 'pako';
// Decode contract ABI
export function decodeAbi(encodedAbi) {
    return JSON.parse(pako.inflate(Buffer.from(encodedAbi, 'base64'), { to: 'string' }));
}
//# sourceMappingURL=contract.js.map