// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';

// Tests
export default function runContractsTests(web3: Web3, rp: RocketPool): void {
    describe('Settings', (): void => {


        // Deposit settings
        describe('Deposit', (): void => {

            it('Can get deposit settings', async () => {
                let [
                    [depositAllowed, depositChunkSize, depositMin, depositMax],
                    [chunkAssignMax, depositQueueSizeMax, refundDepositAllowed, withdrawalAllowed],
                    [withdrawalMin, withdrawalMax, stakingWithdrawalFeePerc, currentDepositMax],
                ]: [
                    [boolean, string, string, string],
                    [number, string, boolean, boolean],
                    [string, string, number, string],
                ] = await Promise.all([
                    Promise.all([
                        rp.settings.deposit.getDepositAllowed(),
                        rp.settings.deposit.getDepositChunkSize(),
                        rp.settings.deposit.getDepositMin(),
                        rp.settings.deposit.getDepositMax(),
                    ]),
                    Promise.all([
                        rp.settings.deposit.getChunkAssignMax(),
                        rp.settings.deposit.getDepositQueueSizeMax(),
                        rp.settings.deposit.getRefundDepositAllowed(),
                        rp.settings.deposit.getWithdrawalAllowed(),
                    ]),
                    Promise.all([
                        rp.settings.deposit.getWithdrawalMin(),
                        rp.settings.deposit.getWithdrawalMax(),
                        rp.settings.deposit.getStakingWithdrawalFeePerc(),
                        rp.settings.deposit.getCurrentDepositMax('3m'),
                    ]),
                ]);
            });
        });


        // Group settings
        describe('Group', (): void => {



        });


        // Minipool settings
        describe('Minipool', (): void => {



        });


        // Node settings
        describe('Node', (): void => {



        });


    });
};
