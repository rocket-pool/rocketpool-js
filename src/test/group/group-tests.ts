// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import GroupContract from '../../rocketpool/group/group-contract';
import GroupAccessorContract from '../../rocketpool/group/group-accessor-contract';
import { registerGroup } from './group-scenarios';
import { createAccessor, addDepositor, removeDepositor, addWithdrawer, removeWithdrawer } from './group-scenarios';
import { setRocketPoolFee, setGroupFee, setGroupFeeAddress } from './group-scenarios';

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
        let accessor1Address: string;
        let accessor2Address: string;
        let groupAccessorContract: GroupAccessorContract;


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
