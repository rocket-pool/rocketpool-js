"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleConfirmations = handleConfirmations;
// Handle transaction confirmations
function handleConfirmations(pe, onConfirmation) {
    if (onConfirmation !== undefined) pe.on("confirmation", onConfirmation);
    return pe;
}
//# sourceMappingURL=transaction.js.map