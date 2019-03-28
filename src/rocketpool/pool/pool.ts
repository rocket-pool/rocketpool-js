// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool pools manager
 */
class Pool {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketPool(): Promise<Contract> {
        return this.contracts.get('rocketPool');
    }


    /**
     * Getters
     */


    // Get whether a minipool with a given address exists
    public getPoolExists(address: string): Promise<boolean> {
        return this.rocketPool.then((rocketPool: Contract): Promise<boolean> => {
            return rocketPool.methods.getPoolExists(address).call();
        });
    }


    // Get the total number of minipools
    public getPoolCount(): Promise<number> {
        return this.rocketPool.then((rocketPool: Contract): Promise<string> => {
            return rocketPool.methods.getPoolsCount().call();
        }).then((value: string): number => parseInt(value));
    }


    // Get a minipool address by index
    public getPoolAt(index: number): Promise<string> {
        return this.rocketPool.then((rocketPool: Contract): Promise<string> => {
            return rocketPool.methods.getPoolAt(index).call();
        });
    }


    // Get the total network ether assigned by staking duration ID in wei
    public getTotalEthAssigned(stakingDurationId: string): Promise<string> {
        return this.rocketPool.then((rocketPool: Contract): Promise<string> => {
            return rocketPool.methods.getTotalEther('assigned', stakingDurationId).call();
        });
    }


    // Get the total network ether capacity by staking duration ID in wei
    public getTotalEthCapacity(stakingDurationId: string): Promise<string> {
        return this.rocketPool.then((rocketPool: Contract): Promise<string> => {
            return rocketPool.methods.getTotalEther('capacity', stakingDurationId).call();
        });
    }


    // Get the current network utilisation by staking duration ID as a fraction
    public getNetworkUtilisation(stakingDurationId: string): Promise<number> {
        return this.rocketPool.then((rocketPool: Contract): Promise<string> => {
            return rocketPool.methods.getNetworkUtilisation(stakingDurationId).call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


}


// Exports
export default Pool;
