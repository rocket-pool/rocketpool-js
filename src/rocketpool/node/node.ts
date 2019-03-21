// Imports
import Web3 from 'web3';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool node manager
 */
class Node {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


}


// Exports
export default Node;
