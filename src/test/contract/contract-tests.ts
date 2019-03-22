// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';

// Tests
export default function runContractTests(web3: Web3, rp: RocketPool): void {
    describe('Contracts', (): void => {


        // ABI loading
        describe('ABIs', (): void => {

            it('Can load a single ABI', async () => {
                let minipoolAbi = await rp.contracts.abi('rocketMinipool');
                assert.isArray(minipoolAbi, 'ABI is not an array');
            });

            it('Can load multiple ABIs', async () => {
                let [minipoolAbi, rocketGroupContractAbi] = await rp.contracts.abi(['rocketMinipool', 'rocketGroupContract']);
                assert.isArray(minipoolAbi, 'ABI is not an array');
                assert.isArray(rocketGroupContractAbi, 'ABI is not an array');
            });

        });


    });
};
