import { PromiEvent, TransactionReceipt } from "web3-core";
export interface ConfirmationHandler {
    (confirmationNumber: number, receipt: TransactionReceipt): void;
}
export declare function handleConfirmations(pe: PromiEvent<TransactionReceipt>, onConfirmation?: ConfirmationHandler): PromiEvent<TransactionReceipt>;
