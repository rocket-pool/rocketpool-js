// Imports
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool network settings manager
 */
class NetworkSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketDAOProtocolSettingsNetwork(): Promise<Contract> {
        return this.contracts.get('rocketDAOProtocolSettingsNetwork');
    }


    /**
     * Getters
     */


    // The threshold of trusted nodes that must reach consensus on oracle data to commit it
    public getNodeConsensusThreshold(): Promise<number> {
        return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsNetwork.methods.getNodeConsensusThreshold().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Balance submissions are currently enabled
    public getSubmitBalancesEnabled(): Promise<boolean> {
        return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<boolean> => {
            return rocketDAOProtocolSettingsNetwork.methods.getSubmitBalancesEnabled().call();
        });
    }


    // The frequency in blocks at which network balances should be submitted by trusted nodes
    public getSubmitBalancesFrequency(): Promise<number> {
        return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsNetwork.methods.getSubmitBalancesFrequency().call();
        }).then((value: string): number => parseInt(value));
    }


    // Node commission rate parameters
    public getMinimumNodeFee(): Promise<number> {
        return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsNetwork.methods.getMinimumNodeFee().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    public getTargetNodeFee(): Promise<number> {
        return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsNetwork.methods.getTargetNodeFee().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    public getMaximumNodeFee(): Promise<number> {
        return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsNetwork.methods.getMaximumNodeFee().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // The range of node demand values in wei to base fee calculations on (from negative to positive value)
    public getNodeFeeDemandRange(): Promise<string> {
        return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsNetwork.methods.getNodeFeeDemandRange().call();
        });
    }


    // The target rETH collateralization rate
    public getTargetRethCollateralRate(): Promise<number> {
        return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsNetwork.methods.getTargetRethCollateralRate().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // The rETH deposit delay setting
    public getRethDespositDelay(): Promise<number> {
        return this.rocketDAOProtocolSettingsNetwork.then((rocketDAOProtocolSettingsNetwork: Contract): Promise<string> => {
            return rocketDAOProtocolSettingsNetwork.methods.getRethDepositDelay().call();
        }).then((value: string): number => parseFloat(value));
    }


}


// Exports
export default NetworkSettings;
