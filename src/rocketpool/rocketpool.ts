// Imports
import Web3 from 'web3';
import Contracts from './contracts/contracts';
import Deposit from './deposit/deposit';
import Group from './group/group';
import Node from './node/node';


/**
 * Main Rocket Pool library class
 */
class RocketPool {


    // Services
    public readonly contracts: Contracts;
    public readonly deposit: Deposit;
    public readonly group: Group;
    public readonly node: Node;


    // Constructor
    public constructor(public readonly web3: Web3) {

        // Initialise services
        this.contracts = new Contracts(web3);
        this.deposit = new Deposit(web3, this.contracts);
        this.group = new Group(web3, this.contracts);
        this.node = new Node(web3, this.contracts);

    }


}


// Exports
export default RocketPool;
