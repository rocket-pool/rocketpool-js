// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';

// Tests
export default function runContractsTests(web3: Web3, rp: RocketPool): void {
    describe('Contracts', (): void => {


        // ABI loading
        describe('ABIs', (): void => {

            it('Can load a single ABI', async () => {
                let minipoolAbi = await rp.contracts.abi('rocketMinipool');
                assert.isArray(minipoolAbi, 'ABI is not an array');
            });

            it('Can load multiple ABIs', async () => {
                let [rocketMinipoolManagerAbi, rocketMinipoolQueueAbi] = await rp.contracts.abi(['rocketMinipoolManager', 'rocketMinipoolQueue']);
                assert.isArray(rocketMinipoolManagerAbi, 'Loaded ABI is invalid');
                assert.isArray(rocketMinipoolQueueAbi, 'Loaded ABI is invalid');
            });

        });


        // Contract loading
        describe('Contracts', (): void => {

            it('Can load a single contract', async () => {
                let rocketNetworkBalances = await rp.contracts.get('rocketNetworkBalances');
                assert.property(rocketNetworkBalances, 'methods', 'Loaded contract is invalid');
            });

            it('Can load multiple contracts', async () => {
                let [rocketNetworkFees, rocketNetworkWithdrawal] = await rp.contracts.get(['rocketNetworkFees', 'rocketNetworkWithdrawal']);
                assert.property(rocketNetworkFees, 'methods', 'Loaded contract is invalid');
                assert.property(rocketNetworkWithdrawal, 'methods', 'Loaded contract is invalid');
            });

            it('Can load all versions of a contract', async () => {
                let rocketDepositPool = await rp.contracts.versions('rocketDepositPool');
                assert.property(rocketDepositPool, 'contracts', 'Loaded contract version set is invalid');
                assert.property(rocketDepositPool.current(), 'methods', 'Loaded contract version is invalid');
                assert.property(rocketDepositPool.first(), 'methods', 'Loaded contract version is invalid');
                let depositReceivedEvents = await rocketDepositPool.getPastEvents('DepositReceived', {fromBlock: 0});
                assert.isArray(depositReceivedEvents, 'Invalid contract version set events');
            });

            it('Can create a new contract instance', async () => {
                let minipool = await rp.contracts.make('rocketMinipool', '0x1111111111111111111111111111111111111111');
                assert.property(minipool, 'methods', 'Created contract is invalid');
            });

        });


    });
};
