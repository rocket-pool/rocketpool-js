// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';

// Tests
export default function runContractsTests(web3: Web3, rp: RocketPool) {
    describe('Contracts', () => {


        describe('ABIs', () => {

            it('Can load a single ABI', async () => {
                let minipoolAbi = await rp.contracts.abi('rocketMinipool');
                assert.isArray(minipoolAbi, 'Loaded ABI is invalid');
            });

            it('Can load multiple ABIs', async () => {
                let [rocketMinipoolManagerAbi, rocketMinipoolQueueAbi] = await rp.contracts.abi(['rocketMinipoolManager', 'rocketMinipoolQueue']);
                assert.isArray(rocketMinipoolManagerAbi, 'Loaded ABI is invalid');
                assert.isArray(rocketMinipoolQueueAbi, 'Loaded ABI is invalid');
            });

        });


        describe('Contracts', () => {

            it('Can load a single contract', async () => {
                let rocketNetworkBalances = await rp.contracts.get('rocketNetworkBalances');
                assert.property(rocketNetworkBalances, 'methods', 'Loaded contract is invalid');
            });

            it('Can load multiple contracts', async () => {
                let [rocketNetworkFees, rocketNetworkWithdrawal] = await rp.contracts.get(['rocketNetworkFees', 'rocketNetworkWithdrawal']);
                assert.property(rocketNetworkFees, 'methods', 'Loaded contract is invalid');
                assert.property(rocketNetworkWithdrawal, 'methods', 'Loaded contract is invalid');
            });

            it('Can create a new contract instance', async () => {
                let minipool = await rp.contracts.make('rocketMinipool', '0x1111111111111111111111111111111111111111');
                assert.property(minipool, 'methods', 'Created contract is invalid');
            });

        });


    });
};
