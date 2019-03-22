// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool deposit manager
 */
class Deposit {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDepositAPI(): Promise<Contract> {
        return this.contracts.get('rocketDepositAPI');
    }


}


// Exports
export default Deposit;
