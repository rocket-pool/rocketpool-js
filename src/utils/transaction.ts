// Imports
import PromiEvent from 'web3/promiEvent';
import { TransactionReceipt } from 'web3/types';


// Transaction confirmation handler
export interface ConfirmationHandler {
    (confirmationNumber: number, receipt: TransactionReceipt): void;
}


// Handle transaction confirmations
export function handleConfirmations(pe: PromiEvent<TransactionReceipt>, onConfirmation?: ConfirmationHandler): PromiEvent<TransactionReceipt> {
    if (onConfirmation !== undefined) pe.on('confirmation', onConfirmation);
    return pe;
}
