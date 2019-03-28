// Imports
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
import Contracts from '../contracts/contracts';


/**
 * Rocket Pool node settings manager
 */
class NodeSettings {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketNodeSettings(): Promise<Contract> {
        return this.contracts.get('rocketNodeSettings');
    }


    /**
     * Getters
     */


    // Get whether new node registration is currently allowed
    public getNewAllowed(): Promise<boolean> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<boolean> => {
            return rocketNodeSettings.methods.getNewAllowed().call();
        });
    }


    // Get the minimum ether balance for a node to register in wei
    public getEtherMin(): Promise<string> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<string> => {
            return rocketNodeSettings.methods.getEtherMin().call();
        })
    }


    // Get the gas price to be used for node checkins in wei
    public getCheckinGasPrice(): Promise<string> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<string> => {
            return rocketNodeSettings.methods.getCheckinGasPrice().call();
        });
    }


    // Get whether nodes are automatically set as inactive
    public getInactiveAutomatic(): Promise<boolean> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<boolean> => {
            return rocketNodeSettings.methods.getInactiveAutomatic().call();
        });
    }


    // Get the duration after which to set a node failing to check in as inactive, in seconds
    public getInactiveDuration(): Promise<number> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<string> => {
            return rocketNodeSettings.methods.getInactiveDuration().call();
        }).then((value: string): number => parseInt(value));
    }


    // Get the maximum number of other nodes to check for activity on checkin
    public getMaxInactiveNodeChecks(): Promise<number> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<string> => {
            return rocketNodeSettings.methods.getMaxInactiveNodeChecks().call();
        }).then((value: string): number => parseInt(value));
    }


    // Get the fee charged to users by node operators as a fraction
    public getFeePerc(): Promise<number> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<string> => {
            return rocketNodeSettings.methods.getFeePerc().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Get the maximum fee charged to users by node operators as a fraction
    public getMaxFeePerc(): Promise<number> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<string> => {
            return rocketNodeSettings.methods.getMaxFeePerc().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Get the fee voting cycle duration in seconds
    public getFeeVoteCycleDuration(): Promise<number> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<string> => {
            return rocketNodeSettings.methods.getFeeVoteCycleDuration().call();
        }).then((value: string): number => parseInt(value));
    }


    // Get the fee change per voting cycle as a fraction
    public getFeeVoteCyclePercChange(): Promise<number> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<string> => {
            return rocketNodeSettings.methods.getFeeVoteCyclePercChange().call();
        }).then((value: string): number => parseFloat(this.web3.utils.fromWei(value, 'ether')));
    }


    // Get whether node deposits are currently allowed
    public getDepositAllowed(): Promise<boolean> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<boolean> => {
            return rocketNodeSettings.methods.getDepositAllowed().call();
        });
    }


    // Get the duration that a node deposit reservation is valid for in seconds
    public getDepositReservationTime(): Promise<number> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<string> => {
            return rocketNodeSettings.methods.getDepositReservationTime().call();
        }).then((value: string): number => parseInt(value));
    }


    // Get whether node withdrawals are currently allowed
    public getWithdrawalAllowed(): Promise<boolean> {
        return this.rocketNodeSettings.then((rocketNodeSettings: Contract): Promise<boolean> => {
            return rocketNodeSettings.methods.getWithdrawalAllowed().call();
        });
    }


}


// Exports
export default NodeSettings;
