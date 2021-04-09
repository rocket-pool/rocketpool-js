// Imports
import Web3 from 'web3';
import { ContractArtifact } from '../utils/contract';
import Contracts from './contracts/contracts';
import Deposit from './deposit/deposit';
import Minipool from './minipool/minipool';
import Network from './network/network';
import Node from './node/node';
import DepositSettings from './settings/deposit';
import MinipoolSettings from './settings/minipool';
import NetworkSettings from './settings/network';
import NodeSettings from './settings/node';
import NETH from './tokens/neth';
import RETH from './tokens/reth';
import DAOProtocol from './dao/protocol/protocol';
import DAONodeTrusted from './dao/node/trustednode';


/**
 * Main Rocket Pool library class
 */
class RocketPool {


    // Services
    public readonly contracts: Contracts;
    public readonly deposit: Deposit;
    public readonly minipool: Minipool;
    public readonly network: Network;
    public readonly node: Node;
    public readonly settings: {deposit: DepositSettings, minipool: MinipoolSettings, network: NetworkSettings, node: NodeSettings};
    public readonly tokens: {neth: NETH, reth: RETH};
    public readonly dao: {protocol: DAOProtocol, trustednode: DAONodeTrusted};


    // Constructor
    public constructor(public readonly web3: Web3, public readonly RocketStorage: ContractArtifact) {

        // Initialise services
        this.contracts = new Contracts(web3, RocketStorage);
        this.deposit = new Deposit(web3, this.contracts);
        this.minipool = new Minipool(web3, this.contracts);
        this.network = new Network(web3, this.contracts);
        this.node = new Node(web3, this.contracts);
        this.dao = {
            protocol: new DAOProtocol(web3, this.contracts),
            trustednode: new DAONodeTrusted(web3, this.contracts)
        };
        this.settings = {
            deposit: new DepositSettings(web3, this.contracts),
            minipool: new MinipoolSettings(web3, this.contracts),
            network: new NetworkSettings(web3, this.contracts),
            node: new NodeSettings(web3, this.contracts),
        };
        this.tokens = {
            neth: new NETH(web3, this.contracts),
            reth: new RETH(web3, this.contracts),
        };

    }


}


// Exports
export default RocketPool;
