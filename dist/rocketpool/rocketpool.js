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
    // Constructor
    constructor(web3, RocketStorage) {
        this.web3 = web3;
        this.RocketStorage = RocketStorage;
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
//# sourceMappingURL=rocketpool.js.map