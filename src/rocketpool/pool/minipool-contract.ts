// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';


/**
 * RocketMinipool contract instance wrapper
 */
class MinipoolContract {


    // Constructor
    public constructor(private web3: Web3, private contract: Contract) {}


}


// Exports
export default MinipoolContract;
