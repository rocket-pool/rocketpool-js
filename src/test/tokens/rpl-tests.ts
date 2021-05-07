// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {takeSnapshot, revertSnapshot, mineBlocks} from '../_utils/evm';
import {printTitle} from '../_utils/formatting';
import {shouldRevert} from '../_utils/testing';
import {setRPLInflationIntervalBlocks, setRPLInflationIntervalRate, setRPLInflationStartBlock} from '../dao/scenario-dao-protocol-bootstrap';
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

        // it(printTitle('userOne', 'burn all their current fixed supply RPL for new RPL'), async () => {
        //
        //     // Load contracts
        //     const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
        //     // Give allowance for all to be sent
        //     await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, userOneRPLBalance.toString(), {
        //         from: userOne,
        //         gas: gasLimit
        //     });
        //     // Burn existing fixed supply RPL for new RPL
        //     await burnFixedRPL(web3, rp, userOneRPLBalance.toString(), {
        //         from: userOne,
        //     });
        //
        // });
        //
        // it(printTitle('userOne', 'burn less fixed supply RPL than they\'ve given an allowance for'), async () => {
        //
        //     // Load contracts
        //     const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
        //     // The allowance
        //     let allowance = userOneRPLBalance.div(web3.utils.toBN(2));
        //     // Give allowance for half to be spent
        //     await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, allowance.toString(), {
        //         from: userOne,
        //         gas: gasLimit
        //     });
        //
        //     let amount = allowance.sub(web3.utils.toBN(web3.utils.toWei('0.000001', 'ether'))).toString()
        //
        //     // Burn existing fixed supply RPL for new RPL
        //     await burnFixedRPL(web3, rp, amount, {
        //         from: userOne,
        //         gas: gasLimit
        //     });
        //
        // });
        //
        // it(printTitle('userOne', 'fails to burn more fixed supply RPL than they\'ve given an allowance for'), async () => {
        //
        //     // Load contracts
        //     const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
        //     // The allowance
        //     let allowance = userOneRPLBalance.sub(web3.utils.toBN(web3.utils.toWei('0.000001', 'ether'))).toString();
        //     // Give allowance for all to be sent
        //     await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, allowance, {
        //         from: userOne,
        //         gas: gasLimit
        //     });
        //     // Burn existing fixed supply RPL for new RPL
        //     await shouldRevert(burnFixedRPL(web3, rp, userOneRPLBalance.toString(), {
        //         from: userOne,
        //         gas: gasLimit
        //     }), 'Burned more RPL than had gave allowance for', 'ERC20: transfer amount exceeds allowance');
        //
        // });
        //
        //
        // it(printTitle('userOne', 'fails to burn more fixed supply RPL than they have'), async () => {
        //
        //     // Load contracts
        //     const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
        //     // The allowance
        //     let allowance = userOneRPLBalance;
        //     // Give allowance for all to be sent
        //     await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, allowance.toString(), {
        //         from: userOne,
        //     });
        //     let amount = userOneRPLBalance.add(web3.utils.toBN(web3.utils.toWei('0.000001', 'ether'))).toString()
        //     // Burn existing fixed supply RPL for new RPL
        //     await shouldRevert(burnFixedRPL(web3, rp, amount, {
        //         from: userOne,
        //         gas: gasLimit
        //     }), 'Burned more RPL than had owned and had given allowance for', 'ERC20: transfer amount exceeds balance');
        //
        // });
        //
        // it(printTitle('userOne', 'fails to set start block for inflation'), async () => {
        //     // Current block
        //     let currentBlock = await web3.eth.getBlockNumber();
        //     // Set the start block for inflation
        //     await shouldRevert(setRPLInflationStartBlock(web3, rp, currentBlock + 10, {
        //         from: userOne,
        //         gas: gasLimit
        //     }), 'Non owner set start block for inlfation', 'Account is not a temporary guardian');
        // });
        //
        // it(printTitle('guardian', 'succeeds setting future start block for inflation'), async () => {
        //     // Current block
        //     let currentBlock = await web3.eth.getBlockNumber();
        //     // Set the start block for inflation
        //     await setRPLInflationStartBlock(web3, rp, currentBlock + 10, {
        //         from: owner,
        //         gas: gasLimit
        //     });
        // });
        //
        // it(printTitle('guardian', 'succeeds setting future start block for inflation twice'), async () => {
        //     // Current block
        //     let currentBlock = await web3.eth.getBlockNumber();
        //     // Set the start block for inflation
        //     await setRPLInflationStartBlock(web3, rp,currentBlock + 10, {
        //         from: owner,
        //         gas: gasLimit
        //     });
        //     // Current block
        //     currentBlock = await web3.eth.getBlockNumber();
        //     // Set the start block for inflation
        //     await setRPLInflationStartBlock(web3, rp,currentBlock + 10, {
        //         from: owner,
        //         gas: gasLimit
        //     });
        // });
        //
        // it(printTitle('guardian', 'fails to set start block for inflation less than current block'), async () => {
        //     // Current block
        //     let currentBlock = await web3.eth.getBlockNumber();
        //     // Set the start block for inflation
        //     await shouldRevert(setRPLInflationStartBlock(web3, rp,currentBlock -  1, {
        //         from: owner,
        //         gas: gasLimit
        //     }), 'Owner set old start block for inflation', 'Inflation interval start block must be a future block');
        // });
        //
        // it(printTitle('guardian', 'fails to set start block for inflation after inflation has begun'), async () => {
        //     // Current block
        //     let currentBlock = await web3.eth.getBlockNumber();
        //     // Inflation start block
        //     let inflationStartBlock = currentBlock + 10;
        //     // Set the start block for inflation
        //     await setRPLInflationStartBlock(web3, rp, inflationStartBlock, {
        //         from: owner,
        //         gas: gasLimit
        //     });
        //     // Fast forward to when inflation has begun
        //     await mineBlocks(web3, inflationStartBlock+1);
        //     // Current block
        //     currentBlock = await web3.eth.getBlockNumber();
        //     // Set the start block for inflation
        //     await shouldRevert(setRPLInflationStartBlock(web3, rp, currentBlock + 10, {
        //         from: owner,
        //         gas: gasLimit
        //     }), 'Owner set start block for inflation after it had started', 'Inflation has already started');
        // });
        //
        // it(printTitle('userOne', 'fails to mint inflation before inflation start block has passed'), async () => {
        //
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //
        //     let config = {
        //         blockInterval: 1,
        //         blockStart: blockCurrent + 30,
        //         blockClaim: blockCurrent + 20,
        //         yearlyInflationTarget: 0.05
        //     }
        //
        //     // Set the daily inflation start block
        //     await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
        //     // Set the daily inflation block count
        //     await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
        //     // Set the daily inflation rate
        //     await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });
        //
        //     // Run the test now
        //     await shouldRevert(rplClaimInflation(web3, rp, config, {
        //         from: userOne, gas: gasLimit
        //     }), 'Inflation claimed before start block has passed', 'New tokens cannot be minted at the moment, either no intervals have passed, inflation has not begun or inflation rate is set to 0');
        //
        // });
        //
        // it(printTitle('userOne', 'fails to mint inflation same block as inflation start block'), async () => {
        //
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //
        //     let config = {
        //         blockInterval: 1,
        //         blockStart: blockCurrent + 20,
        //         blockClaim: blockCurrent + 20,
        //         yearlyInflationTarget: 0.05
        //     }
        //
        //     // Set the daily inflation start block
        //     await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
        //     // Set the daily inflation block count
        //     await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
        //     // Set the daily inflation rate
        //     await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });
        //
        //     // Run the test now
        //     await shouldRevert(rplClaimInflation(web3, rp, config, {
        //         from: userOne, gas: gasLimit
        //     }), 'Inflation claimed at start block', 'Incorrect amount of minted tokens expected');
        //
        // });
        //
        // it(printTitle('userOne', 'fails to mint inflation before an interval has passed'), async () => {
        //
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //
        //     let config = {
        //         blockInterval: 2,
        //         blockStart: blockCurrent + 50,
        //         blockClaim: blockCurrent + 51,
        //         yearlyInflationTarget: 0.05
        //     }
        //
        //     // Set the daily inflation start block
        //     await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
        //     // Set the daily inflation block count
        //     await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
        //     // Set the daily inflation rate
        //     await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });
        //
        //     // Run the test now
        //     await shouldRevert(rplClaimInflation(web3, rp, config, {
        //         from: userOne, gas: gasLimit
        //     }), 'Inflation claimed before interval has passed', 'Incorrect amount of minted tokens expected');
        //
        // });
        //
        // it(printTitle('userOne', 'mint inflation midway through a second interval, then mint again after another interval'), async () => {
        //
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //
        //     let config = {
        //         blockInterval: 15,
        //         blockStart: blockCurrent + 20,
        //         blockClaim: blockCurrent + 35,
        //         yearlyInflationTarget: 0.05
        //     }
        //
        //     // Set the daily inflation start block
        //     await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
        //     // Set the daily inflation block count
        //     await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
        //     // Set the daily inflation rate
        //     await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });
        //
        //     // Claim inflation half way through the second interval
        //     await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
        //     config.blockClaim += config.blockInterval + 23;
        //     await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
        //     config.blockClaim += config.blockInterval + 42;
        //     await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
        //
        // });

        it(printTitle('userOne', 'mint inflation at multiple random intervals'), async () => {

            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();

            let config = {
                blockInterval: 2,
                blockStart: blockCurrent + 10,
                blockClaim: blockCurrent + 22,
                yearlyInflationTarget: 0.025
            }

            // Set the daily inflation start block
            await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
            // Set the daily inflation block count
            await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
            // Set the daily inflation rate
            await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner });

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

        // it(printTitle('userOne', 'mint one years inflation after 365 days at 5% which would equal 18,900,000 tokens'), async () => {
        //
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //
        //     let config = {
        //         blockInterval: 2,
        //         blockStart: blockCurrent + 50,
        //         yearlyInflationTarget: 0.05,
        //         blockClaim: 0
        //     }
        //
        //     // Set the daily inflation start block
        //     await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
        //     // Set the daily inflation block count
        //     await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
        //     // Set the daily inflation rate
        //     await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });
        //
        //     // Mint inflation now
        //     config.blockClaim = config.blockStart + (365 * config.blockInterval);
        //     await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, 18900000);
        //
        //
        // });


        it(printTitle('userOne', 'mint one years inflation every quarter at 5% which would equal 18,900,000 tokens'), async () => {

            // Current block
            let blockCurrent = await web3.eth.getBlockNumber();

            let config = {
                blockInterval: 2,
                blockStart: blockCurrent + 20,
                blockClaim: blockCurrent + 20,
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

            // Alternate collections slightly to test slightly irregular collections
            let altModifier = config.blockInterval * 1.1;

            // Mint inflation now
            config.blockClaim += quarterlyBlockAmount;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += quarterlyBlockAmount;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += altModifier;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += quarterlyBlockAmount;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
            config.blockClaim += quarterlyBlockAmount - altModifier;
            await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, 18900000);

        });

        // it(printTitle('userTwo', 'mint two years inflation every 6 months at 5% which would equal 19,845,000 tokens'), async () => {
        //
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //
        //     let config = {
        //         blockInterval: 3,
        //         blockStart: blockCurrent + 50,
        //         blockClaim: blockCurrent + 51, // 365 is an uneven number, so add two extra intervals at the start to account for 2 years
        //         yearlyInflationTarget: 0.05
        //     }
        //
        //     // How many intervals to make a year
        //     let totalYearBlocks = config.blockInterval * 730;
        //     let quarterlyBlockAmount = totalYearBlocks / 4;
        //
        //     // Set the daily inflation start block
        //     await setRPLInflationStartBlock(web3, rp, config.blockStart, { from: owner, gas: gasLimit });
        //     // Set the daily inflation block count
        //     await setRPLInflationIntervalBlocks(web3, rp, config.blockInterval, { from: owner, gas: gasLimit });
        //     // Set the daily inflation rate
        //     await setRPLInflationIntervalRate(web3, rp, config.yearlyInflationTarget, { from: owner, gas: gasLimit });
        //
        //     // Mint inflation now
        //     config.blockClaim += quarterlyBlockAmount;
        //     await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
        //     config.blockClaim += quarterlyBlockAmount;
        //     await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
        //     config.blockClaim += quarterlyBlockAmount;
        //     await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit });
        //     config.blockClaim += quarterlyBlockAmount;
        //     await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, 19845000);
        //
        // });

        // it(printTitle('userOne', 'mint one years inflation, then set inflation rate to 0 to prevent new inflation'), async () => {
        //
        //     // Current block
        //     let blockCurrent = await web3.eth.getBlockNumber();
        //
        //     let config = {
        //         blockInterval: 2,
        //         blockStart: blockCurrent + 50,
        //         yearlyInflationTarget: 0.05,
        //         blockClaim: 0
        //     }
        //
        //     // Set the daily inflation start block
        //     await setRPLInflationStartBlock(web3, rp,config.blockStart, { from: owner, gas: gasLimit });
        //     // Set the daily inflation block count
        //     await setRPLInflationIntervalBlocks(web3, rp,config.blockInterval, { from: owner, gas: gasLimit });
        //     // Set the daily inflation rate
        //     await setRPLInflationIntervalRate(web3, rp,config.yearlyInflationTarget, { from: owner, gas: gasLimit });
        //
        //     // Mint inflation now
        //     config.blockClaim = config.blockStart + (365 * config.blockInterval);
        //     await rplClaimInflation(web3, rp,config, { from: userOne, gas: gasLimit }, 18900000);
        //
        //     // Now set inflation to 0
        //     await setRPLInflationIntervalRate(web3, rp,0, { from: owner, gas: gasLimit });
        //
        //     // Attempt to collect inflation
        //     config.blockClaim = config.blockStart + (720 * config.blockInterval);
        //     await shouldRevert(rplClaimInflation(web3, rp, config, {
        //         from: userOne, gas: gasLimit
        //     }), "Minted inflation after rate set to 0", 'New tokens cannot be minted at the moment, either no intervals have passed, inflation has not begun or inflation rate is set to 0');
        //
        // });


    });
}
