// Imports
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract/types';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool network settings manager
 */
class NetworkSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketNetworkSettings(): Promise<Contract> {
        return this.contracts.get('rocketNetworkSettings');
    }


    /**
     * Getters
     */


    // ETH balance submissions are currently enabled
    public getSubmitBalancesEnabled(): Promise<boolean> {
        return this.rocketNetworkSettings.then((rocketNetworkSettings: Contract): Promise<boolean> => {
            return rocketNetworkSettings.methods.getSubmitBalancesEnabled().call();
        });
    }


    // Processing withdrawals is currently enabled
    public getProcessWithdrawalsEnabled(): Promise<boolean> {
        return this.rocketNetworkSettings.then((rocketNetworkSettings: Contract): Promise<boolean> => {
            return rocketNetworkSettings.methods.getProcessWithdrawalsEnabled().call();
        });
    }


    // Node commission rate parameters
    public getMinimumNodeFee(): Promise<number> {
        return this.rocketNetworkSettings.then((rocketNetworkSettings: Contract): Promise<string> => {
            return rocketNetworkSettings.methods.getMinimumNodeFee().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    public getTargetNodeFee(): Promise<number> {
        return this.rocketNetworkSettings.then((rocketNetworkSettings: Contract): Promise<string> => {
            return rocketNetworkSettings.methods.getTargetNodeFee().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }
    public getMaximumNodeFee(): Promise<number> {
        return this.rocketNetworkSettings.then((rocketNetworkSettings: Contract): Promise<string> => {
            return rocketNetworkSettings.methods.getMaximumNodeFee().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // The range of node demand values in wei to base fee calculations on (from negative to positive value)
    public getNodeFeeDemandRange(): Promise<string> {
        return this.rocketNetworkSettings.then((rocketNetworkSettings: Contract): Promise<string> => {
            return rocketNetworkSettings.methods.getNodeFeeDemandRange().call();
        });
    }


    // The target rETH collateralization rate
    public getTargetRethCollateralRate(): Promise<number> {
        return this.rocketNetworkSettings.then((rocketNetworkSettings: Contract): Promise<string> => {
            return rocketNetworkSettings.methods.getTargetRethCollateralRate().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


}


// Exports
export default NetworkSettings;
