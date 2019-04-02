// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';


// Seed RPB contract with ETH
export async function seedRpbContract(web3: Web3, rp: RocketPool, {from, value}: {from: string, value: string}) {
    const rocketBETHToken = await rp.contracts.get('rocketBETHToken');
    await web3.eth.sendTransaction({from, to: rocketBETHToken.options.address, value});
}

