// Imports
import Web3 from 'web3';
import { ContractArtifact } from '../utils/contract';
import Contracts from './contracts/contracts';
import Deposit from './deposit/deposit';
import Network from './network/network';
import Node from './node/node';
import DepositSettings from './settings/deposit';
import MinipoolSettings from './settings/minipool';
import NetworkSettings from './settings/network';
import NodeSettings from './settings/node';
import NETH from './tokens/neth';
import RETH from './tokens/reth';


/**
 * Main Rocket Pool library class
 */
class RocketPool {


    // Services
    public readonly contracts: Contracts;
    public readonly deposit: Deposit;
    public readonly network: Network;
    public readonly node: Node;
    public readonly settings: {deposit: DepositSettings, minipool: MinipoolSettings, network: NetworkSettings, node: NodeSettings};
    public readonly tokens: {neth: NETH, reth: RETH};


    // Constructor
    public constructor(public readonly web3: Web3, public readonly RocketStorage: ContractArtifact) {

        // Initialise services
        this.contracts = new Contracts(web3, RocketStorage);
        this.deposit = new Deposit(web3, this.contracts);
        this.network = new Network(web3, this.contracts);
        this.node = new Node(web3, this.contracts);
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
