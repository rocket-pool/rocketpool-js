// Imports
import Web3 from 'web3';
import RocketPool from '../../rocketpool/rocketpool';


// Seed RETH contract with ETH
export async function seedRethContract(web3: Web3, rp: RocketPool, {from, value}: {from: string, value: string}) {
    const rocketETHToken = await rp.contracts.get('rocketETHToken');
    await web3.eth.sendTransaction({from, to: rocketETHToken.options.address, value});
}

