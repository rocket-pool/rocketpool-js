// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {shouldRevert} from '../_utils/testing';
import {printTitle} from '../_utils/formatting';
import {nodeStakeRPL, setNodeTrusted} from '../_helpers/node';
import {mintRPL} from '../_helpers/tokens';
import {createMinipool, stakeMinipool, submitMinipoolWithdrawable} from '../_helpers/minipool';
import {userDeposit} from '../_helpers/deposit';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import {createLot} from './scenario-create-lot';
import {setDAOProtocolBootstrapSetting} from '../dao/scenario-dao-protocol-bootstrap';
import {submitPrices} from '../_helpers/network';
import {auctionCreateLot, auctionPlaceBid, getLotPriceAtBlock, getLotStartBlock} from '../_helpers/auction';
import {placeBid} from './scenario-place-bid';
import {claimBid} from "./scenario-claim-bid";
import {recoverUnclaimedRPL} from './scenario-recover-rpl';

// Tests
export default function runAuctionTests(web3: Web3, rp: RocketPool) {
    describe('Auction Manager', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let owner: string;
        let node: string;
        let trustedNode: string;
        let random1: string;
        let random2: string;


        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });


        let minipool: MinipoolContract;

        // Setup
        before(async () => {
            // Get accounts
            [owner, node, trustedNode, random1, random2] = await web3.eth.getAccounts();

            // Register node
            await rp.node.registerNode('Australia/Brisbane', {from: node, gas: gasLimit});

            // Register trusted node
            await rp.node.registerNode('Australia/Brisbane', {from: trustedNode, gas: gasLimit});
            await setNodeTrusted(web3, rp, trustedNode, 'saas_1', 'node@home.com', owner);

            // Mint RPL to node & stake; create & stake minipool
            const rplAmount = web3.utils.toWei('10000', 'ether');
            await mintRPL(web3, rp, owner, node, rplAmount);
            await nodeStakeRPL(web3, rp, rplAmount, {from: node});
            minipool = (await createMinipool(web3, rp, {from: node, value: web3.utils.toWei('16', 'ether'), gas: gasLimit}) as MinipoolContract);
            await userDeposit(web3, rp, {from: random1, value: web3.utils.toWei('16', 'ether'), gas: gasLimit});
            await stakeMinipool(web3, rp, minipool, null, {from: node, gas: gasLimit});
        });


        it(printTitle('random address', 'can create a lot'), async () => {
            // Slash RPL assigned to minipool to fill auction contract
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});

            // Create first lot
            await createLot(web3, rp,{
                from: random1,
            });

            // Create second lot
            await createLot(web3, rp,{
                from: random1,
            });

        });

        it(printTitle('random address', 'cannot create a lot while lot creation is disabled'), async () => {

            // Slash RPL assigned to minipool to fill auction contract
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});

            // Disable lot creation
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsAuction', 'auction.lot.create.enabled', false, {from: owner, gas: gasLimit});

            // Attempt to create lot
            await shouldRevert(createLot(web3, rp, {
                from: random1,
            }), 'Created a lot while lot creation was disabled', 'Creating lots is currently disabled');

        });

        it(printTitle('random address', 'cannot create a lot with an insufficient RPL balance'), async () => {

            // Attempt to create lot
            await shouldRevert(createLot(web3, rp,{
                from: random1,
            }), 'Created a lot with an insufficient RPL balance', 'Insufficient RPL balance to create new lot');

        });


        it(printTitle('auction lot', 'has correct price at block'), async () => {

            // Set lot settings
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsAuction', 'auction.lot.duration', 100, {from: owner, gas: gasLimit});
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsAuction', 'auction.price.start', web3.utils.toWei('1', 'ether'), {from: owner, gas: gasLimit});
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsAuction', 'auction.price.reserve', web3.utils.toWei('0', 'ether'), {from: owner, gas: gasLimit});

            // Set RPL price
            await submitPrices(web3, rp,1, web3.utils.toWei('1', 'ether'), {from: trustedNode, gas: gasLimit});

            // Create lot
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});

            // Get lot start block
            const startBlock = parseInt(await getLotStartBlock(web3, rp,0));

            // Set expected prices at blocks
            const values = [
                {block: startBlock +   0, expectedPrice: web3.utils.toBN(web3.utils.toWei('1.0000', 'ether'))},
                {block: startBlock +  12, expectedPrice: web3.utils.toBN(web3.utils.toWei('0.9856', 'ether'))},
                {block: startBlock +  25, expectedPrice: web3.utils.toBN(web3.utils.toWei('0.9375', 'ether'))},
                {block: startBlock +  37, expectedPrice: web3.utils.toBN(web3.utils.toWei('0.8631', 'ether'))},
                {block: startBlock +  50, expectedPrice: web3.utils.toBN(web3.utils.toWei('0.7500', 'ether'))},
                {block: startBlock +  63, expectedPrice: web3.utils.toBN(web3.utils.toWei('0.6031', 'ether'))},
                {block: startBlock +  75, expectedPrice: web3.utils.toBN(web3.utils.toWei('0.4375', 'ether'))},
                {block: startBlock +  88, expectedPrice: web3.utils.toBN(web3.utils.toWei('0.2256', 'ether'))},
                {block: startBlock + 100, expectedPrice: web3.utils.toBN(web3.utils.toWei('0.0000', 'ether'))},
            ];

            // Check fees
            for (let vi = 0; vi < values.length; ++vi) {
                let v = values[vi];
                let price = await getLotPriceAtBlock(web3, rp, 0, v.block);
                assert(web3.utils.toBN(price).eq(v.expectedPrice), 'Lot price does not match expected price at block');
            }

        });

        it(printTitle('random address', 'can place a bid on a lot'), async () => {

            // Create lots
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp,{from: random1, gas: gasLimit});
            await auctionCreateLot(web3, rp,{from: random1, gas: gasLimit});

            // Place bid on first lot from first address
            await placeBid(web3, rp, 0, {
                from: random1,
                value: web3.utils.toWei('4', 'ether'),
                gas: gasLimit
            });

            // Increase bid on first lot from first address
            await placeBid(web3, rp, 0, {
                from: random1,
                value: web3.utils.toWei('4', 'ether'),
                gas: gasLimit
            });

            // Place bid on first lot from second address
            await placeBid(web3, rp, 0, {
                from: random2,
                value: web3.utils.toWei('4', 'ether'),
                gas: gasLimit
            });

            // Place bid on second lot from first address
            await placeBid(web3, rp, 1, {
                from: random1,
                value: web3.utils.toWei('2', 'ether'),
                gas: gasLimit
            });

            // Increase bid on second lot from first address
            await placeBid(web3, rp, 1, {
                from: random1,
                value: web3.utils.toWei('2', 'ether'),
                gas: gasLimit
            });

            // Place bid on second lot from second address
            await placeBid(web3, rp, 1, {
                from: random2,
                value: web3.utils.toWei('2', 'ether'),
                gas: gasLimit
            });

        });

        it(printTitle('random address', 'cannot bid on a lot which doesn\'t exist'), async () => {

            // Create lot
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp,{from: random1, gas: gasLimit});

            // Attempt to place bid
            await shouldRevert(placeBid(web3, rp,1, {
                from: random1,
                value: web3.utils.toWei('4', 'ether')
            }), 'Bid on a lot which doesn\'t exist', 'SafeMath: division by zero');

        });

        it(printTitle('random address', 'cannot bid on a lot while bidding is disabled'), async () => {

            // Create lot
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});

            // Disable bidding
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsAuction', 'auction.lot.bidding.enabled', false, {from: owner, gas: gasLimit});

            // Attempt to place bid
            await shouldRevert(placeBid(web3, rp,0, {
                from: random1,
                value: web3.utils.toWei('4', 'ether'),
            }), 'Bid on a lot while bidding was disabled', 'Bidding on lots is currently disabled');

        });

        it(printTitle('random address', 'cannot bid an invalid amount on a lot'), async () => {

            // Create lot
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp,{from: random1, gas: gasLimit});

            // Attempt to place bid
            await shouldRevert(placeBid(web3, rp, 0, {
                from: random1,
                value: web3.utils.toWei('0', 'ether'),
            }), 'Bid an invalid amount on a lot', 'Invalid bid amount');

        });

        it(printTitle('random address', 'cannot bid on a lot after the lot bidding period has concluded'), async () => {

            // Set lot duration
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsAuction', 'auction.lot.duration', 0, {from: owner, gas: gasLimit});

            // Create lot
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp,{from: random1, gas: gasLimit});

            // Attempt to place bid
            await shouldRevert(placeBid(web3, rp, 0, {
                from: random1,
                value: web3.utils.toWei('4', 'ether'),
            }), 'Bid on a lot after the bidding period concluded', 'Lot bidding period has concluded');

        });


        it(printTitle('random address', 'cannot bid on a lot after the RPL allocation has been exhausted'), async () => {

            // Create lot
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});

            // Place bid & claim all RPL
            await placeBid(web3, rp,0, {
                from: random1,
                value: web3.utils.toWei('1000', 'ether'),
                gas: gasLimit
            });

            // Attempt to place bid
            await shouldRevert(placeBid(web3, rp,0, {
                from: random2,
                value: web3.utils.toWei('4', 'ether'),
                gas: gasLimit
            }), 'Bid on a lot after the RPL allocation was exhausted', 'Lot RPL allocation has been exhausted');

        });


        it(printTitle('random address', 'can claim RPL from a lot'), async () => {

            // Create lots & place bids to clear
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp,{from: random1, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});
            await auctionPlaceBid(web3, rp, 0, {from: random1, value: web3.utils.toWei('5', 'ether'), gas: gasLimit});
            await auctionPlaceBid(web3, rp, 0, {from: random2, value: web3.utils.toWei('5', 'ether'), gas: gasLimit});
            await auctionPlaceBid(web3, rp, 1, {from: random1, value: web3.utils.toWei('3', 'ether'), gas: gasLimit});
            await auctionPlaceBid(web3, rp, 1, {from: random2, value: web3.utils.toWei('3', 'ether'), gas: gasLimit});

            // Claim RPL on first lot from first address
            await claimBid(web3, rp, 0, {
                from: random1,
                gas: gasLimit
            });

            // Claim RPL on first lot from second address
            await claimBid(web3, rp, 0, {
                from: random2,
                gas: gasLimit
            });

            // Claim RPL on second lot from first address
            await claimBid(web3, rp, 1, {
                from: random1,
                gas: gasLimit
            });

            // Claim RPL on second lot from second address
            await claimBid(web3, rp, 1, {
                from: random2,
                gas: gasLimit
            });

        });

        it(printTitle('random address', 'cannot claim RPL from a lot which doesn\'t exist'), async () => {

            // Create lot & place bid to clear
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp,{from: random1, gas: gasLimit});
            await auctionPlaceBid(web3, rp, 0, {from: random1, value: web3.utils.toWei('1000', 'ether'), gas: gasLimit});

            // Attempt to claim RPL
            await shouldRevert(claimBid(web3, rp,1, {
                from: random1,
            }), 'Claimed RPL from a lot which doesn\'t exist', 'SafeMath: division by zero');

        });

        it(printTitle('random address', 'cannot claim RPL from a lot before it has cleared'), async () => {

            // Create lot & place bid
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});
            await auctionPlaceBid(web3, rp, 0, {from: random1, value: web3.utils.toWei('4', 'ether'), gas: gasLimit});

            // Attempt to claim RPL
            await shouldRevert(claimBid(web3, rp, 0, {
                from: random1,
            }), 'Claimed RPL from a lot before it has cleared', 'Lot has not cleared yet');

        });

        it(printTitle('random address', 'cannot claim RPL from a lot it has not bid on'), async () => {

            // Create lot & place bid to clear
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});
            await auctionPlaceBid(web3, rp, 0, {from: random1, value: web3.utils.toWei('4', 'ether'), gas: gasLimit});

            // Attempt to claim RPL
            await shouldRevert(claimBid(web3, rp,0, {
                from: random2,
            }), 'Address claimed RPL from a lot it has not bid on', 'Lot has not cleared yet');

        });

        it(printTitle('random address', 'can recover unclaimed RPL from a lot'), async () => {

            // Create closed lots
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsAuction', 'auction.lot.duration', 0, {from: owner, gas: gasLimit});
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});

            // Recover RPL from first lot
            await recoverUnclaimedRPL(web3, rp, 0, {
                from: random1,
                gas: gasLimit
            });

            // Recover RPL from second lot
            await recoverUnclaimedRPL(web3, rp, 1, {
                from: random1,
                gas: gasLimit
            });

        });


        it(printTitle('random address', 'cannot recover unclaimed RPL from a lot which doesn\'t exist'), async () => {

            // Create closed lot
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsAuction', 'auction.lot.duration', 0, {from: owner, gas: gasLimit});
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});

            // Attempt to recover RPL
            await shouldRevert(recoverUnclaimedRPL(web3, rp,1, {
                from: random1,
                gas: gasLimit
            }), 'Recovered unclaimed RPL from a lot which doesn\'t exist', 'SafeMath: division by zero');

        });


        it(printTitle('random address', 'cannot recover unclaimed RPL from a lot before the lot bidding period has concluded'), async () => {

            // Create lot
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});

            // Attempt to recover RPL
            await shouldRevert(recoverUnclaimedRPL(web3, rp, 0, {
                from: random1,
                gas: gasLimit
            }), 'Recovered unclaimed RPL from a lot before its bidding period had concluded', 'Lot bidding period has not concluded yet');

        });


        it(printTitle('random address', 'cannot recover unclaimed RPL from a lot twice'), async () => {

            // Create closed lot
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsAuction', 'auction.lot.duration', 0, {from: owner, gas: gasLimit});
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp, {from: random1, gas: gasLimit});

            // Recover RPL
            await recoverUnclaimedRPL(web3, rp,0, {from: random1, gas: gasLimit});

            // Attempt to recover RPL again
            await shouldRevert(recoverUnclaimedRPL(web3, rp, 0, {
                from: random1,
                gas: gasLimit,
            }), 'Recovered unclaimed RPL from a lot twice', 'Unclaimed RPL has already been recovered from the lot');

        });


        it(printTitle('random address', 'cannot recover unclaimed RPL from a lot which has no RPL to recover'), async () => {

            // Set lot duration
            await setDAOProtocolBootstrapSetting(web3, rp, 'rocketDAOProtocolSettingsAuction', 'auction.lot.duration', 10, {from: owner, gas: gasLimit});

            // Create lot & place bid to clear
            await submitMinipoolWithdrawable(web3, rp, minipool.address, web3.utils.toWei('32', 'ether'), web3.utils.toWei('0', 'ether'), {from: trustedNode, gas: gasLimit});
            await auctionCreateLot(web3, rp,{from: random1, gas: gasLimit});
            await auctionPlaceBid(web3, rp, 0, {from: random1, value: web3.utils.toWei('1000', 'ether'), gas: gasLimit});

            // Move to lot bidding period end
            await mineBlocks(web3, 10);

            // Attempt to recover RPL again
            await shouldRevert(recoverUnclaimedRPL(web3, rp, 0, {
                from: random1,
                gas: gasLimit
            }), 'Recovered unclaimed RPL from a lot which had no RPL to recover', 'No unclaimed RPL is available to recover');

        });


    });
};
