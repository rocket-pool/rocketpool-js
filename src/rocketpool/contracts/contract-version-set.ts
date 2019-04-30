// Imports
import Contract from 'web3/eth/contract';
import { BlockType } from 'web3/eth/types';
import { EventLog } from 'web3/types';


/**
 * Contract version set wrapper
 */
class ContractVersionSet {


    // Constructor
    public constructor(public contracts: Contract[]) {} // Oldest contract versions first


    /**
     * Getters
     */


    // Get the current version of the contract
    public current(): Contract {
        return this.contracts[this.contracts.length - 1];
    }


    // Get the first version of the contract
    public first(): Contract {
        return this.contracts[0];
    }


    // Get the version of the contract at the specified version index
    public at(versionIndex: number): Contract {
        return this.contracts[versionIndex - 1];
    }


    // Get past events from contract instances (oldest events first)
    public getPastEvents(eventName: string, options?: {filter?: object; fromBlock?: BlockType; toBlock?: BlockType; topics?: string[]}): Promise<EventLog[]> {
        return Promise.all(this.contracts.map((contract: Contract): Promise<EventLog[]> => contract.getPastEvents(eventName, options)))
        .then((eventLists: EventLog[][]): EventLog[] => eventLists.reduce((acc: EventLog[], val: EventLog[]): EventLog[] => acc.concat(val), []));
    }


}


// Exports
export default ContractVersionSet;
