// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import { getCurrentTime } from '../_utils/evm'


// Can this trusted node make a claim yet? They need to wait 1 claim interval after being made a trusted node
export async function rewardsClaimTrustedNodePossibleGet(web3: Web3, rp: RocketPool, trustedNodeAddress: string, options: SendOptions) {
    return await rp.rewards.claimNode.getClaimPossible(trustedNodeAddress);
};


// Get the current rewards claim period in seconds
export async function rewardsClaimTrustedNodeRegisteredTimeGet(web3: Web3, rp: RocketPool, trustedNodeAddress: string, options: SendOptions) {
    // Load contracts
    const rocketClaimTrustedNode = await rp.contracts.get('rocketClaimTrustedNode');
    // Do it
    return await rp.rewards.pool.getClaimContractRegisteredTime(rocketClaimTrustedNode.options.address, trustedNodeAddress);
};


// Perform rewards claims for Trusted Nodes + Minipools
export async function rewardsClaimTrustedNode(web3: Web3, rp: RocketPool, trustedNodeAccount: string, options: SendOptions) {

    // Get data about the tx
    function getTxData() {
        return Promise.all([
            getCurrentTime(web3),
            rp.rewards.pool.getClaimIntervalTimeStart().then((value: any) => web3.utils.toBN(value)),
            rp.rewards.pool.getClaimingContractAllowance('rocketClaimTrustedNode').then((value: any) => web3.utils.toBN(value)),
            rp.rewards.pool.getClaimingContractTotalClaimed('rocketClaimTrustedNode').then((value: any) => web3.utils.toBN(value)),
            rp.rewards.pool.getClaimingContractPerc('rocketClaimTrustedNode').then((value: any) => web3.utils.toBN(value)),
            rp.rewards.claimTrustedNode.getClaimRewardsAmount(options.from).then((value: any) => web3.utils.toBN(value)),
            rp.rewards.pool.getClaimingContractUserTotalCurrent('rocketClaimTrustedNode').then((value: any) => web3.utils.toBN(value))
        ]).then(
            ([currentTime, claimIntervalTimeStart, contractClaimAllowance, contractClaimTotal, contractClaimPerc, trustedNodeClaimAmount, trustedNodeClaimIntervalTotal]) =>
                ({currentTime, claimIntervalTimeStart, contractClaimAllowance, contractClaimTotal, contractClaimPerc, trustedNodeClaimAmount, trustedNodeClaimIntervalTotal})
        );
    }

    // Capture data
    let ds1 = await getTxData();

    //console.log('Node DAO Contract Amount', Number(web3.utils.fromWei(ds1.currentTime)), Number(web3.utils.fromWei(ds1.claimIntervalTimeStart)));

    // Perform tx
    await rp.rewards.claimTrustedNode.claim(options);

    // Capture data
    let ds2 = await getTxData();

    //console.log('Node DAO Contract Amount', Number(web3.utils.fromWei(ds2.currentTime)), Number(web3.utils.fromWei(ds2.claimIntervalTimeStart)));

    // Verify
    if(Number(ds1.claimIntervalTimeStart) == Number(ds2.claimIntervalTimeStart)) {
        // Claim occured in the same interval
        assert(ds2.contractClaimTotal.eq(ds1.contractClaimTotal.add(ds1.trustedNodeClaimAmount)), 'Contract claim amount total incorrect');
        // How many trusted nodes where in this interval? Their % claimed should be equal to that
        assert(Number(web3.utils.fromWei(ds1.trustedNodeClaimAmount)).toFixed(4) == Number(web3.utils.fromWei(ds2.contractClaimAllowance.div(ds2.trustedNodeClaimIntervalTotal))).toFixed(4), 'Contract claim amount should be equal to their desired equal allocation');
        // The contracts claim perc should never change after a claim in the same interval
        assert(ds1.contractClaimPerc.eq(ds2.contractClaimPerc), "Contracts claiming percentage changed in an interval");
    }else{
        // Check to see if the claim tx has pushed us into a new claim interval
        // The contracts claim total should be greater than 0 due to the claim that just occured
        assert(ds2.contractClaimTotal.gt(web3.utils.toBN(0)), 'Contract claim amount should be > 0 for new interval');
        // How many trusted nodes where in this interval? Their % claimed should be equal to that
        assert(Number(web3.utils.fromWei(ds2.contractClaimTotal)).toFixed(4) == Number(web3.utils.fromWei(ds2.contractClaimAllowance.div(ds2.trustedNodeClaimIntervalTotal))).toFixed(4), 'Contract claim amount should be equal to their desired equal allocation');
    }
    // Always verify
    // Can't claim more than contracts allowance
    assert(ds2.contractClaimTotal.lte(ds2.contractClaimAllowance), 'Trusted node claimed more than contracts allowance');

};
