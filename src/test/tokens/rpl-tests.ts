// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {nodeStakeRPL, setNodeTrusted, setNodeWithdrawalAddress} from '../_helpers/node';
import {getRethBalance, getRethExchangeRate, getRethTotalSupply, mintRPL} from '../_helpers/tokens';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {getMinipoolSetting} from '../_helpers/settings';
import {
    createMinipool,
    getMinipoolMinimumRPLStake, getMinipoolWithdrawalUserBalance,
    payoutMinipool,
    stakeMinipool,
    submitMinipoolWithdrawable,
    withdrawMinipool
} from '../_helpers/minipool';
import {
    setDAOProtocolBootstrapSetting,
    setRPLInflationIntervalBlocks, setRPLInflationIntervalRate,
    setRPLInflationStartBlock
} from '../dao/scenario-dao-protocol-bootstrap';
import {getNodeFee, submitBalances} from '../_helpers/network';
import {getValidatorPubkey} from '../_utils/beacon';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import {getDepositExcessBalance, userDeposit} from '../_helpers/deposit';
import {burnReth} from "./scenario-burn-reth";
import {Contract} from 'web3-eth-contract';
import {mintDummyRPL} from './scenario-rpl-mint-fixed';
import {allowDummyRPL} from './scenario-rpl-allow-fixed';
import {burnFixedRPL} from './scenario-rpl-burn-fixed';
import {rplClaimInflation} from "./scenario-rpl-inflation";

// Tests
export default function runRPLTests(web3: Web3, rp: RocketPool) {
    describe('RPL', () => {

        // settings
        const gasLimit: number = 8000000;

        // Accounts
        let owner: string;
        let userOne: string;
        let userTwo: string;

        // State snapshotting
        let suiteSnapshotId: string, testSnapshotId: string;
        before(async () => { suiteSnapshotId = await takeSnapshot(web3); });
        after(async () => { await revertSnapshot(web3, suiteSnapshotId); });
        beforeEach(async () => { testSnapshotId = await takeSnapshot(web3); });
        afterEach(async () => { await revertSnapshot(web3, testSnapshotId); });

        // Setup
        let userOneRPLBalance = web3.utils.toBN(web3.utils.toWei('100', 'ether'));

        before(async () => {

            // Get accounts
            [owner, userOne, userTwo] = await web3.eth.getAccounts();

            // Mint RPL fixed supply for the users to simulate current users having RPL
            await mintDummyRPL(web3, rp, userOne, userOneRPLBalance.toString(), {from: owner, gas: gasLimit});

        });

        it(printTitle('userOne', 'burn all their current fixed supply RPL for new RPL'), async () => {

            // Load contracts
            const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
            // Give allowance for all to be sent
            await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, userOneRPLBalance.toString(), {
                from: userOne,
                gas: gasLimit
            });
            // Burn existing fixed supply RPL for new RPL
            await burnFixedRPL(web3, rp, userOneRPLBalance.toString(), {
                from: userOne,
            });

        });

        it(printTitle('userOne', 'fails to burn more fixed supply RPL than they\'ve given an allowance for'), async () => {

            // Load contracts
            const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
            // The allowance
            let allowance = userOneRPLBalance.sub(web3.utils.toBN(web3.utils.toWei('0.000001', 'ether')));
            // Give allowance for all to be sent
            await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, allowance.toString(), {
                from: userOne,
                gas: gasLimit
            });
            // Burn existing fixed supply RPL for new RPL
            await shouldRevert(burnFixedRPL(web3, rp, userOneRPLBalance.toString(), {
                from: userOne,
                gas: gasLimit
            }), 'Burned more RPL than had gave allowance for', 'Not enough allowance given for transfer of tokens');

        });

        it(printTitle('userOne', 'fails to burn more fixed supply RPL than they have'), async () => {

            // Load contracts
            const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
            // The allowance
            let allowance = userOneRPLBalance;
            // Give allowance for all to be sent
            await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, allowance.toString(), {
                from: userOne,
            });
            // Burn existing fixed supply RPL for new RPL
            await shouldRevert(burnFixedRPL(web3, rp, userOneRPLBalance.add(web3.utils.toBN(web3.utils.toWei('0.000001', 'ether'))).toString(), {
                from: userOne,
                gas: gasLimit
            }), 'Burned more RPL than had owned and had given allowance for', 'Not enough RPL fixed supply tokens available to cover swap amount desired');

        });

        it(printTitle('userOne', 'fails to set start block for inflation'), async () => {
            // Current block
            let currentBlock = await web3.eth.getBlockNumber();
            // Set the start block for inflation
            await shouldRevert(setRPLInflationStartBlock(web3, rp, currentBlock + 10, {
                from: userOne,
                gas: gasLimit
            }), 'Non owner set start block for inlfation', 'Account is not a temporary guardian');
        });

        it(printTitle('guardian', 'succeeds setting future start block for inflation'), async () => {
            // Current block
            let currentBlock = await web3.eth.getBlockNumber();
            // Set the start block for inflation
            await setRPLInflationStartBlock(web3, rp, currentBlock + 10, {
                from: owner,
                gas: gasLimit
            });
        });

        it(printTitle('guardian', 'succeeds setting future start block for inflation twice'), async () => {
            // Current block
            let currentBlock = await web3.eth.getBlockNumber();
            // Set the start block for inflation
            await setRPLInflationStartBlock(web3, rp,currentBlock + 10, {
                from: owner,
                gas: gasLimit
            });
            // Current block
            currentBlock = await web3.eth.getBlockNumber();
            // Set the start block for inflation
            await setRPLInflationStartBlock(web3, rp,currentBlock + 10, {
                from: owner,
                gas: gasLimit
            });
        });

        it(printTitle('guardian', 'fails to set start block for inflation less than current block'), async () => {
            // Current block
            let currentBlock = await web3.eth.getBlockNumber();
            // Set the start block for inflation
            await shouldRevert(setRPLInflationStartBlock(web3, rp,currentBlock -  1, {
                from: owner,
                gas: gasLimit
            }), 'Owner set old start block for inflation', 'Inflation interval start block must be a future block');
        });

        it(printTitle('guardian', 'fails to set start block for inflation after inflation has begun'), async () => {
            // Current block
            let currentBlock = await web3.eth.getBlockNumber();
            // Inflation start block
            let inflationStartBlock = currentBlock + 10;
            // Set the start block for inflation
            await setRPLInflationStartBlock(web3, rp, inflationStartBlock, {
                from: owner,
                gas: gasLimit
            });
            // Fast forward to when inflation has begun
            await mineBlocks(web3, inflationStartBlock+1);
            // Current block
            currentBlock = await web3.eth.getBlockNumber();
            // Set the start block for inflation
            await shouldRevert(setRPLInflationStartBlock(web3, rp, currentBlock + 10, {
                from: owner,
                gas: gasLimit
            }), 'Owner set start block for inflation after it had started', 'Inflation has already started');
        });

        it(printTitle('userOne', 'fail to mint inflation before inflation start block has passed'), async () => {

            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();

            let config = {
                blockInterval: 1,
                blockStart: blockCurrent + 30,
                blockClaim: blockCurrent + 20,
                yearlyInflationTarget: 0.05
            }

            // Set the daily inflation start block
            await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
            // Set the daily inflation block count
            await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
            // Set the daily inflation rate
            await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });

            // Run the test now
            await shouldRevert(rplClaimInflation(web3, rp, config, {
                from: userOne, gas: gasLimit
            }), 'Inflation claimed before start block has passed', 'New tokens cannot be minted at the moment, either no intervals have passed, inflation has not begun or inflation rate is set to 0');

        });

        it(printTitle('userOne', 'fail to mint inflation same block as inflation start block'), async () => {

            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();

            let config = {
                blockInterval: 1,
                blockStart: blockCurrent + 20,
                blockClaim: blockCurrent + 20,
                yearlyInflationTarget: 0.05
            }

            // Set the daily inflation start block
            await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
            // Set the daily inflation block count
            await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
            // Set the daily inflation rate
            await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });

            // Run the test now
            await shouldRevert(rplClaimInflation(web3, rp, config, {
                from: userOne, gas: gasLimit
            }), 'Inflation claimed at start block', 'New tokens cannot be minted at the moment, either no intervals have passed, inflation has not begun or inflation rate is set to 0');

        });

        it(printTitle('userOne', 'fail to mint inflation before an interval has passed'), async () => {

            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();

            let config = {
                blockInterval: 2,
                blockStart: blockCurrent + 50,
                blockClaim: blockCurrent + 51,
                yearlyInflationTarget: 0.05
            }

            // Set the daily inflation start block
            await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
            // Set the daily inflation block count
            await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
            // Set the daily inflation rate
            await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });

            // Run the test now
            await shouldRevert(rplClaimInflation(web3, rp, config, {
                from: userOne, gas: gasLimit
            }), 'Inflation claimed before interval has passed', 'New tokens cannot be minted at the moment, either no intervals have passed, inflation has not begun or inflation rate is set to 0');

        });

        it(printTitle('userOne', 'mint inflation after a single interval has passed'), async () => {

            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();

            let config = {
                blockInterval: 2,
                blockStart: blockCurrent + 20,
                blockClaim: blockCurrent + 22,
                yearlyInflationTarget: 0.05
            }

            // Set the daily inflation start block
            await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
            // Set the daily inflation block count
            await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
            // Set the daily inflation rate
            await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });

            // Mint inflation now
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });

        });


        it(printTitle('userOne', 'mint inflation at multiple random intervals'), async () => {

            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();

            let config = {
                blockInterval: 3,
                blockStart: blockCurrent + 10,
                blockClaim: blockCurrent + 22,
                yearlyInflationTarget: 0.025
            }

            // Set the daily inflation start block
            await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
            // Set the daily inflation block count
            await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
            // Set the daily inflation rate
            await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });

            // Mint inflation now
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += 3;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += 10;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += 67;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += 105;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += 149;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += 151;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += 155;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += 219;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });

        });

        it(printTitle('userOne', 'mint one years inflation after 365 days at 5% which would equal 18,900,000 tokens'), async () => {

            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();

            let config = {
                blockInterval: 2,
                blockStart: blockCurrent + 50,
                yearlyInflationTarget: 0.05,
                blockClaim: 0
            }

            // Set the daily inflation start block
            await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
            // Set the daily inflation block count
            await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
            // Set the daily inflation rate
            await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });

            // Mint inflation now
            config.blockClaim = config.blockStart + (365 * config.blockInterval);
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, 18900000);


        });


        it(printTitle('userOne', 'mint one years inflation every quarter at 5% which would equal 18,900,000 tokens'), async () => {

            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();

            let config = {
                blockInterval: 2,
                blockStart: blockCurrent + 50,
                blockClaim: blockCurrent + 52, // 365 is an uneven number, so add one extra interval at the start
                yearlyInflationTarget: 0.05
            }

            // How many intervals to make a year
            let totalYearBlocks = config.blockInterval * 365;
            let quarterlyBlockAmount = totalYearBlocks / 4;

            // Set the daily inflation start block
            await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
            // Set the daily inflation block count
            await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
            // Set the daily inflation rate
            await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });

            // Mint inflation now
            config.blockClaim += quarterlyBlockAmount;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += quarterlyBlockAmount;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += quarterlyBlockAmount;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += quarterlyBlockAmount;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, 18900000);

        });

        it(printTitle('userOne', 'mint one years inflation, then set inflation rate to 0 to prevent new inflation'), async () => {

            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();

            let config = {
                blockInterval: 1,
                blockStart: blockCurrent + 50,
                yearlyInflationTarget: 0.05,
                blockClaim: 0
            }

            // Set the daily inflation start block
            await setRPLInflationStartBlock(web3, rp,config.blockStart, { from: owner, gas: gasLimit });
            // Set the daily inflation block count
            await setRPLInflationIntervalBlocks(web3, rp,config.blockInterval, { from: owner, gas: gasLimit });
            // Set the daily inflation rate
            await setRPLInflationIntervalRate(web3, rp,config.yearlyInflationTarget, { from: owner, gas: gasLimit });

            // Mint inflation now
            config.blockClaim = config.blockStart + (365 * config.blockInterval);
            await rplClaimInflation(web3, rp,config, { from: userOne, gas: gasLimit }, 18900000);

            // Now set inflation to 0
            await setRPLInflationIntervalRate(web3, rp,0, { from: owner, gas: gasLimit });

            // Attempt to collect inflation
            config.blockClaim = config.blockStart + (720 * config.blockInterval);
            await shouldRevert(rplClaimInflation(web3, rp, config, {
                from: userOne, gas: gasLimit
            }), "Minted inflation after rate set to 0", 'New tokens cannot be minted at the moment, either no intervals have passed, inflation has not begun or inflation rate is set to 0');

        });

    });
}
