// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {mintDummyRPL} from './scenario-rpl-mint-fixed';
import {allowDummyRPL} from './scenario-rpl-allow-fixed';
import {burnFixedRPL} from './scenario-rpl-burn-fixed';

export async function mintRPL(web3: Web3, rp: RocketPool, _account: string, _amount: string, owner: string) {
    // Load contracts
    const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
    // Convert
    _amount = web3.utils.toWei(_amount.toString(), 'ether');
    // Mint RPL fixed supply for the users to simulate current users having RPL
    await mintDummyRPL(web3, rp, _account, _amount, { from: owner });
    // Mint a large amount of dummy RPL to owner, who then burns it for real RPL which is sent to nodes for testing below
    await allowDummyRPL(web3, rp, rocketTokenRPL.methods.address().call(), _amount, { from: _account });
    // Burn existing fixed supply RPL for new RPL
    await burnFixedRPL(web3, rp, _amount, { from: _account });
}
