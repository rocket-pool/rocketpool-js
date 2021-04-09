// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {mintRPL} from '../tokens/scenario-rpl-mint';
import {setDaoNodeTrustedBootstrapMember} from '../dao/scenario-dao-node-trusted-bootstrap';
import {daoNodeTrustedMemberJoin} from '../dao/scenario-dao-node-trusted';


export async function setNodeTrusted(web3: Web3, rp: RocketPool, _account: string, id: string, email: string, owner:string) {
    // Get the DAO settings
    let daoNodeSettings = await rp.contracts.get('rocketDAONodeTrustedSettingsMembers');
    // How much RPL is required for a trusted node bond?
    let rplBondAmount = web3.utils.fromWei(await daoNodeSettings.methods.getRPLBond().call());
    // Mint RPL bond required for them to join
    await mintRPL(web3, rp,_account, rplBondAmount, owner);
    // Set allowance for the Vault to grab the bond
    let rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
    let rocketDAONodeTrustedActions = await rp.contracts.get('rocketDAONodeTrustedActions');
    let _amount = web3.utils.toWei(rplBondAmount.toString(), 'ether');
    await rocketTokenRPL.methods.approve(rocketDAONodeTrustedActions.methods.address().call(), _amount, { from: _account });
    // Create invites for them to become a member
    await setDaoNodeTrustedBootstrapMember(web3, rp, id, email, _account, {from: owner});
    // Now get them to join
    await daoNodeTrustedMemberJoin(web3, rp,{from: _account});
}
