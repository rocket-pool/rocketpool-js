// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import GroupContract from '../../rocketpool/group/group-contract';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';
import { registerGroup } from './group-scenarios-registration';
import { createAccessor, addDepositor, removeDepositor, addWithdrawer, removeWithdrawer } from './group-scenarios-accessors';
import { deposit, refundQueuedDeposit } from './group-scenarios-accessor-deposits';
import { setRocketPoolFee, setGroupFee, setGroupFeeAddress } from './group-scenarios-fees';

// Tests
export default function runGroupTests(web3: Web3, rp: RocketPool): void {
    describe('Group', (): void => {


        // Accounts
        let owner: string;
        let groupOwner: string;
        let depositor: string;

        // Group details
        let groupName: string;
        let groupId: string;
        let groupContract: GroupContract;

        // Accessor details
        let accessor1Address: string;
        let accessor2Address: string;
        let groupAccessorContract: GroupAccessorContract;

        // Deposit details
        let depositId: string;


        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            owner = accounts[0];
            groupOwner = accounts[1];
            depositor = accounts[2];

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

            it('Can refund a queued deposit', async () => {
                await refundQueuedDeposit(groupAccessorContract, {durationId: '3m', depositId, from: depositor});
            });

            // :TODO: implement
            it('Can refund a deposit from a stalled minipool');

            // :TODO: implement
            it('Can withdraw a deposit from a staking minipool');

            // :TODO: implement
            it('Can withdraw a deposit from a withdrawn minipool');

        });


        // Group fees
        describe('Fees', (): void => {

            it('Can set the Rocket Pool fee', async () => {
                await setRocketPoolFee(rp, {groupId, feeFraction: 0.05, from: owner});
            });

            it('Can set the group fee', async () => {
                await setGroupFee(groupContract, {feeFraction: 0.5, from: groupOwner});
            });

            it('Can set the group fee address', async () => {
                await setGroupFeeAddress(groupContract, {feeAddress: '0x1111111111111111111111111111111111111111', from: groupOwner});
            });

        });


    });
};
