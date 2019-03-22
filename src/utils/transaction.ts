// Imports
import { BN } from 'bn.js';

// Transaction send options
export interface SendOptions {
	from?: string;
	gasPrice?: BN;
	gas?: number;
	value?: BN;
}
