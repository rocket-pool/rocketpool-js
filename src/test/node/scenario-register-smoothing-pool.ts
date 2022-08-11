// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";

// Register a node for the smoothing pool
export async function setSmoothingPoolRegistrationState(web3: Web3, rp: RocketPool, state: string, options: SendOptions) {
	// Load contracts
	const rocketNodeManager = await rp.contracts.get("rocketNodeManager");

	// Check details
	const newState = await rocketNodeManager.methods.setSmoothingPoolRegistrationState(state, options);
	assert.equal(newState, state, "Incorrect smoothing pool registration state");
}