// Imports
import { SendOptions } from 'web3-eth-contract/types';
import RocketPool from '../../rocketpool/rocketpool';


// Deposit settings
export async function getDepositSetting(rp: RocketPool, setting: string) {
    const rocketDepositSettings = await rp.contracts.get('rocketDepositSettings');
    let value = await rocketDepositSettings.methods['get' + setting]().call();
    return value;
}
export async function setDepositSetting(rp: RocketPool, setting: string, value: any, options: SendOptions) {
    const rocketDepositSettings = await rp.contracts.get('rocketDepositSettings');
    await rocketDepositSettings.methods['set' + setting](value).send(options);
}


// Minipool settings
export async function getMinipoolSetting(rp: RocketPool, setting: string) {
    const rocketMinipoolSettings = await rp.contracts.get('rocketMinipoolSettings');
    let value = await rocketMinipoolSettings.methods['get' + setting]().call();
    return value;
}
export async function setMinipoolSetting(rp: RocketPool, setting: string, value: any, options: SendOptions) {
    const rocketMinipoolSettings = await rp.contracts.get('rocketMinipoolSettings');
    await rocketMinipoolSettings.methods['set' + setting](value).send(options);
}


// Network settings
export async function getNetworkSetting(rp: RocketPool, setting: string) {
    const rocketNetworkSettings = await rp.contracts.get('rocketNetworkSettings');
    let value = await rocketNetworkSettings.methods['get' + setting]().call();
    return value;
}
export async function setNetworkSetting(rp: RocketPool, setting: string, value: any, options: SendOptions) {
    const rocketNetworkSettings = await rp.contracts.get('rocketNetworkSettings');
    await rocketNetworkSettings.methods['set' + setting](value).send(options);
}


// Node settings
export async function getNodeSetting(rp: RocketPool, setting: string) {
    const rocketNodeSettings = await rp.contracts.get('rocketNodeSettings');
    let value = await rocketNodeSettings.methods['get' + setting]().call();
    return value;
}
export async function setNodeSetting(rp: RocketPool, setting: string, value: any, options: SendOptions) {
    const rocketNodeSettings = await rp.contracts.get('rocketNodeSettings');
    await rocketNodeSettings.methods['set' + setting](value).send(options);
}

