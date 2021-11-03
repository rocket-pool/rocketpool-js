import Web3 from "web3";
import { ContractArtifact } from "../utils/contract";
import Contracts from "./contracts/contracts";
import Auction from "./auction/auction";
import DAOProposal from "./dao/proposals";
import DAONodeTrusted from "./dao/node/trusted/node";
import DAONodeTrustedActions from "./dao/node/trusted/actions";
import DAONodeTrustedProposals from "./dao/node/trusted/proposals";
import DAONodeTrustedSettings from "./dao/node/trusted/settings";
import Deposit from "./deposit/deposit";
import Minipool from "./minipool/minipool";
import Network from "./network/network";
import Node from "./node/node";
import AuctionSettings from "./settings/auction";
import DepositSettings from "./settings/deposit";
import MinipoolSettings from "./settings/minipool";
import NetworkSettings from "./settings/network";
import NodeSettings from "./settings/node";
import RETH from "./tokens/reth";
import RPL from "./tokens/rpl";
import LegacyRPL from "./tokens/legacyrpl";
import Pool from "./rewards/pool";
import ClaimNode from "./rewards/claim-node";
import ClaimDAO from "./rewards/claim-dao";
import ClaimTrustedNode from "./rewards/claim-trusted-node";
import Vault from "./vault/vault";
/**
 * RocketPool
 */
declare class RocketPool {
    readonly web3: Web3;
    readonly RocketStorage: ContractArtifact | string;
    readonly contracts: Contracts;
    readonly auction: Auction;
    readonly dao: {
        node: {
            trusted: {
                actions: DAONodeTrustedActions;
                node: DAONodeTrusted;
                proposals: DAONodeTrustedProposals;
                settings: DAONodeTrustedSettings;
            };
        };
        proposals: DAOProposal;
    };
    readonly deposit: Deposit;
    readonly minipool: Minipool;
    readonly network: Network;
    readonly node: Node;
    readonly settings: {
        auction: AuctionSettings;
        deposit: DepositSettings;
        minipool: MinipoolSettings;
        network: NetworkSettings;
        node: NodeSettings;
    };
    readonly tokens: {
        reth: RETH;
        rpl: RPL;
        legacyrpl: LegacyRPL;
    };
    readonly rewards: {
        pool: Pool;
        claimNode: ClaimNode;
        claimDAO: ClaimDAO;
        claimTrustedNode: ClaimTrustedNode;
    };
    readonly vault: Vault;
    /**
     * Create a new Rocket Pool instance.
     *
     * @param web3 A Web3 instance
     * @param RocketStorage a RocketStorage address as a string or ContractArtifact (JSON ABI file)
     * @returns a RocketPool API object for use in your project
     *
     * Example using RocketStorage contract address
     * ```ts
     * // Using a RocketStorage address as a string
     * const RocketStorage = "0xd8Cd47263414aFEca62d6e2a3917d6600abDceB3"; // Current Testnet Storage Contract
     * const rp = new RocketPool(web3, RocketStorage);
     * ```
     *
     * Example using Contract Artifact (ABI JSON file)
     * ```ts
     * // Using a Contract Artifact (ABI JSON file)
     * import RocketStorage from './contracts/RocketStorage.json';
     * const rp = new RocketPool(web3, RocketStorage);
     * ```
     */
    constructor(web3: Web3, RocketStorage: ContractArtifact | string);
}
export default RocketPool;
