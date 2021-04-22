// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Stake RPL against the node
export async function stakeRpl(web3: Web3, rp: RocketPool, amount: string, options: SendOptions) {

    // Load contracts
    const rocketMinipoolManager = await rp.contracts.get('rocketMinipoolManager');
    const rocketDAOProtocolSettingsMinipool = await rp.contracts.get('rocketDAOProtocolSettingsMinipool');
    const rocketNetworkPrices = await rp.contracts.get('rocketNetworkPrices');
    const rocketDAOProtocolSettingsNode = await rp.contracts.get('rocketDAOProtocolSettingsNode');
    const rocketNodeStaking = await rp.contracts.get('rocketNodeStaking');
    const rocketTokenRPL = await rp.contracts.get('rocketTokenRPL');
    const rocketVault = await rp.contracts.get('rocketVault');

    // Get parameters
    const [
        depositUserAmount,
        minPerMinipoolStake,
        maxPerMinipoolStake,
        rplPrice,
    ] = await Promise.all([
        rocketDAOProtocolSettingsMinipool.methods.getHalfDepositUserAmount().call().then((value: any) => web3.utils.toBN(value)),
        rocketDAOProtocolSettingsNode.methods.getMinimumPerMinipoolStake().call().then((value: any) => web3.utils.toBN(value)),
        rocketDAOProtocolSettingsNode.methods.getMaximumPerMinipoolStake().call().then((value: any) => web3.utils.toBN(value)),
        rocketNetworkPrices.methods.getRPLPrice().call().then((value: any) => web3.utils.toBN(value)),
    ]);

    // Get token balances
    function getTokenBalances(nodeAddress: string) {
        return Promise.all([
            rocketTokenRPL.methods.balanceOf(nodeAddress).call().then((value: any) => web3.utils.toBN(value)),
            rocketTokenRPL.methods.balanceOf(rocketVault.options.address).call().then((value: any) => web3.utils.toBN(value)),
            rocketVault.methods.balanceOfToken('rocketNodeStaking', rocketTokenRPL.options.address).call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([nodeRpl, vaultRpl, stakingRpl]) =>
                ({nodeRpl, vaultRpl, stakingRpl})
        );
    }

    // Get staking details
    function getStakingDetails(nodeAddress: string) {
        return Promise.all([
            rocketNodeStaking.methods.getTotalRPLStake().call().then((value: any) => web3.utils.toBN(value)),
            rocketNodeStaking.methods.getTotalEffectiveRPLStake().call().then((value: any) => web3.utils.toBN(value)),
            rocketNodeStaking.methods.getNodeRPLStake(nodeAddress).call().then((value: any) => web3.utils.toBN(value)),
            rocketNodeStaking.methods.getNodeEffectiveRPLStake(nodeAddress).call().then((value: any) => web3.utils.toBN(value)),
            rocketNodeStaking.methods.getNodeMinipoolLimit(nodeAddress).call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([totalStake, totalEffectiveStake, nodeStake, nodeEffectiveStake, nodeMinipoolLimit]) =>
                ({totalStake, totalEffectiveStake, nodeStake, nodeEffectiveStake, nodeMinipoolLimit})
        );
    }

    // Get minipool counts
    function getMinipoolCounts(nodeAddress: string) {
        return Promise.all([
            rocketMinipoolManager.methods.getMinipoolCount().call().then((value: any) => web3.utils.toBN(value)),
            rocketMinipoolManager.methods.getNodeMinipoolCount(nodeAddress).call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([total, node]) =>
                ({total, node})
        );
    }

    // Get initial token balances & staking details
    let [balances1, details1] = await Promise.all([
        getTokenBalances(options.from),
        getStakingDetails(options.from),
    ]);

    // Stake RPL
    await rocketNodeStaking.methods.stakeRPL(amount).send(options);

    // Get updated token balances, staking details & minipool counts
    let [balances2, details2, minipoolCounts] = await Promise.all([
        getTokenBalances(options.from),
        getStakingDetails(options.from),
        getMinipoolCounts(options.from),
    ]);

    // Calculate expected effective stakes & node minipool limit
    const maxTotalEffectiveStake = depositUserAmount.mul(maxPerMinipoolStake).mul(minipoolCounts.total).div(rplPrice);
    const expectedTotalEffectiveStake = (details2.totalStake.lt(maxTotalEffectiveStake)? details2.totalStake : maxTotalEffectiveStake);
    const maxNodeEffectiveStake = depositUserAmount.mul(maxPerMinipoolStake).mul(minipoolCounts.node).div(rplPrice);
    const expectedNodeEffectiveStake = (details2.nodeStake.lt(maxNodeEffectiveStake)? details2.nodeStake : maxNodeEffectiveStake);
    const expectedNodeMinipoolLimit = details2.nodeStake.mul(rplPrice).div(depositUserAmount.mul(minPerMinipoolStake));

    // Check token balances
    assert(balances2.nodeRpl.eq(balances1.nodeRpl.sub(web3.utils.toBN(amount))), 'Incorrect updated node RPL balance');
    assert(balances2.vaultRpl.eq(balances1.vaultRpl.add(web3.utils.toBN(amount))), 'Incorrect updated vault RPL balance');
    assert(balances2.stakingRpl.eq(balances1.stakingRpl.add(web3.utils.toBN(amount))), 'Incorrect updated RocketNodeStaking contract RPL vault balance');

    // Check staking details
    assert(details2.totalStake.eq(details1.totalStake.add(web3.utils.toBN(amount))), 'Incorrect updated total RPL stake');
    assert(details2.nodeStake.eq(details1.nodeStake.add(web3.utils.toBN(amount))), 'Incorrect updated node RPL stake');
    assert(details2.totalEffectiveStake.eq(expectedTotalEffectiveStake), 'Incorrect updated effective total RPL stake');
    assert(details2.nodeEffectiveStake.eq(expectedNodeEffectiveStake), 'Incorrect updated effective node RPL stake');
    assert(details2.nodeMinipoolLimit.eq(expectedNodeMinipoolLimit), 'Incorrect updated node minipool limit');

}

