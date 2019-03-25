// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import NodeContract from '../../rocketpool/node/node-contract';
import { registerNode, setNodeTimezone } from './node-scenarios';

// Tests
export default function runNodeTests(web3: Web3, rp: RocketPool): void {
    describe('Node', (): void => {


        // Accounts
        let owner: string;


        // Node details
        let nodeOwnerAddress: string;
        let nodeContractAddress: string;
        let nodeContract: NodeContract;


        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            owner = accounts[0];

        });


        // Node registration
        describe('Registration', (): void => {

            it('Can register a node', async () => {
                [nodeOwnerAddress, nodeContractAddress] = await registerNode(web3, rp, 'foo/bar', {owner});
                nodeContract = await rp.node.getContract(nodeContractAddress);
            });

            it('Can set the timezone location', async () => {
                await setNodeTimezone(rp, 'bar/baz', {from: nodeOwnerAddress});
            });

        });


        // RPL ratio
        describe('RPL', (): void => {

            it('Can get the current RPL ratio', async () => {
                // :TODO: check values after node deposits made
                let rplRatio = await rp.node.getRPLRatio('3m');
            });

            it('Can get the current RPL requirement for an amount', async () => {
                // :TODO: check values after node deposits made
                let [rplRequired, rplRatio] = await rp.node.getRPLRequired(web3.utils.toWei('1', 'ether'), '3m');
            });

        });


    });
};
