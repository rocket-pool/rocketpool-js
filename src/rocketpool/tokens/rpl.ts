// Imports
import Web3 from 'web3';
import Contracts from '../contracts/contracts';
import ERC20 from './erc20';


/**
 * Rocket Pool RPL token manager
 */
class RPL extends ERC20 {


    // Constructor
    public constructor(web3: Web3, contracts: Contracts) {
        super(web3, contracts, 'rocketPoolToken');
    }


}


// Exports
export default RPL;
