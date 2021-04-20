// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import { SendOptions } from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Withdraw a minipool
export async function withdraw(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {

    // Load contracts
    const rocketNodeManager = await rp.contracts.get('rocketNodeManager');
    const rocketTokenNETH = await rp.contracts.get('rocketTokenNETH');

    // Get parameters
    let nodeAddress = await minipool.contract.methods.getNodeAddress().call();
    let nodeWithdrawalAddress = await rocketNodeManager.methods.getNodeWithdrawalAddress(nodeAddress).call();

    // Get minipool balances
    function getMinipoolBalances() {
        return Promise.all([
            rocketTokenNETH.methods.balanceOf(minipool.contract.options.address).call().then((value: any) => web3.utils.toBN(value)),
            minipool.contract.methods.getNodeRefundBalance().call().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([neth, nodeRefund]) =>
                ({neth, nodeRefund})
        );
    }

    // Get node balances
    function getNodeBalances() {
        return Promise.all([
            rocketTokenNETH.methods.balanceOf(nodeWithdrawalAddress).call().then((value: any) => web3.utils.toBN(value)),
            web3.eth.getBalance(nodeWithdrawalAddress).then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([neth, eth]) =>
                ({neth, eth})
        );
    }

    // Get initial node balances, minipool balances & node withdrawn status
    let [nodeBalances1, minipoolBalances, nodeWithdrawn1] = await Promise.all([
        getNodeBalances(),
        getMinipoolBalances(),
        minipool.contract.methods.getNodeWithdrawn().call(),
    ]);

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();

    // Withdraw & get tx fee
    let txReceipt = await minipool.contract.methods.withdraw().send(options);
    let txFee = gasPrice.mul(web3.utils.toBN(txReceipt.gasUsed));

    // Get updated node balances & node withdrawn status
    let [nodeBalances2, nodeWithdrawn2] = await Promise.all([
        getNodeBalances(),
        minipool.contract.methods.getNodeWithdrawn().call(),
    ]);

    // Check minipool node withdrawn status
    assert.isFalse(nodeWithdrawn1, 'Incorrect initial minipool node withdrawn status');
    assert.isTrue(nodeWithdrawn2, 'Incorrect updated minipool node withdrawn status');

    // Check balances
    let expectedNodeEthBalance = nodeBalances1.eth.add(minipoolBalances.nodeRefund);
    if (nodeWithdrawalAddress == nodeAddress) expectedNodeEthBalance = expectedNodeEthBalance.sub(txFee);
    assert(nodeBalances2.neth.eq(nodeBalances1.neth.add(minipoolBalances.neth)), 'Incorrect updated node nETH balance');
    assert(nodeBalances2.eth.eq(expectedNodeEthBalance), 'Incorrect updated node ETH balance');

}

