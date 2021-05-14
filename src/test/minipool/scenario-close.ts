// Imports
import {assert} from 'chai';
import Web3 from 'web3';
import {SendOptions} from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';
import MinipoolContract from '../../rocketpool/minipool/minipool-contract';


// Close a minipool
export async function close(web3: Web3, rp: RocketPool, minipool: MinipoolContract, options: SendOptions) {

    // Get parameters
    let nodeAddress = await minipool.getNodeAddress();
    let nodeWithdrawalAddress = await rp.node.getNodeWithdrawalAddress(nodeAddress);

    // Get minipool balances
    function getMinipoolBalances() {
        return Promise.all([
            minipool.getNodeDepositBalance().then((value: any) => web3.utils.toBN(value)),
            minipool.getNodeRefundBalance().then((value: any) => web3.utils.toBN(value)),
        ]).then(
            ([nodeDeposit, nodeRefund]) =>
                ({nodeDeposit, nodeRefund})
        );
    }

    // Get initial node balance & minipool balances
    let [nodeBalance1, minipoolBalances] = await Promise.all([
        web3.eth.getBalance(nodeWithdrawalAddress).then((value: any) => web3.utils.toBN(value)),
        getMinipoolBalances(),
    ]);

    // Set gas price
    let gasPrice = web3.utils.toBN(web3.utils.toWei('20', 'gwei'));
    options.gasPrice = gasPrice.toString();

    // Close & get tx fee
    let txReceipt = await minipool.close(options);
    let txFee = gasPrice.mul(web3.utils.toBN(txReceipt.gasUsed));

    // Get updated node balance & minipool contract code
    let [nodeBalance2, minipoolCode] = await Promise.all([
        web3.eth.getBalance(nodeWithdrawalAddress).then((value: any) => web3.utils.toBN(value)),
        web3.eth.getCode(minipool.address),
    ]);

    // Check balances
    let expectedNodeBalance = nodeBalance1.add(minipoolBalances.nodeDeposit).add(minipoolBalances.nodeRefund);
    if (nodeWithdrawalAddress == nodeAddress) expectedNodeBalance = expectedNodeBalance.sub(txFee);
    assert(nodeBalance2.eq(expectedNodeBalance), 'Incorrect updated node nETH balance');

    // Check minipool contract code
    assert.equal(minipoolCode, '0x', 'Minipool contract was not destroyed');

}
