// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {SendOptions} from 'web3-eth-contract';


// Get lot end blocks
export async function getLotStartBlock(web3: Web3, rp: RocketPool, lotIndex: number) {
    return await rp.auction.getLotStartBlock(lotIndex);
}


// Get lot end blocks
export async function getLotEndBlock(web3: Web3, rp: RocketPool, lotIndex:number) {
    return await rp.auction.getLotEndBlock(lotIndex);
}


// Get lot price at a block
export async function getLotPriceAtBlock(web3: Web3, rp: RocketPool, lotIndex: number, block: number) {
    return await rp.auction.getLotPriceAtBlock(lotIndex, block);
}


// Create a new lot for auction
export async function auctionCreateLot(web3: Web3, rp: RocketPool, options: SendOptions) {
    await rp.auction.createLot(options);
}


// Place a bid on a lot
export async function auctionPlaceBid(web3: Web3, rp: RocketPool, lotIndex: number, options: SendOptions) {
    await rp.auction.placeBid(lotIndex, options);
}
