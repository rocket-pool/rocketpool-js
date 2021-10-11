// Imports
import Web3 from "web3";
import { ContractArtifact } from "../utils/contract";
import Contracts from "./contracts/contracts";
import Auction from "./auction/auction";
import DAOProposal from "./dao/proposals";
import DAONodeTrusted from "./dao/node/trusted/node";
import DAONodeTrustedActions from "./dao/node/trusted/actions";
import DAONodeTrustedProposals from "./dao/node/trusted/proposals";
import DAONodeTrustedSettings from "./dao/node/trusted/settings";
import DAOProtocolSettings from "./dao/protocol/settings";
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
class RocketPool {
	public readonly contracts: Contracts;
	public readonly auction: Auction;
	public readonly dao: {
		node: {
			trusted: {
				actions: DAONodeTrustedActions;
				node: DAONodeTrusted;
				proposals: DAONodeTrustedProposals;
				settings: DAONodeTrustedSettings;
			};
		};
		protocol: {
			settings: DAOProtocolSettings;
		};
		proposals: DAOProposal;
	};
	public readonly deposit: Deposit;
	public readonly minipool: Minipool;
	public readonly network: Network;
	public readonly node: Node;
	public readonly settings: {
		auction: AuctionSettings;
		deposit: DepositSettings;
		minipool: MinipoolSettings;
		network: NetworkSettings;
		node: NodeSettings;
	};
	public readonly tokens: { reth: RETH; rpl: RPL; legacyrpl: LegacyRPL };
	public readonly rewards: {
		pool: Pool;
		claimNode: ClaimNode;
		claimDAO: ClaimDAO;
		claimTrustedNode: ClaimTrustedNode;
	};
	public readonly vault: Vault;

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
	 * const RocketStorage = "0x00000000000000000000";
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
	public constructor(public readonly web3: Web3, public readonly RocketStorage: ContractArtifact | string) {
		// Initialise services
		this.contracts = new Contracts(web3, RocketStorage);
		this.auction = new Auction(web3, this.contracts);
		this.dao = {
			node: {
				trusted: {
					actions: new DAONodeTrustedActions(web3, this.contracts),
					node: new DAONodeTrusted(web3, this.contracts),
					proposals: new DAONodeTrustedProposals(web3, this.contracts),
					settings: new DAONodeTrustedSettings(web3, this.contracts),
				},
			},
			protocol: {
				settings: new DAOProtocolSettings(web3, this.contracts),
			},
			proposals: new DAOProposal(web3, this.contracts),
		};
		this.deposit = new Deposit(web3, this.contracts);
		this.minipool = new Minipool(web3, this.contracts);
		this.network = new Network(web3, this.contracts);
		this.node = new Node(web3, this.contracts);
		this.settings = {
			auction: new AuctionSettings(web3, this.contracts),
			deposit: new DepositSettings(web3, this.contracts),
			minipool: new MinipoolSettings(web3, this.contracts),
			network: new NetworkSettings(web3, this.contracts),
			node: new NodeSettings(web3, this.contracts),
		};
		this.tokens = {
			reth: new RETH(web3, this.contracts),
			rpl: new RPL(web3, this.contracts),
			legacyrpl: new LegacyRPL(web3, this.contracts),
		};
		this.rewards = {
			pool: new Pool(web3, this.contracts),
			claimNode: new ClaimNode(web3, this.contracts),
			claimDAO: new ClaimDAO(web3, this.contracts),
			claimTrustedNode: new ClaimTrustedNode(web3, this.contracts),
		};
		this.vault = new Vault(web3, this.contracts);
	}
}

// Exports
export default RocketPool;
