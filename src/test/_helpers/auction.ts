// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {SendOptions} from 'web3-eth-contract';

// Get lot start/end blocks
export async function getLotStartBlock(web3: Web3, rp: RocketPool, lotIndex: number) {
    const rocketAuctionManager = await rp.contracts.get('rocketAuctionManager');
    let startBlock = await rocketAuctionManager.methods.getLotStartBlock(lotIndex).call();
    return startBlock;
}
export async function getLotEndBlock(web3: Web3, rp: RocketPool, lotIndex:number) {
    const rocketAuctionManager = await rp.contracts.get('rocketAuctionManager');
    let endBlock = await rocketAuctionManager.methods.getLotEndBlock(lotIndex).call();
    return endBlock;
}


// Get lot price at a block
export async function getLotPriceAtBlock(web3: Web3, rp: RocketPool, lotIndex: number, block: number) {
    const rocketAuctionManager = await rp.contracts.get('rocketAuctionManager');
    let price = await rocketAuctionManager.methods.getLotPriceAtBlock(lotIndex, block).call();
    return price;
}


// Create a new lot for auction
export async function auctionCreateLot(web3: Web3, rp: RocketPool, options: SendOptions) {
    const rocketAuctionManager = await rp.contracts.get('rocketAuctionManager');
    await rocketAuctionManager.methods.createLot().send(options);
}


// Place a bid on a lot
export async function auctionPlaceBid(web3: Web3, rp: RocketPool, lotIndex: number, options: SendOptions) {
    const rocketAuctionManager = await rp.contracts.get('rocketAuctionManager');
    await rocketAuctionManager.methods.placeBid(lotIndex).send(options);
}
