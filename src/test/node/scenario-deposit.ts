// Imports
import { assert } from "chai";
import Web3 from "web3";
import { SendOptions } from "web3-eth-contract";
import RocketPool from "../../rocketpool/rocketpool";
import { getTxContractEvents } from "../_utils/contract";
import MinipoolContract from "../../rocketpool/minipool/minipool-contract";

// Make a node deposit
export async function deposit(web3: Web3, rp: RocketPool, minimumNodeFee: string, options: SendOptions) {
  // Get contract addresses
  const rocketMinipoolManager = await rp.contracts.get("rocketMinipoolManager");

  // Get minipool counts
  function getMinipoolCounts(nodeAddress: string) {
    return Promise.all([
      rocketMinipoolManager.methods
        .getMinipoolCount()
        .call()
        .then((value: any) => web3.utils.toBN(value)),
      rocketMinipoolManager.methods
        .getNodeMinipoolCount(nodeAddress)
        .call()
        .then((value: any) => web3.utils.toBN(value)),
    ]).then(([network, node]) => ({ network, node }));
  }

  // Get minipool details
  function getMinipoolDetails(minipoolAddress: string) {
    return rp.minipool
      .getMinipoolContract(minipoolAddress)
      .then((minipool: MinipoolContract) =>
        Promise.all([
          rocketMinipoolManager.methods.getMinipoolExists(minipoolAddress).call(),
          minipool.getNodeAddress(),
          minipool.getNodeDepositBalance(),
          minipool.getNodeDepositAssigned(),
        ])
      )
      .then(([exists, nodeAddress, nodeDepositBalance, nodeDepositAssigned]) => ({
        exists,
        nodeAddress,
        nodeDepositBalance,
        nodeDepositAssigned,
      }));
  }

  // Get initial minipool indexes
  let minipoolCounts1 = await getMinipoolCounts(options.from);

  // Deposit
  let txReceipt = await rp.node.deposit(minimumNodeFee, options);

  // Get minipool created events
  let minipoolCreatedEvents = getTxContractEvents(web3, txReceipt, rocketMinipoolManager.options.address, "MinipoolCreated", [
    { type: "address", name: "minipool", indexed: true },
    { type: "address", name: "node", indexed: true },
    { type: "uint256", name: "created" },
  ]);

  // Get created minipool
  assert(minipoolCreatedEvents.length == 1, "Minipool created event not logged");
  let minipoolAddress = minipoolCreatedEvents[0].minipool;

  // Get updated minipool indexes & created minipool details
  let minipoolCounts2 = await getMinipoolCounts(options.from);
  let [lastMinipoolAddress, lastNodeMinipoolAddress, minipoolDetails] = await Promise.all([
    rocketMinipoolManager.methods.getMinipoolAt(minipoolCounts2.network.sub(web3.utils.toBN(1))).call(),
    rocketMinipoolManager.methods.getNodeMinipoolAt(options.from, minipoolCounts2.node.sub(web3.utils.toBN(1))).call(),
    getMinipoolDetails(minipoolAddress),
  ]);

  // Check minipool indexes
  assert(minipoolCounts2.network.eq(minipoolCounts1.network.add(web3.utils.toBN(1))), "Incorrect updated network minipool count");
  assert.equal(lastMinipoolAddress, minipoolAddress, "Incorrect updated network minipool index");
  assert(minipoolCounts2.node.eq(minipoolCounts1.node.add(web3.utils.toBN(1))), "Incorrect updated node minipool count");
  assert.equal(lastNodeMinipoolAddress, minipoolAddress, "Incorrect updated node minipool index");

  // Check minipool details
  assert.isTrue(minipoolDetails.exists, "Incorrect created minipool exists status");
  //assert.equal(minipoolDetails.nodeAddress, options.from, 'Incorrect created minipool node address');
  //assert(minipoolDetails.nodeDepositBalance.eq(web3.utils.toBN(options.value)), 'Incorrect created minipool node deposit balance');
  assert.isTrue(minipoolDetails.nodeDepositAssigned, "Incorrect created minipool node deposit assigned status");
}
