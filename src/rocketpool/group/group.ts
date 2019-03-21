// Imports
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool groups manager
 */
class Group {


    // Contracts
    private rocketGroupAPI: Promise<Contract>;


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {
        this.rocketGroupAPI = this.contracts.get('rocketGroupAPI');
    }


}


// Exports
export default Group;
