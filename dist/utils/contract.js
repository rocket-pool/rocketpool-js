"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.decodeAbi = decodeAbi;

var _pako = require("pako");

var _pako2 = _interopRequireDefault(_pako);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// Decode contract ABI
function decodeAbi(encodedAbi) {
  return JSON.parse(
    _pako2.default.inflate(Buffer.from(encodedAbi, "base64"), { to: "string" })
  );
}
//# sourceMappingURL=contract.js.map
// Imports
