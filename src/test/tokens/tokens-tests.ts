// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';
import NodeContract from '../../rocketpool/node/node-contract';
import { deposit, withdrawStakingMinipoolDeposit, clearDeposits } from '../_helpers/deposit';
import { registerGroup, createGroupAccessor } from '../_helpers/group';
import { stakeSingleMinipool } from '../_helpers/minipool';
import { registerNode, createNodeMinipool } from '../_helpers/node';
import { seedRethContract } from '../_helpers/tokens';
import { transferRpl, approveRplTransfer, transferRplFrom } from './tokens-scenarios-rpl';
import { burnRethForEth } from './tokens-scenarios-reth';

// Tests
export default function runTokensTests(web3: Web3, rp: RocketPool): void {
    describe('Tokens', (): void => {


        // Accounts
        let owner: string;
        let groupOwner: string;
        let user1: string;
        let user2: string;
        let user3: string;

        // Group details
        let groupName: string;
        let groupId: string;
        let groupAccessorContract: GroupAccessorContract;

        // Node details
        let nodeOwner: string;
        let nodeContract: NodeContract;


        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            owner = accounts[0];
            groupOwner = accounts[1];
            user1 = accounts[2];
            user2 = accounts[3];
            user3 = accounts[4];

            // Mint tokens
            let rocketPoolToken = await rp.contracts.get('rocketPoolToken');
            await rocketPoolToken.methods.mint(user1, web3.utils.toWei('2', 'ether')).send({from: owner, gas: 8000000});

            // Create group & accessor
            [groupName, groupId] = await registerGroup(rp, {groupOwner});
            let groupAccessorAddress = await createGroupAccessor(rp, {groupId, groupOwner});
            groupAccessorContract = await rp.group.getAccessorContract(groupAccessorAddress);

            // Create node contract
            let [nodeOwnerAddress, nodeContractAddress] = await registerNode(web3, rp, {owner});
            nodeOwner = nodeOwnerAddress;
            nodeContract = await rp.node.getContract(nodeContractAddress);

        });


        // RPL token
        describe('RPL', (): void => {

            it('Can transfer tokens to a recipient', async () => {
                await transferRpl(rp, {from: user1, to: user3, amountWei: web3.utils.toWei('1', 'ether')});
            });

            it('Can approve an allowance for a spender', async () => {
                await approveRplTransfer(rp, {from: user1, spender: user2, amountWei: web3.utils.toWei('1', 'ether')});
            });

            it('Can transfer tokens from an account to a recipient', async () => {
                await transferRplFrom(rp, {from: user2, fromAccount: user1, to: user3, amountWei: web3.utils.toWei('1', 'ether')});
            });

        });


        // RETH token
        describe('RETH', (): void => {

            it('Can burn RETH for ETH', async () => {

                // Create minipool, deposit to, and stake
                let minipoolAddress = await createNodeMinipool(web3, {nodeContract, nodeOwner, stakingDurationId: '3m'});
                let depositId = await deposit(rp, {depositorContract: groupAccessorContract, groupId, stakingDurationId: '3m', from: user1, value: web3.utils.toWei('4', 'ether')});
                await stakeSingleMinipool(rp, {depositorContract: groupAccessorContract, depositor: user1, stakingDurationId: '3m'});

                // Withdraw deposit and clear deposit queue
                await withdrawStakingMinipoolDeposit({withdrawerContract: groupAccessorContract, depositId, minipoolAddress, weiAmount: web3.utils.toWei('4', 'ether'), from: user1});
                await clearDeposits(rp, {depositorContract: groupAccessorContract, groupId, userId: user1, stakingDurationId: '3m'});

                // Burn RETH for ETH
                let rethBalance = await rp.tokens.reth.balanceOf(user1);
                await seedRethContract(web3, rp, {from: owner, value: rethBalance});
                await burnRethForEth(web3, rp, {from: user1, amountWei: rethBalance});

            });

        });


    });
};
