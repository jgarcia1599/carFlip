

import Escrow from './../../artifacts/contracts/Escrow.sol/Escrow.json';
import {ethers} from 'ethers';
export async function getContractInfoOnChain(contractAddress) {
    if(!window._provider) return;
    let contract = new ethers.Contract(contractAddress, Escrow.abi, window._provider);
    let escrowAgent = await contract.escrowAgent();
    let escrowAgentCommission = await contract.escrowAgentCommission();
    let carBuyer = await contract.carBuyer();
    let carSeller = await contract.carSeller();
    let carPrice = await contract.carPrice();
    let carVIN = await contract.carVIN();
    let isCarInspected = await contract.isCarOk();
    let contractBalance = ethers.utils.formatEther(await window._provider.getBalance(contract.address) );
    return {
        contractObject:contract,
        escrowAgent:escrowAgent,
        escrowAgentCommission:escrowAgentCommission,
        carBuyer:carBuyer,
        carSeller:carSeller,
        carPrice:carPrice,
        carVIN:carVIN,
        isCarInspected:isCarInspected,
        contractBalance:contractBalance
    }
}

