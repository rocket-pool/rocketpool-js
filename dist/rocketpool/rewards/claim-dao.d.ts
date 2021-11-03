import Web3 from "web3";
import Contracts from "../contracts/contracts";
/**
 * Rocket Pool Rewards
 */
declare class Rewards {
    private web3;
    private contracts;
    /**
     * Create a new Rewards instance.
     *
     * @param web3 A valid Web3 instance
     * @param contracts A Rocket Pool contract manager instance
     */
    constructor(web3: Web3, contracts: Contracts);
    /**
     * Private accessor use to retrieve the related contract
     * @returns a Promise<Contract\> with a web3.eth.contract instance of the rocketClaimDAO contract
     */
    private get rocketClaimDAO();
}
export default Rewards;
