// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { takeSnapshot, revertSnapshot, getCurrentTime, increaseTime } from "../_utils/evm";
import { printTitle } from "../_utils/formatting";
import { shouldRevert } from "../_utils/testing";
import { setRPLInflationIntervalRate, setRPLInflationStartTime } from "../dao/scenario-dao-protocol-bootstrap";
import { mintDummyRPL } from "./scenario-rpl-mint-fixed";
import { allowDummyRPL } from "./scenario-rpl-allow-fixed";
import { burnFixedRPL } from "./scenario-rpl-burn-fixed";
import { rplClaimInflation, rplSetInflationConfig } from "./scenario-rpl-inflation";

// Tests
export default function runRPLTests(web3: Web3, rp: RocketPool) {
	describe("RPL", () => {
		// settings
		const gasLimit = 8000000;
		const ONE_DAY = 24 * 60 * 60;

		// Accounts
		let owner: string;
		let userOne: string;

		// State snapshotting
		let suiteSnapshotId: string, testSnapshotId: string;
		before(async () => {
			suiteSnapshotId = await takeSnapshot(web3);
		});
		after(async () => {
			await revertSnapshot(web3, suiteSnapshotId);
		});
		beforeEach(async () => {
			testSnapshotId = await takeSnapshot(web3);
		});
		afterEach(async () => {
			await revertSnapshot(web3, testSnapshotId);
		});

		// Setup
		const userOneRPLBalance = web3.utils.toBN(web3.utils.toWei("100", "ether"));

		before(async () => {
			// Get accounts
			[owner, userOne] = await web3.eth.getAccounts();

			// Mint RPL fixed supply for the users to simulate current users having RPL
			await mintDummyRPL(web3, rp, userOne, userOneRPLBalance.toString(), {
				from: owner,
				gas: gasLimit,
			});
		});

		it(printTitle("userOne", "burn all their current fixed supply RPL for new RPL"), async () => {
			// Load contracts
			const rocketTokenRPL = await rp.contracts.get("rocketTokenRPL");
			// Give allowance for all to be sent
			await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, userOneRPLBalance.toString(), {
				from: userOne,
				gas: gasLimit,
			});
			// Burn existing fixed supply RPL for new RPL
			await burnFixedRPL(web3, rp, userOneRPLBalance.toString(), {
				from: userOne,
				gas: gasLimit,
			});
		});

		it(printTitle("userOne", "burn less fixed supply RPL than they've given an allowance for"), async () => {
			// Load contracts
			const rocketTokenRPL = await rp.contracts.get("rocketTokenRPL");
			// The allowance
			const allowance = userOneRPLBalance.div(web3.utils.toBN(2));
			// Give allowance for half to be spent
			await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, allowance.toString(), {
				from: userOne,
				gas: gasLimit,
			});

			const amount = allowance.sub(web3.utils.toBN(web3.utils.toWei("0.000001", "ether"))).toString();

			// Burn existing fixed supply RPL for new RPL
			await burnFixedRPL(web3, rp, amount, {
				from: userOne,
				gas: gasLimit,
			});
		});

		it(printTitle("userOne", "fails to burn more fixed supply RPL than they've given an allowance for"), async () => {
			// Load contracts
			const rocketTokenRPL = await rp.contracts.get("rocketTokenRPL");
			// The allowance
			const allowance = userOneRPLBalance.sub(web3.utils.toBN(web3.utils.toWei("0.000001", "ether"))).toString();
			// Give allowance for all to be sent
			await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, allowance, {
				from: userOne,
				gas: gasLimit,
			});
			// Burn existing fixed supply RPL for new RPL
			await shouldRevert(
				burnFixedRPL(web3, rp, userOneRPLBalance.toString(), {
					from: userOne,
					gas: gasLimit,
				}),
				"Burned more RPL than had gave allowance for",
				"ERC20: transfer amount exceeds allowance"
			);
		});

		it(printTitle("userOne", "fails to burn more fixed supply RPL than they have"), async () => {
			// Load contracts
			const rocketTokenRPL = await rp.contracts.get("rocketTokenRPL");
			// The allowance
			const allowance = userOneRPLBalance;
			// Give allowance for all to be sent
			await allowDummyRPL(web3, rp, rocketTokenRPL.options.address, allowance.toString(), {
				from: userOne,
				gas: gasLimit,
			});
			const amount = userOneRPLBalance.add(web3.utils.toBN(web3.utils.toWei("0.000001", "ether"))).toString();
			// Burn existing fixed supply RPL for new RPL
			await shouldRevert(
				burnFixedRPL(web3, rp, amount, {
					from: userOne,
					gas: gasLimit,
				}),
				"Burned more RPL than had owned and had given allowance for",
				"ERC20: transfer amount exceeds balance"
			);
		});

		it(printTitle("userOne", "fails to set start time for inflation"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);
			// Set the start time for inflation
			await shouldRevert(
				setRPLInflationStartTime(web3, rp, currentTime + 3600, {
					from: userOne,
					gas: gasLimit,
				}),
				"Non owner set start time for inlfation",
				"Account is not a temporary guardian"
			);
		});

		it(printTitle("guardian", "succeeds setting future start time for inflation"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);
			// Set the start block for inflation
			await setRPLInflationStartTime(web3, rp, currentTime + 3600, {
				from: owner,
				gas: gasLimit,
			});
		});

		it(printTitle("guardian", "succeeds setting future start time for inflation twice"), async () => {
			// Current time
			let currentTime = await getCurrentTime(web3);
			// Set the start time for inflation
			await setRPLInflationStartTime(web3, rp, currentTime + 3600, {
				from: owner,
				gas: gasLimit,
			});
			// Fast-forward
			await increaseTime(web3, 1800);
			// Current time
			currentTime = await getCurrentTime(web3);
			// Set the start time for inflation
			await setRPLInflationStartTime(web3, rp, currentTime + 3600, {
				from: owner,
				gas: gasLimit,
			});
		});

		it(printTitle("guardian", "fails to set start time for inflation less than current time"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);
			// Set the start block for inflation
			await shouldRevert(
				setRPLInflationStartTime(web3, rp, currentTime - 1000, {
					from: owner,
					gas: gasLimit,
				}),
				"Owner set old start time for inflation",
				"Inflation interval start time must be in the future"
			);
		});

		it(printTitle("guardian", "fails to set start time for inflation after inflation has begun"), async () => {
			// Current time
			let currentTime = await getCurrentTime(web3);
			// Inflation start time
			const inflationStartTime = currentTime + 3600;
			// Set the start time for inflation
			await setRPLInflationStartTime(web3, rp, inflationStartTime, {
				from: owner,
				gas: gasLimit,
			});
			// Fast forward to when inflation has begun
			await increaseTime(web3, inflationStartTime + 60);
			// Current time
			currentTime = await getCurrentTime(web3);
			// Set the start block for inflation
			await shouldRevert(
				setRPLInflationStartTime(web3, rp, currentTime + 3600, {
					from: owner,
					gas: gasLimit,
				}),
				"Owner set start time for inflation after it had started",
				"Inflation has already started"
			);
		});

		it(printTitle("userOne", "fails to mint inflation before inflation start block has passed"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);

			const config = {
				timeInterval: 0,
				timeStart: currentTime + 3600,
				timeClaim: currentTime + 1800,
				yearlyInflationTarget: 0.05,
			};

			// Set config
			await rplSetInflationConfig(web3, rp, config, {
				from: owner,
				gas: gasLimit,
			});

			// Run the test now
			const newTokens = await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			assert(newTokens.eq(web3.utils.toBN(0)), "Inflation claimed before start block has passed");
		});

		it(printTitle("userOne", "fails to mint inflation same block as inflation start block"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);

			const config = {
				timeInterval: 0,
				timeStart: currentTime + 3600,
				timeClaim: currentTime + 1800,
				yearlyInflationTarget: 0.05,
			};

			// Set config
			await rplSetInflationConfig(web3, rp, config, {
				from: owner,
				gas: gasLimit,
			});

			// Run the test now
			const newTokens = await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			assert(newTokens.eq(web3.utils.toBN(0)), "Inflation claimed before start block has passed");
		});

		it(printTitle("userOne", "fails to mint inflation before an interval has passed"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);

			const config = {
				timeInterval: 0,
				timeStart: currentTime + 1800,
				timeClaim: currentTime + 3600, // Mid way through first interval
				yearlyInflationTarget: 0.05,
			};

			// Set config
			await rplSetInflationConfig(web3, rp, config, {
				from: owner,
				gas: gasLimit,
			});

			// Run the test now
			const newTokens = await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			assert(newTokens.eq(web3.utils.toBN(0)), "Inflation claimed before interval has passed");
		});

		it(printTitle("userOne", "mint inflation midway through a second interval, then mint again after another interval"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);

			const config = {
				timeInterval: ONE_DAY,
				timeStart: currentTime + ONE_DAY,
				timeClaim: currentTime + ONE_DAY * 2.5, // Claim mid way through second interval
				yearlyInflationTarget: 0.05,
			};

			// Set config
			await rplSetInflationConfig(web3, rp, config, {
				from: owner,
				gas: gasLimit,
			});

			// Claim inflation half way through the second interval
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += config.timeInterval;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += config.timeInterval;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
		});

		it(printTitle("userOne", "mint inflation at multiple random intervals"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);

			const INTERVAL = ONE_DAY;
			const HALF_INTERVAL = INTERVAL / 2;

			const config = {
				timeInterval: INTERVAL,
				timeStart: currentTime + INTERVAL,
				timeClaim: currentTime + INTERVAL * 5,
				yearlyInflationTarget: 0.025,
			};

			// Set config
			await rplSetInflationConfig(web3, rp, config, {
				from: owner,
				gas: gasLimit,
			});

			// Mint inflation now
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_INTERVAL * 3;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_INTERVAL * 10;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_INTERVAL * 20;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_INTERVAL * 24;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_INTERVAL * 32;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_INTERVAL * 38;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_INTERVAL * 53;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_INTERVAL * 70;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
		});

		it(printTitle("userOne", "mint one years inflation after 365 days at 5% which would equal 18,900,000 tokens"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);

			const ONE_DAY = 24 * 60 * 60;

			const config = {
				timeInterval: ONE_DAY,
				timeStart: currentTime + ONE_DAY,
				timeClaim: currentTime + ONE_DAY + ONE_DAY * 365,
				yearlyInflationTarget: 0.05,
			};

			// Set config
			await rplSetInflationConfig(web3, rp, config, {
				from: owner,
				gas: gasLimit,
			});

			// Mint inflation now
			await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, "18900000");
		});

		it(printTitle("userOne", "mint one years inflation every quarter at 5% which would equal 18,900,000 tokens"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);

			const ONE_DAY = 24 * 60 * 60;
			const QUARTER_YEAR = (ONE_DAY * 365) / 4;

			const config = {
				timeInterval: ONE_DAY,
				timeStart: currentTime + ONE_DAY,
				timeClaim: currentTime + ONE_DAY + QUARTER_YEAR,
				yearlyInflationTarget: 0.05,
			};

			// Set config
			await rplSetInflationConfig(web3, rp, config, {
				from: owner,
				gas: gasLimit,
			});

			// Mint inflation now
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += QUARTER_YEAR;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += QUARTER_YEAR;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += QUARTER_YEAR;
			await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, "18900000");
		});

		it(printTitle("userTwo", "mint two years inflation every 6 months at 5% which would equal 19,845,000 tokens"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);

			const ONE_DAY = 24 * 60 * 60;
			const HALF_YEAR = (ONE_DAY * 365) / 2;

			const config = {
				timeInterval: ONE_DAY,
				timeStart: currentTime + ONE_DAY,
				timeClaim: currentTime + ONE_DAY + HALF_YEAR,
				yearlyInflationTarget: 0.05,
			};

			// Set config
			await rplSetInflationConfig(web3, rp, config, {
				from: owner,
				gas: gasLimit,
			});

			// Mint inflation now
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_YEAR;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_YEAR;
			await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			config.timeClaim += HALF_YEAR;
			await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, "19845000");
		});

		it(printTitle("userOne", "mint one years inflation, then set inflation rate to 0 to prevent new inflation"), async () => {
			// Current time
			const currentTime = await getCurrentTime(web3);

			const ONE_DAY = 24 * 60 * 60;

			const config = {
				timeInterval: ONE_DAY,
				timeStart: currentTime + ONE_DAY,
				timeClaim: currentTime + ONE_DAY + ONE_DAY * 365,
				yearlyInflationTarget: 0.05,
			};

			// Set config
			await rplSetInflationConfig(web3, rp, config, {
				from: owner,
				gas: gasLimit,
			});

			// Mint inflation now
			await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, "18900000");

			// Now set inflation to 0
			await setRPLInflationIntervalRate(web3, rp, 0, {
				from: owner,
				gas: gasLimit,
			});
			config.yearlyInflationTarget = 0;

			// Attempt to collect inflation
			config.timeClaim += ONE_DAY * 365;
			const newTokens = await rplClaimInflation(web3, rp, config, {
				from: userOne,
				gas: gasLimit,
			});
			console.log(newTokens);
			//assert(newTokens.eq(web3.utils.toBN(0)), "Minted inflation after rate set to 0");
		});

		it(
			printTitle("userOne", "mint one years inflation, then set inflation rate to 0 to prevent new inflation, then set inflation back to 5% for another year"),
			async () => {
				// Current time
				const currentTime = await getCurrentTime(web3);

				const ONE_DAY = 24 * 60 * 60;

				const config = {
					timeInterval: ONE_DAY,
					timeStart: currentTime + ONE_DAY,
					timeClaim: currentTime + ONE_DAY + ONE_DAY * 365,
					yearlyInflationTarget: 0.05,
				};

				// Set config
				await rplSetInflationConfig(web3, rp, config, {
					from: owner,
					gas: gasLimit,
				});

				// Mint inflation now
				await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, "18900000");

				// Now set inflation to 0
				await setRPLInflationIntervalRate(web3, rp, 0, {
					from: owner,
					gas: gasLimit,
				});
				config.yearlyInflationTarget = 0;
				config.timeClaim += ONE_DAY * 365;
				await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, "18900000");

				// Now set inflation back to 5%
				await setRPLInflationIntervalRate(web3, rp, 0.05, {
					from: owner,
					gas: gasLimit,
				});
				config.yearlyInflationTarget = 0.05;
				config.timeClaim += ONE_DAY * 365;
				await rplClaimInflation(web3, rp, config, { from: userOne, gas: gasLimit }, "19845000");
			}
		);
	});
}
