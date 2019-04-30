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
                let [rocketGroupContractAbi, rocketNodeContractAbi] = await rp.contracts.abi(['rocketGroupContract', 'rocketNodeContract']);
                assert.isArray(rocketGroupContractAbi, 'Loaded ABI is invalid');
                assert.isArray(rocketNodeContractAbi, 'Loaded ABI is invalid');
            });

        });


        // Contract loading
        describe('Contracts', (): void => {

            it('Can load a single contract', async () => {
                let rocketPool = await rp.contracts.get('rocketPool');
                assert.property(rocketPool, 'methods', 'Loaded contract is invalid');
            });

            it('Can load multiple contracts', async () => {
                let [rocketNode, rocketUpgrade] = await rp.contracts.get(['rocketNode', 'rocketUpgrade']);
                assert.property(rocketNode, 'methods', 'Loaded contract is invalid');
                assert.property(rocketUpgrade, 'methods', 'Loaded contract is invalid');
            });

            it('Can load all versions of a contract', async () => {
                let rocketDepositAPI = await rp.contracts.versions('rocketDepositAPI');
                assert.property(rocketDepositAPI, 'contracts', 'Loaded contract version set is invalid');
                assert.property(rocketDepositAPI.current(), 'methods', 'Loaded contract version is invalid');
                assert.property(rocketDepositAPI.first(), 'methods', 'Loaded contract version is invalid');
                let depositEvents = await rocketDepositAPI.getPastEvents('Deposit', {fromBlock: 0});
                assert.isArray(depositEvents, 'Invalid contract version set events');
            });

            it('Can create a new contract instance', async () => {
                let minipool = await rp.contracts.make('rocketMinipool', '0x1111111111111111111111111111111111111111');
                assert.property(minipool, 'methods', 'Created contract is invalid');
            });

        });


    });
};
