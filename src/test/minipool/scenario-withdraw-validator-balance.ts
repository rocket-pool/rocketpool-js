// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Send validator balance to a minipool
export async function withdrawValidatorBalance(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions, withdrawalExpected?: boolean) {

    // Load contracts
    const rocketDAOProtocolSettingsNetwork = await rp.contracts.get('rocketDAOProtocolSettingsNetwork');
    const rocketDepositPool = await rp.contracts.get('rocketDepositPool');
    const rocketMinipoolManager = await rp.contracts.get('rocketMinipoolManager');
    const rocketTokenNETH = await rp.contracts.get('rocketTokenNETH');
    const rocketTokenRETH = await rp.contracts.get('rocketTokenRETH');

    // Get parameters
    let [
        rethCollateralRate,
        targetRethCollateralRate,
    ] = await Promise.all([
        rocketTokenRETH.methods.getCollateralRate().call().then((value: any) => web3.utils.toBN(value)),
        rocketDAOProtocolSettingsNetwork.methods.getTargetRethCollateralRate().call().then((value: any) => web3.utils.toBN(value)),
    ]);

    // Get minipool details
    let [
        withdrawalTotalAmount,
        withdrawalNodeAmount,
    ] = await Promise.all([
        rocketMinipoolManager.methods.getMinipoolWithdrawalTotalBalance(minipool.contract.options.address).call().then((value: any) => web3.utils.toBN(value)),
        rocketMinipoolManager.methods.getMinipoolWithdrawalNodeBalance(minipool.contract.options.address).call().then((value: any) => web3.utils.toBN(value)),
    ]);
    let withdrawalUserAmount = withdrawalTotalAmount.sub(withdrawalNodeAmount);

    // Get balances
    function getBalances() {
        return Promise.all([
            web3.eth.getBalance(rocketTokenNETH.options.address).then((value: any) => web3.utils.toBN(value)),
            web3.eth.getBalance(rocketTokenRETH.options.address).then((value: any) => web3.utils.toBN(value)),
            rocketDepositPool.methods.getBalance().call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([nethContractEth, rethContractEth, depositPoolEth]) =>
                ({nethContractEth, rethContractEth, depositPoolEth})
        );
    }

    // Get initial balances & withdrawal processed status
    let [balances1, balanceWithdrawn1, withdrawalProcessed1] = await Promise.all([
        getBalances(),
        minipool.contract.methods.getValidatorBalanceWithdrawn().call(),
        rocketMinipoolManager.methods.getMinipoolWithdrawalProcessed(minipool.contract.options.address).call(),
    ]);

    // Send validator balance to minipool
    options.gas = 12450000;
    let transaction = {
        from: options.from,
        gas: options.gas,
        value: options.value,
        to: minipool.contract.options.address,
    }

    await web3.eth.sendTransaction(transaction);

    // Is a payout expected?
    if (withdrawalExpected !== false) {
        await minipool.contract.methods.payout().send({
            from: options.from,
            gas: options.gas
        });
    }

    // Get updated balances & withdrawal processed status
    let [balances2, balanceWithdrawn2, withdrawalProcessed2] = await Promise.all([
        getBalances(),
        minipool.contract.methods.getValidatorBalanceWithdrawn().call(),
        rocketMinipoolManager.methods.getMinipoolWithdrawalProcessed(minipool.contract.options.address).call(),
    ]);

    // Check initial status
    assert.isFalse(balanceWithdrawn1, 'Incorrect initial minipool validator balance withdrawn status');
    assert.isFalse(withdrawalProcessed1, 'Incorrect initial minipool withdrawal processed status');

    // Withdrawal expected
    if (withdrawalExpected !== false) {

        // Check updated status
        assert.isTrue(balanceWithdrawn2, 'Incorrect updated minipool validator balance withdrawn status');
        assert.isTrue(withdrawalProcessed2, 'Incorrect updated minipool withdrawal processed status');

        // Get expected user amount destination
        let expectRethDeposit = rethCollateralRate.lt(targetRethCollateralRate);

        // Check balances
        assert(balances2.nethContractEth.eq(balances1.nethContractEth.add(withdrawalNodeAmount)), 'Incorrect updated nETH contract balance');
        if (expectRethDeposit) {
            assert(balances2.rethContractEth.eq(balances1.rethContractEth.add(withdrawalUserAmount)), 'Incorrect updated rETH contract balance');
            assert(balances2.depositPoolEth.eq(balances1.depositPoolEth), 'Incorrect updated deposit pool balance');
        } else {
            assert(balances2.rethContractEth.eq(balances1.rethContractEth), 'Incorrect updated rETH contract balance');
            assert(balances2.depositPoolEth.eq(balances1.depositPoolEth.add(withdrawalUserAmount)), 'Incorrect updated deposit pool balance');
        }

    }

    // Withdrawal not expected
    else {

        // Check updated status
        assert.isFalse(balanceWithdrawn2, 'Incorrect updated minipool validator balance withdrawn status');
        assert.isFalse(withdrawalProcessed2, 'Incorrect updated minipool withdrawal processed status');

    }
}
