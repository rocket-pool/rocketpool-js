// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';

// Tests
export default function runContractsTests(web3: Web3, rp: RocketPool) {
    describe('Contracts', () => {


        describe('Addresses', () => {

            it('Can load a single address', async () => {
                let minipoolManagerAddress = await rp.contracts.address('rocketMinipoolManager');
                assert.notEqual(minipoolManagerAddress, '0x0000000000000000000000000000000000000000', 'Loaded address is invalid');
            });

            it('Can load multiple addresses', async () => {
                let [rocketMinipoolQueueAddress, rocketMinipoolStatusAddress] = await rp.contracts.address(['rocketMinipoolQueue', 'rocketMinipoolStatus']);
                assert.notEqual(rocketMinipoolQueueAddress, '0x0000000000000000000000000000000000000000', 'Loaded address is invalid');
                assert.notEqual(rocketMinipoolStatusAddress, '0x0000000000000000000000000000000000000000', 'Loaded address is invalid');
            });

        });


        describe('ABIs', () => {

            it('Can load a single ABI', async () => {
                let minipoolManagerAbi = await rp.contracts.abi('rocketMinipoolManager');
                assert.isArray(minipoolManagerAbi, 'Loaded ABI is invalid');
            });

            it('Can load multiple ABIs', async () => {
                let [rocketMinipoolQueueAbi, rocketMinipoolStatusAbi] = await rp.contracts.abi(['rocketMinipoolQueue', 'rocketMinipoolStatus']);
                assert.isArray(rocketMinipoolQueueAbi, 'Loaded ABI is invalid');
                assert.isArray(rocketMinipoolStatusAbi, 'Loaded ABI is invalid');
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
