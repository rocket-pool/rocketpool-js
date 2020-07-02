// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';

// Tests
export default function runSettingsTests(web3: Web3, rp: RocketPool) {
    describe('Settings', () => {


        // Deposit
        describe('Deposit', () => {

            it('Can get deposit settings', async () => {
                let settings = await Promise.all([
                    rp.settings.deposit.getDepositEnabled(),
                    rp.settings.deposit.getAssignDepositsEnabled(),
                    rp.settings.deposit.getMinimumDeposit(),
                    rp.settings.deposit.getMaximumDepositPoolSize(),
                    rp.settings.deposit.getMaximumDepositAssignments(),
                ]);
            });

        });


        // Minipool
        describe('Minipool', () => {

            it('Can get minipool settings', async () => {
                let settings = await Promise.all([
                    rp.settings.minipool.getLaunchBalance(),
                    rp.settings.minipool.getSubmitExitedEnabled(),
                    rp.settings.minipool.getSubmitWithdrawableEnabled(),
                    rp.settings.minipool.getLaunchTimeout(),
                    rp.settings.minipool.getWithdrawalDelay(),
                ]);
            });

        });


        // Network
        describe('Network', () => {

            it('Can get network settings', async () => {
                let settings = await Promise.all([
                    rp.settings.network.getSubmitBalancesEnabled(),
                    rp.settings.network.getProcessWithdrawalsEnabled(),
                    rp.settings.network.getMinimumNodeFee(),
                    rp.settings.network.getTargetNodeFee(),
                    rp.settings.network.getMaximumNodeFee(),
                    rp.settings.network.getNodeFeeDemandRange(),
                    rp.settings.network.getTargetRethCollateralRate(),
                ]);
            });

        });


        // Node
        describe('Node', () => {

            it('Can get node settings', async () => {
                let settings = await Promise.all([
                    rp.settings.node.getRegistrationEnabled(),
                    rp.settings.node.getDepositEnabled(),
                ]);
            });

        });


    });
};
