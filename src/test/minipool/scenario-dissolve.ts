// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Dissolve a minipool
export async function dissolve(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {

    // Get minipool details
    function getMinipoolDetails() {
        return Promise.all([
            minipool.contract.methods.getStatus().call().then((value: any) => web3.utils.toBN(value)),
            minipool.contract.methods.getUserDepositBalance().call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([status, userDepositBalance]) =>
                ({status, userDepositBalance})
        );
    }

    // Get initial minipool details
    let details1 = await getMinipoolDetails();

    // Dissolve
    await minipool.contract.methods.dissolve().send(options);

    // Get updated minipool details
    let details2 = await getMinipoolDetails();

    // Check minipool details
    const dissolved = web3.utils.toBN(4);
    assert(!details1.status.eq(dissolved), 'Incorrect initial minipool status');
    assert(details2.status.eq(dissolved), 'Incorrect updated minipool status');
    assert(details2.userDepositBalance.eq(web3.utils.toBN(0)), 'Incorrect updated minipool user deposit balance');

}

