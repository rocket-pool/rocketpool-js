// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import NodeContract from '../../rocketpool/node/node-contract';
import { makeDepositInput } from '../../utils/casper';
import { registerNode } from './node-scenarios-registration';
import { setNodeTimezone, setNodeRewardsAddress } from './node-scenarios-settings';
import { reserveNodeDeposit, cancelNodeDepositReservation, completeNodeDeposit } from './node-scenarios-deposits';
import { withdrawNodeMinipoolDeposit, withdrawNodeEth, withdrawNodeRpl } from './node-scenarios-withdrawals';

// Tests
export default function runNodeTests(web3: Web3, rp: RocketPool): void {
    describe('Node', (): void => {


        // Accounts
        let owner: string;

        // Node details
        let nodeOwnerAddress: string;
        let nodeContractAddress: string;
        let nodeContract: NodeContract;

        // Minipool details
        let minipoolAddress: string;


        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            owner = accounts[0];

        });


        // Node registration
        describe('Registration', (): void => {

            it('Can register a node', async () => {
                [nodeOwnerAddress, nodeContractAddress] = await registerNode(web3, rp, {timezone: 'foo/bar', owner});
                nodeContract = await rp.node.getContract(nodeContractAddress);
            });

        });


        // Node settings
        describe('Settings', (): void => {

            it('Can set the node\'s timezone location', async () => {
                await setNodeTimezone(rp, {timezone: 'bar/baz', from: nodeOwnerAddress});
            });

            it('Can set the node\'s rewards address', async () => {
                await setNodeRewardsAddress(nodeContract, {rewardsAddress: '0x1111111111111111111111111111111111111111', from: nodeOwnerAddress});
            });

        });


        // Node deposits
        describe('Deposits', (): void => {

            it('Can make a deposit reservation', async () => {
                await reserveNodeDeposit(nodeContract, {durationId: '3m', depositInput: makeDepositInput(web3), from: nodeOwnerAddress});
            });

            it('Can cancel a deposit reservation', async () => {
                await cancelNodeDepositReservation(nodeContract, {from: nodeOwnerAddress});
            });

            it('Can complete a deposit', async () => {
                await reserveNodeDeposit(nodeContract, {durationId: '3m', depositInput: makeDepositInput(web3), from: nodeOwnerAddress});
                minipoolAddress = await completeNodeDeposit(nodeContract, {from: nodeOwnerAddress, value: web3.utils.toWei('16', 'ether')});
            });

        });


        // Node withdrawals
        describe('Withdrawals', (): void => {

            it('Can withdraw a minipool deposit', async () => {
                await withdrawNodeMinipoolDeposit(web3, nodeContract, {minipoolAddress, from: nodeOwnerAddress});
            });

            it('Can withdraw ETH from the node contract', async () => {
                await withdrawNodeEth(nodeContract, {weiAmount: web3.utils.toWei('1', 'ether'), from: nodeOwnerAddress});
            });

            it('Can withdraw RPL from the node contract', async () => {
                await withdrawNodeRpl(nodeContract, {weiAmount: web3.utils.toWei('1', 'ether'), from: nodeOwnerAddress});
            });

        });


        // RPL ratio
        describe('RPL', (): void => {

            it('Can get the current RPL ratio', async () => {
                let rplRatio = await rp.node.getRPLRatio('3m');
                assert.isAtLeast(rplRatio, 0, 'Invalid RPL ratio');
                assert.isBelow(rplRatio, 3, 'Invalid RPL ratio');
            });

            it('Can get the current RPL requirement for an amount', async () => {
                let [rplRequired, rplRatio] = await rp.node.getRPLRequired(web3.utils.toWei('1', 'ether'), '3m');
                assert.closeTo(parseFloat(web3.utils.fromWei(rplRequired, 'ether')), rplRatio, parseFloat(web3.utils.fromWei('100', 'ether')), 'Invalid required RPL amount');
            });

        });


    });
};
