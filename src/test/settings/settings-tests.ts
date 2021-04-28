// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import {printTitle} from '../_utils/formatting';

// Tests
export default function runSettingsTests(web3: Web3, rp: RocketPool) {
    describe('Settings', () => {


        describe('Deposit', () => {

            it(printTitle('User', 'Can get deposit settings'), async () => {
                let settings = await Promise.all([
                    rp.settings.deposit.getDepositEnabled(),
                    rp.settings.deposit.getAssignDepositsEnabled(),
                    rp.settings.deposit.getMinimumDeposit(),
                    rp.settings.deposit.getMaximumDepositPoolSize(),
                    rp.settings.deposit.getMaximumDepositAssignments(),
                ]);
            });

        });


        describe('Minipool', () => {

            it(printTitle('User', 'Can get minipool settings'), async () => {
                let settings = await Promise.all([
                    rp.settings.minipool.getLaunchBalance(),
                    rp.settings.minipool.getSubmitWithdrawableEnabled(),
                    rp.settings.minipool.getLaunchTimeout(),
                    rp.settings.minipool.getWithdrawalDelay(),
                ]);
            });

        });


        describe('Network', () => {

            it(printTitle('User', 'Can get network settings'), async () => {
                let settings = await Promise.all([
                    rp.settings.network.getNodeConsensusThreshold(),
                    rp.settings.network.getSubmitBalancesEnabled(),
                    rp.settings.network.getSubmitBalancesFrequency(),
                    rp.settings.network.getProcessWithdrawalsEnabled(),
                    rp.settings.network.getMinimumNodeFee(),
                    rp.settings.network.getTargetNodeFee(),
                    rp.settings.network.getMaximumNodeFee(),
                    rp.settings.network.getNodeFeeDemandRange(),
                    rp.settings.network.getTargetRethCollateralRate(),
                ]);
            });

        });


        describe('Node', () => {

            it(printTitle('User', 'Can get node settings'), async () => {
                let settings = await Promise.all([
                    rp.settings.node.getRegistrationEnabled(),
                    rp.settings.node.getDepositEnabled(),
                ]);
            });

        });


    });
};
