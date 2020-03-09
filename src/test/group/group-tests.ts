// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import GroupContract from '../../rocketpool/group/group-contract';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';
import NodeContract from '../../rocketpool/node/node-contract';
import { clearDeposits } from '../_helpers/deposit';
import { stallMinipool, stakeSingleMinipool, withdrawMinipool } from '../_helpers/minipool';
import { registerNode, createNodeMinipool } from '../_helpers/node';
import { registerGroup } from './group-scenarios-registration';
import { createAccessor, addDepositor, removeDepositor, addWithdrawer, removeWithdrawer } from './group-scenarios-accessors';
import { deposit, refundQueuedDeposit, refundStalledMinipoolDeposit, withdrawStakingMinipoolDeposit, withdrawMinipoolDeposit, setDepositBackupAddress } from './group-scenarios-accessor-deposits';
import { setGroupFee, setGroupFeeAddress } from './group-scenarios-fees';

// Tests
export default function runGroupTests(web3: Web3, rp: RocketPool): void {
    describe('Group', (): void => {


        // Accounts
        let owner: string;
        let groupOwner: string;
        let depositor: string;
        let depositorBackup: string;

        // Group details
        let groupName: string;
        let groupId: string;
        let groupContract: GroupContract;

        // Accessor details
        let accessor1Address: string;
        let accessor2Address: string;
        let groupAccessorContract: GroupAccessorContract;

        // Node details
        let nodeOwner: string;
        let nodeContract: NodeContract;

        // Deposit details
        let depositId: string;


        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            owner = accounts[0];
            groupOwner = accounts[1];
            depositor = accounts[2];
            depositorBackup = accounts[3];

            // Create node contract
            let [nodeOwnerAddress, nodeContractAddress] = await registerNode(web3, rp, {owner});
            nodeOwner = nodeOwnerAddress;
            nodeContract = await rp.node.getContract(nodeContractAddress);

        });


        // Group registration
        describe('Registration', (): void => {

            it('Can register a group', async () => {
                [groupName, groupId] = await registerGroup(rp, {stakingFeeFraction: 0.05, from: groupOwner});
                groupContract = await rp.group.getContract(groupId);
            });

        });


        // Accessor creation & registration
        describe('Accessors', (): void => {

            it('Can create a default accessor', async () => {
                accessor1Address = await createAccessor(rp, {groupId, from: groupOwner});
                accessor2Address = await createAccessor(rp, {groupId, from: groupOwner});
                groupAccessorContract = await rp.group.getAccessorContract(accessor1Address);
            });

            it('Can add a depositor', async () => {
                await addDepositor(groupContract, {depositorAddress: accessor1Address, from: groupOwner});
                await addDepositor(groupContract, {depositorAddress: accessor2Address, from: groupOwner});
            });

            it('Can remove a depositor', async () => {
                await removeDepositor(groupContract, {depositorAddress: accessor2Address, from: groupOwner});
            });

            it('Can add a withdrawer', async () => {
                await addWithdrawer(groupContract, {withdrawerAddress: accessor1Address, from: groupOwner});
                await addWithdrawer(groupContract, {withdrawerAddress: accessor2Address, from: groupOwner});
            });

            it('Can remove a withdrawer', async () => {
                await removeWithdrawer(groupContract, {withdrawerAddress: accessor2Address, from: groupOwner});
            });

        });


        // Accessor deposits
        describe('Accessor Deposits', (): void => {

            it('Can deposit through the group depositor', async () => {
                depositId = await deposit(rp, groupAccessorContract, {groupId, durationId: '3m', from: depositor, value: web3.utils.toWei('32', 'ether')});
            });

            it('Can set a backup withdrawal address for a deposit', async () => {
                await setDepositBackupAddress(rp, groupAccessorContract, {depositId, backupAddress: depositorBackup, from: depositor});
            });

            it('Can refund a queued deposit', async () => {
                await refundQueuedDeposit(web3, groupAccessorContract, {durationId: '3m', depositId, from: depositor});
            });

            it('Can refund a deposit from a stalled minipool', async () => {

                // Create minipool, deposit to, and stall
                let minipoolAddress = await createNodeMinipool({nodeContract, nodeOwner, stakingDurationId: '3m'});
                depositId = await deposit(rp, groupAccessorContract, {groupId, durationId: '3m', from: depositor, value: web3.utils.toWei('4', 'ether')});
                await stallMinipool(web3, rp, {minipoolAddress, fromAddress: nodeOwner});

                // Refund deposit
                await refundStalledMinipoolDeposit(web3, groupAccessorContract, {depositId, minipoolAddress, from: depositor});

            });

            it('Can withdraw a deposit from a staking minipool', async () => {

                // Enable staking withdrawals (disabled by default in Rocket Pool)
                const rocketDepositSettings = await rp.contracts.get('rocketDepositSettings');
                await rocketDepositSettings.methods.setStakingWithdrawalAllowed(true).send({from: owner, gas: 8000000});

                // Create minipool, deposit to, and stake
                let minipoolAddress = await createNodeMinipool({nodeContract, nodeOwner, stakingDurationId: '3m'});
                depositId = await deposit(rp, groupAccessorContract, {groupId, durationId: '3m', from: depositor, value: web3.utils.toWei('4', 'ether')});
                await stakeSingleMinipool(rp, {minipoolAddress, nodeContract, nodeOwner, depositorContract: groupAccessorContract, depositor, stakingDurationId: '3m'});

                // Withdraw deposit
                await withdrawStakingMinipoolDeposit(rp, groupAccessorContract, {depositId, minipoolAddress, weiAmount: web3.utils.toWei('4', 'ether'), from: depositor});

                // Clear deposit queue
                await clearDeposits(rp, {depositorContract: groupAccessorContract, groupId, userId: depositor, stakingDurationId: '3m'});

            });

            it('Can withdraw a deposit from a withdrawn minipool', async () => {

                // Create minipool, deposit to, and stake, logout & withdraw
                let minipoolAddress = await createNodeMinipool({nodeContract, nodeOwner, stakingDurationId: '3m'});
                depositId = await deposit(rp, groupAccessorContract, {groupId, durationId: '3m', from: depositor, value: web3.utils.toWei('4', 'ether')});
                await stakeSingleMinipool(rp, {minipoolAddress, nodeContract, nodeOwner, depositorContract: groupAccessorContract, depositor, stakingDurationId: '3m'});
                await withdrawMinipool(rp, {minipoolAddress, balance: web3.utils.toWei('36', 'ether'), nodeOperator: nodeOwner, owner});

                // Withdraw deposit
                await withdrawMinipoolDeposit(rp, groupAccessorContract, {depositId, minipoolAddress, from: depositor});

                // Clear deposit queue
                await clearDeposits(rp, {depositorContract: groupAccessorContract, groupId, userId: depositor, stakingDurationId: '3m'});

            });

            it('Can get a user\'s deposits', async () => {
                let deposits = await rp.deposit.getDeposits(groupId, depositor, '3m');
            });

        });


        // Group fees
        describe('Fees', (): void => {

            it('Can set the group fee', async () => {
                await setGroupFee(groupContract, {feeFraction: 0.5, from: groupOwner});
            });

            it('Can set the group fee address', async () => {
                await setGroupFeeAddress(groupContract, {feeAddress: '0x1111111111111111111111111111111111111111', from: groupOwner});
            });

        });


    });
};
