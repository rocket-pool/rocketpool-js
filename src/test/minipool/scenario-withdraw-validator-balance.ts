// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import {SendOptions} from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';
import {setNodeWithdrawalAddress} from "../_helpers/node";


// Send validator balance to a minipool
export async function withdrawValidatorBalance(web3: Web3, rp: RocketPool, minipool: MinipoolContract, confirm: boolean = false, options: SendOptions) {

    // Load contracts
    const rocketDAOProtocolSettingsNetwork = await rp.contracts.get('rocketDAOProtocolSettingsNetwork');
    const rocketDepositPool = await rp.contracts.get('rocketDepositPool');
    const rocketMinipoolManager = await rp.contracts.get('rocketMinipoolManager');
    const rocketTokenRETH = await rp.contracts.get('rocketTokenRETH');
    const rocketNodeManager = await rp.contracts.get('rocketNodeManager');

    // Get parameters
    let [
        rethCollateralRate,
        targetRethCollateralRate,
    ] = await Promise.all([
        rp.tokens.reth.getCollateralRate().then((value: any) => web3.utils.toBN(value)),
        rocketDAOProtocolSettingsNetwork.methods.getTargetRethCollateralRate().call().then((value: any) => web3.utils.toBN(value)),
    ]);

    // Get minipool details
    let [
        withdrawalTotalAmount,
        withdrawalNodeAmount,
    ] = await Promise.all([
        rocketMinipoolManager.methods.getMinipoolWithdrawalTotalBalance(minipool.address).call().then((value: any) => web3.utils.toBN(value)),
        rocketMinipoolManager.methods.getMinipoolWithdrawalNodeBalance(minipool.address).call().then((value: any) => web3.utils.toBN(value)),
    ]);

    // Get node parameters
    let nodeAddress = await minipool.getNodeAddress();
    let nodeWithdrawalAddress = await rocketNodeManager.methods.getNodeWithdrawalAddress(nodeAddress).call();
    let withdrawalUserAmount = withdrawalTotalAmount.sub(withdrawalNodeAmount);

    // Get balances
    function getBalances() {
        return Promise.all([
            web3.eth.getBalance(rocketTokenRETH.options.address).then((value: any) => web3.utils.toBN(value)),
            rocketDepositPool.methods.getBalance().call().then((value: any) => web3.utils.toBN(value)),
            web3.eth.getBalance(nodeWithdrawalAddress).then((value: any) => web3.utils.toBN(value)),
            web3.eth.getBalance(minipool.address).then((value: any) => web3.utils.toBN(value))
        ]).then(
            ([rethContractEth, depositPoolEth, nodeWithdrawalEth, minipoolEth]) =>
                ({rethContractEth, depositPoolEth, nodeWithdrawalEth, minipoolEth})
        );
    }

    // Send validator balance to minipool
    let transaction = {
        from: options.from,
        gas: options.gas,
        value: options.value,
        to: minipool.address,
    }
    await web3.eth.sendTransaction(transaction);

    // Get initial balances & withdrawal processed status
    let [balances1, withdrawalProcessed1] = await Promise.all([
        getBalances(),
        rocketMinipoolManager.methods.getMinipoolWithdrawalProcessed(minipool.contract.options.address).call(),
    ]);

    // Payout the balances now
    let txReceipt = await minipool.contract.methods.payout(confirm).send({
        from: options.from,
        gas: options.gas
    });

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();

    let txFee = gasPrice.mul(web3.utils.toBN(txReceipt.gasUsed));

    // Get updated balances & withdrawal processed status
    let [balances2, withdrawalProcessed2] = await Promise.all([
        getBalances(),
        rocketMinipoolManager.methods.getMinipoolWithdrawalProcessed(minipool.contract.options.address).call(),
    ]);

    // Check initial status
    assert.isFalse(withdrawalProcessed1, 'Incorrect initial minipool withdrawal processed status');

    // Check updated status
    assert.isTrue(withdrawalProcessed2, 'Incorrect updated minipool withdrawal processed status');

    // Get expected user amount destination
    let expectRethDeposit = rethCollateralRate.lt(targetRethCollateralRate);

    // Check balances
    if (expectRethDeposit) {
        assert(balances2.rethContractEth.eq(balances1.rethContractEth.add(withdrawalUserAmount)), 'Incorrect updated rETH contract balance');
        assert(balances2.depositPoolEth.eq(balances1.depositPoolEth), 'Incorrect updated deposit pool balance');
    } else {
        assert(balances2.rethContractEth.eq(balances1.rethContractEth), 'Incorrect updated rETH contract balance');
        assert(balances2.depositPoolEth.eq(balances1.depositPoolEth.add(withdrawalUserAmount)), 'Incorrect updated deposit pool balance');
    }

    // Was it the node operator running this or the withdrawal address? We'll need to subtract the tx cost if it's the withdrawal address
    let withdrawalAmount = nodeAddress.toLowerCase() == options.from.toLowerCase() ? withdrawalNodeAmount : withdrawalNodeAmount.sub(txFee);
    // Verify node withdrawal address has the expected ETH
    assert((balances2.nodeWithdrawalEth.sub(balances1.nodeWithdrawalEth)).eq(withdrawalAmount), 'Incorrect node operator withdrawal address balance');

}
