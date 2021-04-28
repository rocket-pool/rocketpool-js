// Imports
import {SendOptions} from 'web3-eth-contract';
import RocketPool from '../../rocketpool/rocketpool';


// Deposit settings
export async function getDepositSetting(rp: RocketPool, setting: string) {
    const rocketDAOProtocolSettingsDeposit = await rp.contracts.get('rocketDAOProtocolSettingsDeposit');
    let value = await rocketDAOProtocolSettingsDeposit.methods['get' + setting]().call();
    return value;
}
export async function setDepositSetting(rp: RocketPool, setting: string, value: any, options: SendOptions) {
    const rocketDAOProtocolSettingsDeposit = await rp.contracts.get('rocketDAOProtocolSettingsDeposit');
    await rocketDAOProtocolSettingsDeposit.methods['set' + setting](value).send(options);
}


// Minipool settings
export async function getMinipoolSetting(rp: RocketPool, setting: string) {
    const rocketDAOProtocolSettingsMinipool = await rp.contracts.get('rocketDAOProtocolSettingsMinipool');
    let value = await rocketDAOProtocolSettingsMinipool.methods['get' + setting]().call();
    return value;
}
export async function setMinipoolSetting(rp: RocketPool, setting: string, value: any, options: SendOptions) {
    const rocketDAOProtocolSettingsMinipool = await rp.contracts.get('rocketDAOProtocolSettingsMinipool');
    await rocketDAOProtocolSettingsMinipool.methods['set' + setting](value).send(options);
}


// Network settings
export async function getNetworkSetting(rp: RocketPool, setting: string) {
    const rocketDAOProtocolSettingsNetwork = await rp.contracts.get('rocketDAOProtocolSettingsNetwork');
    let value = await rocketDAOProtocolSettingsNetwork.methods['get' + setting]().call();
    return value;
}
export async function setNetworkSetting(rp: RocketPool, setting: string, value: any, options: SendOptions) {
    const rocketDAOProtocolSettingsNetwork = await rp.contracts.get('rocketDAOProtocolSettingsNetwork');
    await rocketDAOProtocolSettingsNetwork.methods['set' + setting](value).send(options);
}


// Node settings
export async function getNodeSetting(rp: RocketPool, setting: string) {
    const rocketDAOProtocolSettingsNode = await rp.contracts.get('rocketDAOProtocolSettingsNode');
    let value = await rocketDAOProtocolSettingsNode.methods['get' + setting]().call();
    return value;
}
export async function setNodeSetting(rp: RocketPool, setting: string, value: any, options: SendOptions) {
    const rocketDAOProtocolSettingsNode = await rp.contracts.get('rocketDAOProtocolSettingsNode');
    await rocketDAOProtocolSettingsNode.methods['set' + setting](value).send(options);
}

