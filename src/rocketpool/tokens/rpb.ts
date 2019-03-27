// Imports
import Web3 from 'web3';
import Contracts from '../contracts/contracts';
import ERC20 from './ERC20';


/**
 * Rocket Pool RPB token manager
 */
class RPB extends ERC20 {


    // Constructor
    public constructor(web3: Web3, contracts: Contracts) {
        super(web3, contracts, 'rocketBETHToken');
    }


}


// Exports
export default RPB;
