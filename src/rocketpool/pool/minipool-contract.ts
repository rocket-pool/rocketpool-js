// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';


// Minipool node details
export interface NodeDetails {
    owner: string;
    contract: string;
    depositEth: string;
    depositRpl: string;
    trusted: boolean;
    depositExists: boolean;
    balance: string;
}


/**
 * RocketMinipool contract instance wrapper
 */
class MinipoolContract {


    // Constructor
    public constructor(private web3: Web3, private contract: Contract) {}


    /**
     * Getters
     */


    // Get all node details
    public getNodeDetails(): Promise<NodeDetails> {
        return Promise.all([
            this.getNodeOwner(),
            this.getNodeContract(),
            this.getNodeDepositEth(),
            this.getNodeDepositRpl(),
            this.getNodeTrusted(),
            this.getNodeDepositExists(),
            this.getNodeBalance(),
        ]).then(([owner, contract, depositEth, depositRpl, trusted, depositExists, balance]: [string, string, string, string, boolean, boolean, string]): NodeDetails => {
            return {owner, contract, depositEth, depositRpl, trusted, depositExists, balance};
        });
    }


    // Get the node owner's address
    public getNodeOwner(): Promise<string> {
        return this.contract.methods.getNodeOwner().call();
    }


    // Get the node contract address
    public getNodeContract(): Promise<string> {
        return this.contract.methods.getNodeContract().call();
    }


    // Get the amount of ETH to be deposited by the node owner in wei
    public getNodeDepositEth(): Promise<string> {
        return this.contract.methods.getNodeDepositEther().call();
    }


    // Get the amount of RPL to be deposited by the node owner in wei
    public getNodeDepositRpl(): Promise<string> {
        return this.contract.methods.getNodeDepositRPL().call();
    }


    // Get whether the node was trusted when the minipool was created
    public getNodeTrusted(): Promise<boolean> {
        return this.contract.methods.getNodeTrusted().call();
    }


    // Get whether the node owner's deposit currently exists
    public getNodeDepositExists(): Promise<boolean> {
        return this.contract.methods.getNodeDepositExists().call();
    }


    // Get the node owner's deposited ETH balance in wei
    public getNodeBalance(): Promise<string> {
        return this.contract.methods.getNodeBalance().call();
    }


}


// Exports
export default MinipoolContract;
