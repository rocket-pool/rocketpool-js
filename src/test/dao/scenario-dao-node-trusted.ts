// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { SendOptions } from 'web3-eth-contract';


// Join the DAO after a successful invite proposal has passed
export async function daoNodeTrustedMemberJoin(web3: Web3, rp: RocketPool, options:SendOptions) {

    // Load contracts
    const rocketDAONodeTrusted = await rp.contracts.get('rocketDAONodeTrusted');
    const rocketDAONodeTrustedActions = await rp.contracts.get('rocketDAONodeTrustedActions');
    const rocketVault =await rp.contracts.get('rocketVault');
    const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');

    // Get data about the tx
    function getTxData() {
        return Promise.all([
            rocketDAONodeTrusted.methods.getMemberCount().call(),
            rocketTokenRPL.methods.balanceOf(options.from).call(),
            rocketVault.methods.balanceOfToken('rocketDAONodeTrustedActions', rocketTokenRPL.options.address).call(),
        ]).then(
            ([memberTotal, rplBalanceBond, rplBalanceVault]) =>
                ({
                    memberTotal:  web3.utils.toBN(memberTotal),
                    rplBalanceBond: web3.utils.toBN(rplBalanceBond),
                    rplBalanceVault: web3.utils.toBN(rplBalanceVault)
                })
        );
    }

    // Capture data
    let ds1 = await getTxData();
    //console.log('Member Total', Number(ds1.memberTotal), web3.utils.fromWei(ds1.rplBalanceBond), web3.utils.fromWei(ds1.rplBalanceVault));

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();
    options.gas = 1000000;

    // Add a new proposal
    await rocketDAONodeTrustedActions.methods.actionJoin().send(options);

    // Capture data
    let ds2 = await getTxData();
    //console.log('Member Total', Number(ds2.memberTotal), web3.utils.fromWei(ds2.rplBalanceBond), web3.utils.fromWei(ds2.rplBalanceVault));

    // Check member count has increased
    assert(ds2.memberTotal.eq(ds1.memberTotal.add(web3.utils.toBN(1))), 'Member count has not increased');
    assert(ds2.rplBalanceVault.eq(ds1.rplBalanceVault.add(ds1.rplBalanceBond)), 'RocketVault address does not contain the correct RPL bond amount');

}
