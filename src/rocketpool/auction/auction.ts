// Imports
import Web3 from 'web3';
import { TransactionReceipt } from 'web3-core';
import { Contract, SendOptions } from 'web3-eth-contract';
import Contracts from '../contracts/contracts';
import { ConfirmationHandler, handleConfirmations } from '../../utils/transaction';


/**
 * Rocket Pool Auction
 */
class Auction {


    // Constructor
    public constructor(private web3: Web3, private contracts: Contracts) {}


    // Contract accessors
    private get rocketAuctionManager(): Promise<Contract> {
        return this.contracts.get('rocketAuctionManager');
    }


    /**
     * Getters
     */
    // Check that a lot exists given a lotIndex
    public getLotExists(lotIndex: number): Promise<boolean> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<boolean> => {
            return rocketAuctionManager.methods.getLotExists(lotIndex).call();
        });
    }

    // Return the Lot Start Block given a lotIndex
    public getLotStartBlock(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotStartBlock(lotIndex).call();
        });
    }

    // Return the Lot End Block given a lotIndex
    public getLotEndBlock(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotEndBlock(lotIndex).call();
        });
    }

    // Return the Lot Start Price given a lotIndex
    public getLotStartPrice(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotStartPrice(lotIndex).call();
        });
    }

    // Return the Lot Reserve Price given a lotIndex
    public getLotReservePrice(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotReservePrice(lotIndex).call();
        });
    }

    // Return the Lot Total Bid Amount given a lotIndex
    public getLotTotalBidAmount(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotTotalBidAmount(lotIndex).call();
        });
    }

    // Return the Lot Total RPL Amount given a lotIndex
    public getLotTotalRPLAmount(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotTotalRPLAmount(lotIndex).call();
        });
    }

    // Return the Lot Address Bid Amount given a lotIndex and a bidderAddress
    public getLotAddressBidAmount(lotIndex: number, bidderAddress: string): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotAddressBidAmount(lotIndex, bidderAddress).call();
        });
    }

    // Return the Lot Current Price by Total Bids given a lotIndex
    public getLotPriceByTotalBids(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotPriceByTotalBids(lotIndex).call();
        });
    }

    // Return the Lot Current Price given a lotIndex
    public getLotCurrentPrice(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotCurrentPrice(lotIndex).call();
        });
    }

    // Return the Lot Claimed Amount given a lotIndex
    public getLotClaimedRPLAmount(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotClaimedRPLAmount(lotIndex).call();
        });
    }

    // Return the Lot Remaining RPL Amount given a lotIndex
    public getLotRemainingRPLAmount(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotRemainingRPLAmount(lotIndex).call();
        });
    }

    // Return the Lot Remaining RPL Amount given a lotIndex
    public getLotIsCleared(lotIndex: number): Promise<boolean> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<boolean> => {
            return rocketAuctionManager.methods.getLotIsCleared(lotIndex).call();
        });
    }

    // Return the total RPL balance
    public getTotalRPLBalance(): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getTotalRPLBalance().call();
        });
    }

    // Return the allotted RPL balance
    public getAllottedRPLBalance(): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getAllottedRPLBalance().call();
        });
    }

    // Return the remaining RPL balance
    public getRemainingRPLBalance(): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getRemainingRPLBalance().call();
        });
    }

    // Return the lot count
    public getLotCount(): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotCount().call();
        });
    }

    // Return the lot price at a specified block given a lot index
    public getLotPriceAtBlock(lotIndex: number, block: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotPriceAtBlock(lotIndex, block).call();
        });
    }

    // Return the lot RPL recovered given a lot index
    public getLotRPLRecovered(lotIndex: number): Promise<number> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<number> => {
            return rocketAuctionManager.methods.getLotRPLRecovered(lotIndex).call();
        });
    }

    /**
     * Mutators - Public
     */

    // Create a lot
    public createLot(options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketAuctionManager.methods.createLot().send(options),
                onConfirmation
            );
        });
    }


    public claimBid(lotIndex: number, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketAuctionManager.methods.claimBid(lotIndex).send(options),
                onConfirmation
            );
        });
    }


    public placeBid(lotIndex: number, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketAuctionManager.methods.placeBid(lotIndex).send(options),
                onConfirmation
            );
        });
    }

    public recoverUnclaimedRPL(lotIndex: number, options?: SendOptions, onConfirmation?: ConfirmationHandler): Promise<TransactionReceipt> {
        return this.rocketAuctionManager.then((rocketAuctionManager: Contract): Promise<TransactionReceipt> => {
            return handleConfirmations(
                rocketAuctionManager.methods.recoverUnclaimedRPL(lotIndex).send(options),
                onConfirmation
            );
        });
    }


    /**
     * Mutators - Restricted to registered nodes
     */


    /**
     * Mutators - Restricted to super users
     */


}


// Exports
export default Auction;
