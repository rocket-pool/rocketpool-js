// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";
import { setNodeWithdrawalAddress } from "../_helpers/node";

// Send validator balance to a minipool
export async function withdrawValidatorBalance(
  web3: Web3,
  rp: RocketPool,
  minipool: MinipoolContract,
  withdrawalBalance: string,
  from: string,
  finalise: boolean = false
) {
  // Convert to BN
  let _withdrawalBalance = web3.utils.toBN(withdrawalBalance);

  // Load contracts
  const rocketTokenRETH = await rp.contracts.get("rocketTokenRETH");
  const rocketMinipoolPenalty = await rp.contracts.get("rocketMinipoolPenalty");

  // Get node parameters
  let nodeAddress = await minipool.getNodeAddress();
  let nodeWithdrawalAddress = await rp.node.getNodeWithdrawalAddress(nodeAddress);

  // Get parameters
  let [nodeFee] = await Promise.all([
    minipool.contract.methods
      .getNodeFee()
      .call()
      .then((value: string | number) => web3.utils.toBN(value)),
  ]);

  // Get balances
  function getBalances() {
    return Promise.all([
      web3.eth.getBalance(rocketTokenRETH.options.address).then((value) => web3.utils.toBN(value)),
      rp.deposit.getBalance().then((value) => web3.utils.toBN(value)),
      web3.eth.getBalance(nodeWithdrawalAddress).then((value) => web3.utils.toBN(value)),
      web3.eth.getBalance(minipool.address).then((value) => web3.utils.toBN(value)),
    ]).then(([rethContractEth, depositPoolEth, nodeWithdrawalEth, minipoolEth]) => ({
      rethContractEth,
      depositPoolEth,
      nodeWithdrawalEth,
      minipoolEth,
    }));
  }

  // Get minipool balances
  function getMinipoolBalances(destroyed = false) {
    if (destroyed) {
      return {
        nodeDepositBalance: web3.utils.toBN("0"),
        nodeRefundBalance: web3.utils.toBN("0"),
        userDepositBalance: web3.utils.toBN("0"),
      };
    }
    return Promise.all([
      minipool.getNodeDepositBalance().then((value) => web3.utils.toBN(value)),
      minipool.getNodeRefundBalance().then((value) => web3.utils.toBN(value)),
      minipool.getUserDepositBalance().then((value) => web3.utils.toBN(value)),
    ]).then(([nodeDepositBalance, nodeRefundBalance, userDepositBalance]) => ({
      nodeDepositBalance,
      nodeRefundBalance,
      userDepositBalance,
    }));
  }

  // Send validator balance to minipool
  if (_withdrawalBalance.gt(web3.utils.toBN("0"))) {
    await web3.eth.sendTransaction({
      from: from,
      to: minipool.address,
      gas: 12450000,
      value: withdrawalBalance,
    });
  }

  // Get total withdrawal balance
  _withdrawalBalance = web3.utils.toBN(await web3.eth.getBalance(minipool.address));

  // Get initial balances & withdrawal processed status
  let [balances1, minipoolBalances1] = await Promise.all([getBalances(), getMinipoolBalances()]);

  // Set gas price
  let gasPrice = web3.utils.toBN(web3.utils.toWei("20", "gwei"));

  // Payout the balances now
  let txReceipt;

  if (finalise) {
    txReceipt = await minipool.distributeBalanceAndFinalise({
      from: from,
      gasPrice: gasPrice.toString(),
      gas: 8000000,
    });
  } else {
    txReceipt = await minipool.distributeBalance({
      from: from,
      gasPrice: gasPrice.toString(),
      gas: 8000000,
    });
  }

  let txFee = gasPrice.mul(web3.utils.toBN(txReceipt.gasUsed));

  // Get updated balances & withdrawal processed status
  let [balances2, minipoolBalances2] = await Promise.all([getBalances(), getMinipoolBalances(finalise)]);

  // Add the fee back into the balance to make assertions easier
  if (from === nodeWithdrawalAddress) {
    balances2.nodeWithdrawalEth = balances2.nodeWithdrawalEth.add(txFee);
  }

  let nodeBalanceChange = balances2.nodeWithdrawalEth
    .add(minipoolBalances2.nodeRefundBalance)
    .sub(balances1.nodeWithdrawalEth.add(minipoolBalances1.nodeRefundBalance));
  let rethBalanceChange = balances2.rethContractEth.sub(balances1.rethContractEth);
  let depositPoolChange = balances2.depositPoolEth.sub(balances1.depositPoolEth);

  // console.log('Node deposit balance:', web3.utils.fromWei(minipoolBalances1.nodeDepositBalance), web3.utils.fromWei(minipoolBalances2.nodeDepositBalance));
  // console.log('Node refund balance:', web3.utils.fromWei(minipoolBalances1.nodeRefundBalance), web3.utils.fromWei(minipoolBalances2.nodeRefundBalance));
  // console.log('User deposit balance:', web3.utils.fromWei(minipoolBalances1.userDepositBalance), web3.utils.fromWei(minipoolBalances2.userDepositBalance));
  // console.log('Node fee:', web3.utils.fromWei(nodeFee));
  // console.log('Minipool Amount:', web3.utils.fromWei(balances1.minipoolEth), web3.utils.fromWei(balances2.minipoolEth), web3.utils.fromWei(balances2.minipoolEth.sub(balances1.minipoolEth)));
  // console.log('Node Withdrawal Address Amount:', web3.utils.fromWei(balances1.nodeWithdrawalEth), web3.utils.fromWei(balances2.nodeWithdrawalEth), web3.utils.fromWei(balances2.nodeWithdrawalEth.sub(balances1.nodeWithdrawalEth)));
  // console.log('rETH Contract Amount:', web3.utils.fromWei(balances1.rethContractEth), web3.utils.fromWei(balances2.rethContractEth), web3.utils.fromWei(balances2.rethContractEth.sub(balances1.rethContractEth)));

  // Get penalty rate for this minipool
  const penaltyRate = web3.utils.toBN(await rocketMinipoolPenalty.methods.getPenaltyRate(minipool.address).call());

  // Calculate rewards
  let depositBalance = web3.utils.toBN(web3.utils.toWei("32"));
  if (_withdrawalBalance.gte(depositBalance)) {
    let depositType = await minipool.getDepositType();
    let userAmount = minipoolBalances1.userDepositBalance;
    let rewards = _withdrawalBalance.sub(depositBalance);
    let halfRewards = rewards.divn(2);
    let nodeCommissionFee = halfRewards.mul(web3.utils.toBN(nodeFee)).div(web3.utils.toBN(web3.utils.toWei("1")));
    if (depositType.toString() === "3") {
      // Unbonded
      userAmount = userAmount.add(rewards.sub(nodeCommissionFee));
    } else {
      userAmount = userAmount.add(halfRewards.sub(nodeCommissionFee));
    }
    let nodeAmount = _withdrawalBalance.sub(userAmount);

    // Adjust amounts according to penalty rate
    if (penaltyRate.gt(web3.utils.toBN("0"))) {
      let penaltyAmount = nodeAmount.mul(penaltyRate).div(web3.utils.toBN(web3.utils.toWei("1")));
      if (penaltyRate.gt(nodeAmount)) {
        penaltyAmount = nodeAmount;
      }
      nodeAmount = nodeAmount.sub(penaltyAmount);
      userAmount = userAmount.add(penaltyAmount);
    }

    // console.log('Rewards: ', web3.utils.fromWei(rewards));
    // console.log('Node amount: ', web3.utils.fromWei(nodeAmount));
    // console.log('User amount: ', web3.utils.fromWei(userAmount));

    // Check balances
    assert(rethBalanceChange.add(depositPoolChange).eq(userAmount), "rETH balance was not correct");
    assert(nodeBalanceChange.eq(nodeAmount), "Node balance was not correct");

    // If not sent from node operator then refund balance should be correct
    if (!(from === nodeWithdrawalAddress || from === nodeAddress)) {
      let refundBalance = await minipool.getNodeRefundBalance().then((value) => web3.utils.toBN(value));
      // console.log('Node refund balance after withdrawal:', web3.utils.fromWei(refundBalance));
      assert(refundBalance.eq(minipoolBalances1.nodeRefundBalance.add(nodeAmount)), "Node balance was not correct");
    }
  }

  return {
    nodeBalanceChange,
    rethBalanceChange,
  };
}
