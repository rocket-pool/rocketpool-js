// Imports
import Contract from 'web3/eth/contract';
import { BlockType } from 'web3/eth/types';
import { EventLog } from 'web3/types';


/**
 * Contract version set wrapper
 */
class ContractVersionSet {


    // Constructor
    public constructor(public contracts: Contract[]) {}


    /**
     * Getters
     */


    // Get past events from contract instances
    public getPastEvents(eventName: string, options?: {filter?: object; fromBlock?: BlockType; toBlock?: BlockType; topics?: string[]}): Promise<EventLog[]> {
        return Promise.all(this.contracts.map((contract: Contract): Promise<EventLog[]> => contract.getPastEvents(eventName, options)))
        .then((eventLists: EventLog[][]): EventLog[] => eventLists.reduce((acc: EventLog[], val: EventLog[]): EventLog[] => acc.concat(val), []));
    }


}


// Exports
export default ContractVersionSet;
