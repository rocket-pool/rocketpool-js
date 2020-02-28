// Imports
import { assert } from 'chai';
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';
import { clearDeposits } from '../_helpers/deposit';
import { registerGroup, createGroupAccessor } from '../_helpers/group';
import { stakeSingleMinipool } from '../_helpers/minipool';
import { registerNode, createNodeMinipool } from '../_helpers/node';

// Tests
export default function runPoolTests(web3: Web3, rp: RocketPool): void {
    describe('Pools', (): void => {


        // Accounts
        let owner: string;
        let groupOwner: string;
        let depositor: string;

        // Group details
        let groupName: string;
        let groupId: string;

        // Minipool details
        let minipool1Address: string;
        let minipool2Address: string;
        let minipool3Address: string;

        // Deposit details
        let depositId: string;


        // Setup
        before(async () => {

            // Get accounts
            let accounts: string[] = await web3.eth.getAccounts();
            owner = accounts[0];
            groupOwner = accounts[1];
            depositor = accounts[2];

            // Create node contract
            let [nodeOwner, nodeContractAddress] = await registerNode(web3, rp, {owner});
            let nodeContract = await rp.node.getContract(nodeContractAddress);

            // Create group & accessor
            [groupName, groupId] = await registerGroup(rp, {groupOwner});
            let groupAccessorAddress = await createGroupAccessor(rp, {groupId, groupOwner});
            let groupAccessorContract = await rp.group.getAccessorContract(groupAccessorAddress);

            // Create minipools
            minipool1Address = await createNodeMinipool({nodeContract, nodeOwner, stakingDurationId: '3m'});
            minipool2Address = await createNodeMinipool({nodeContract, nodeOwner, stakingDurationId: '6m'});
            minipool3Address = await createNodeMinipool({nodeContract, nodeOwner, stakingDurationId: '12m'});

            // Stake minipool
            await stakeSingleMinipool(rp, {minipoolAddress: minipool1Address, nodeContract, nodeOwner, depositorContract: groupAccessorContract, depositor, stakingDurationId: '3m'});

            // Get ID of last deposit made to stake minipool
            let depositCount = await rp.deposit.getDepositCount(groupId, depositor, '3m');
            depositId = await rp.deposit.getDepositAt(groupId, depositor, '3m', depositCount - 1);

            // Clear deposit queue
            await clearDeposits(rp, {depositorContract: groupAccessorContract, groupId, userId: depositor, stakingDurationId: '3m'});

        });


        // Pool details
        describe('Pool Details', (): void => {

            it('Can get Rocket Pool details', async () => {
                let details = await Promise.all([
                    rp.pool.getPoolExists(minipool1Address),
                    rp.pool.getPoolCount(),
                    rp.pool.getPoolAt(0),
                    rp.pool.getTotalEthAssigned('3m'),
                    rp.pool.getTotalEthCapacity('3m'),
                    rp.pool.getNetworkUtilisation('3m'),
                ]);
            });

            it('Can get minipool details', async () => {
                let minipool = await rp.pool.getMinipoolContract(minipool1Address);
                let nodeDetails = await minipool.getNodeDetails();
                let statusDetails = await minipool.getStatusDetails();
                let stakingBalanceStart = await minipool.getStakingBalanceStart();
                let stakingBalanceEnd = await minipool.getStakingBalanceEnd();
                let depositCount = await minipool.getDepositCount();
                let depositDetails = await minipool.getDepositDetails(depositId);
            });

        });


    });
};
