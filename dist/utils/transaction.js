// Handle transaction confirmations
export function handleConfirmations(pe, onConfirmation) {
    if (onConfirmation !== undefined)
        pe.on('confirmation', onConfirmation);
    return pe;
}
//# sourceMappingURL=transaction.js.map