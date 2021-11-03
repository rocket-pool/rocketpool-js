/// <reference types="node" />
import { DepositData } from "@chainsafe/lodestar-types/lib/types";
export declare function getValidatorPubkey(): Buffer;
export declare function getValidatorSignature(): Buffer;
export declare function getDepositDataRoot(depositData: DepositData): Buffer;
