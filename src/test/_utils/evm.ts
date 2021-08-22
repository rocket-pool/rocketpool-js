// Imports
import Web3 from "web3";
import { HttpProvider } from "web3-core";
import { JsonRpcResponse } from "web3-core-helpers";

// Take a snapshot of the EVM state
export function takeSnapshot(web3: Web3): Promise<string> {
  return new Promise((resolve, reject) => {
    (web3.currentProvider as HttpProvider).send(
      {
        jsonrpc: "2.0",
        method: "evm_snapshot",
        params: [],
        id: new Date().getTime(),
      },
      function (err: Error | null, response: JsonRpcResponse | undefined) {
        if (err) {
          reject(err);
        } else if (response && response.result) {
          resolve(response.result);
        } else {
          reject("Unknown error");
        }
      }
    );
  });
}

// Restore a snapshot of EVM state
export function revertSnapshot(web3: Web3, snapshotId: string) {
  return new Promise((resolve, reject) => {
    (web3.currentProvider as HttpProvider).send(
      {
        jsonrpc: "2.0",
        method: "evm_revert",
        params: [snapshotId],
        id: new Date().getTime(),
      },
      function (err: Error | null, response: JsonRpcResponse | undefined) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

// Mine a number of blocks
export async function mineBlocks(web3: Web3, numBlocks: number) {
  for (let i = 0; i < numBlocks; ++i) {
    await new Promise((resolve, reject) => {
      (web3.currentProvider as HttpProvider).send(
        {
          jsonrpc: "2.0",
          method: "evm_mine",
          params: [],
          id: new Date().getTime(),
        },
        function (err: Error | null, response: JsonRpcResponse | undefined) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}

// Fast-forward time
export async function increaseTime(web3: Web3, seconds: number) {
  await new Promise((resolve, reject) => {
    (web3.currentProvider as HttpProvider).send(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [seconds],
        id: new Date().getTime(),
      },
      function (err: Error | null, response: JsonRpcResponse | undefined) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
  // Mine a block using the new time
  await mineBlocks(web3, 1);
}

// Retrieve current time on block chain
export async function getCurrentTime(web3: Web3) {
  return Number((await web3.eth.getBlock("latest")).timestamp);
}
