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

            it('Can load single contracts', async () => {
                let [rocketNode, rocketUpgrade] = await rp.contracts.get(['rocketNode', 'rocketUpgrade']);
                assert.property(rocketNode, 'methods', 'Loaded contract is invalid');
                assert.property(rocketUpgrade, 'methods', 'Loaded contract is invalid');
            });

            it('Can create a new contract instance', async () => {
                let minipool = await rp.contracts.make('rocketMinipool', '0x1111111111111111111111111111111111111111');
                assert.property(minipool, 'methods', 'Created contract is invalid');
            });

        });


    });
};
