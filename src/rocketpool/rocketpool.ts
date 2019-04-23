// Imports
import Web3 from 'web3';
import { ContractArtifact } from '../utils/contract';
import Contracts from './contracts/contracts';
import Deposit from './deposit/deposit';
import Group from './group/group';
import Node from './node/node';
import Pool from './pool/pool';
import DepositSettings from './settings/deposit';
import GroupSettings from './settings/group';
import MinipoolSettings from './settings/minipool';
import NodeSettings from './settings/node';
import RPB from './tokens/rpb';
import RPL from './tokens/rpl';


/**
 * Main Rocket Pool library class
 */
class RocketPool {


    // Services
    public readonly contracts: Contracts;
    public readonly deposit: Deposit;
    public readonly group: Group;
    public readonly node: Node;
    public readonly pool: Pool;
    public readonly settings: {deposit: DepositSettings, group: GroupSettings, minipool: MinipoolSettings, node: NodeSettings};
    public readonly tokens: {rpb: RPB, rpl: RPL};


    // Constructor
    public constructor(public readonly web3: Web3, public readonly RocketStorage: ContractArtifact) {

        // Initialise services
        this.contracts = new Contracts(web3, RocketStorage);
        this.deposit = new Deposit(web3, this.contracts);
        this.group = new Group(web3, this.contracts);
        this.node = new Node(web3, this.contracts);
        this.pool = new Pool(web3, this.contracts);
        this.settings = {
            deposit: new DepositSettings(web3, this.contracts),
            group: new GroupSettings(web3, this.contracts),
            minipool: new MinipoolSettings(web3, this.contracts),
            node: new NodeSettings(web3, this.contracts),
        };
        this.tokens = {
            rpb: new RPB(web3, this.contracts),
            rpl: new RPL(web3, this.contracts),
        };

    }


}


// Exports
export default RocketPool;
