// Imports
import { assert } from "chai";
import Web3 from "web3";
import RocketPool from "../../rocketpool/rocketpool";
import { SendOptions } from "web3-eth-contract";

export async function mintDummyRPL(web3: Web3, rp: RocketPool, _account: string, _amount: string, options: SendOptions) {
  // Load contracts
  const rocketTokenDummyRPL = await rp.contracts.get("rocketTokenRPLFixedSupply");

  // Get balances
  function getBalances() {
    return Promise.all([rocketTokenDummyRPL.methods.totalSupply().call(), rocketTokenDummyRPL.methods.balanceOf(_account).call()]).then(
      ([tokenSupply, userTokenBalance]) => ({
        tokenSupply: web3.utils.toBN(tokenSupply),
        userTokenBalance: web3.utils.toBN(userTokenBalance),
      })
    );
  }

  // Get initial balances
  let balances1 = await getBalances();

  // Set gas price
  let gasPrice = web3.utils.toBN(web3.utils.toWei("20", "gwei"));
  options.gasPrice = gasPrice.toString();

  // Mint tokens
  let txReceipt = await rocketTokenDummyRPL.methods.mint(_account, _amount).send(options);
  let txFee = gasPrice.mul(web3.utils.toBN(txReceipt.gasUsed));

  // Get updated balances
  let balances2 = await getBalances();

  // Calculate values
  let mintAmount = web3.utils.toBN(_amount);

  // Check balances
  assert(balances2.tokenSupply.eq(balances1.tokenSupply.add(mintAmount)), "Incorrect updated token supply");
  assert(balances2.userTokenBalance.eq(balances1.userTokenBalance.add(mintAmount)), "Incorrect updated user token balance");
}
