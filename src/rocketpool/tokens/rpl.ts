// Imports
import Web3 from "web3";
import { TransactionReceipt } from "web3-core";
import { Contract, SendOptions } from "web3-eth-contract";
import Contracts from "../contracts/contracts";
import { ConfirmationHandler, handleConfirmations } from "../../utils/transaction";
import ERC20 from "./erc20";

/**
 * Rocket Pool RPL token manager
 */
class RPL extends ERC20 {
  // Constructor
  public constructor(web3: Web3, contracts: Contracts) {
    super(web3, contracts, "rocketTokenRPL");
  }

  /**
   * Getters
   */
  // Get contract address
  public getAddress(): Promise<string> {
    return this.tokenContract.then((tokenContract: Contract): string => {
      return tokenContract.options.address;
    });
  }

  // Get the inflation intervals that have passed
  public getInflationIntervalsPassed(): Promise<number> {
    return this.tokenContract.then((tokenContract: Contract): Promise<number> => {
      return tokenContract.methods.getInflationIntervalsPassed().call();
    });
  }

  // Get the total supply
  public totalSupply(): Promise<number> {
    return this.tokenContract.then((tokenContract: Contract): Promise<number> => {
      return tokenContract.methods.totalSupply().call();
    });
  }

  /**
   * Mutators - Public
   */
  // Swap current RPL fixed supply tokens for new RPL
  public swapTokens(amountWei: any, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
    return this.tokenContract.then((tokenContract: Contract): Promise<TransactionReceipt> => {
      return handleConfirmations(tokenContract.methods.swapTokens(amountWei).send(options), onConfirmation);
    });
  }

  // Inflation mint tokens
  public inflationMintTokens(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
    return this.tokenContract.then((tokenContract: Contract): Promise<TransactionReceipt> => {
      return handleConfirmations(tokenContract.methods.inflationMintTokens().send(options), onConfirmation);
    });
  }
}

// Exports
export default RPL;
