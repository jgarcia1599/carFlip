

import Escrow from './../../artifacts/contracts/Escrow.sol/Escrow.json';
import {ethers} from 'ethers';
export async function getContractInfoOnChain(contractAddress) {
    if(!window._provider) return;
    let contract = new ethers.Contract(contractAddress, Escrow.abi, window._provider);
    console.log("contracttt", contract);
    console.log("arbitreeer",await contract.arbiter())
    console.log("depositor", await contract.depositor())
    console.log("contract balance", await window._provider.getBalance(contract.address));
    return contract
}

