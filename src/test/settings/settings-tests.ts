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
                let settings = await Promise.all([
                    rp.settings.deposit.getDepositAllowed(),
                    rp.settings.deposit.getDepositChunkSize(),
                    rp.settings.deposit.getDepositMin(),
                    rp.settings.deposit.getDepositMax(),
                    rp.settings.deposit.getChunkAssignMax(),
                    rp.settings.deposit.getDepositQueueSizeMax(),
                    rp.settings.deposit.getRefundDepositAllowed(),
                    rp.settings.deposit.getWithdrawalAllowed(),
                    rp.settings.deposit.getStakingWithdrawalFeePerc(),
                    rp.settings.deposit.getCurrentDepositMax('3m'),
                ]);
            });
        });


        // Group settings
        describe('Group', (): void => {

            it('Can get group settings', async () => {
                let settings = await Promise.all([
                    rp.settings.group.getDefaultFee(),
                    rp.settings.group.getMaxFee(),
                    rp.settings.group.getNewAllowed(),
                    rp.settings.group.getNewFee(),
                    rp.settings.group.getNewFeeAddress(),
                ]);
            });

        });


        // Minipool settings
        describe('Minipool', (): void => {

            it('Can get minipool settings', async () => {
                let settings = await Promise.all([
                    rp.settings.minipool.getMinipoolLaunchAmount(),
                    rp.settings.minipool.getMinipoolCanBeCreated(),
                    rp.settings.minipool.getMinipoolNewEnabled(),
                    rp.settings.minipool.getMinipoolClosingEnabled(),
                    rp.settings.minipool.getMinipoolMax(),
                    rp.settings.minipool.getMinipoolWithdrawalFeeDepositAddress(),
                    rp.settings.minipool.getMinipoolTimeout(),
                    rp.settings.minipool.getMinipoolActiveSetSize(),
                    rp.settings.minipool.getMinipoolStakingDuration('3m'),
                ]);
            });

        });


        // Node settings
        describe('Node', (): void => {

            it('Can get node settings', async () => {
                let settings = (await Promise.all([
                    Promise.all([
                        rp.settings.node.getNewAllowed(),
                        rp.settings.node.getEtherMin(),
                        rp.settings.node.getInactiveAutomatic(),
                        rp.settings.node.getInactiveDuration(),
                        rp.settings.node.getMaxInactiveNodeChecks(),
                        rp.settings.node.getFeePerc(),
                        rp.settings.node.getMaxFeePerc(),
                        rp.settings.node.getFeeVoteCycleDuration(),
                        rp.settings.node.getFeeVoteCyclePercChange(),
                        rp.settings.node.getDepositAllowed(),
                    ]),
                    Promise.all([
                        rp.settings.node.getDepositReservationTime(),
                        rp.settings.node.getWithdrawalAllowed(),
                    ]),
                ])).reduce((acc: any, val: any): any => acc.concat(val), []);
            });

        });


    });
};
