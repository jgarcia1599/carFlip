

import Escrow from './../../artifacts/contracts/Escrow.sol/Escrow.json';
import {ethers} from 'ethers';
export async function getContractInfoOnChain(contractAddress) {
    if(!window._provider) return;
    let contract = new ethers.Contract(contractAddress, Escrow.abi, window._provider);
    let contractArbiter = await contract.arbiter();
    let contractDepositor = await contract.depositor();
    let contractBeneficiary = await contract.beneficiary();
    let carVIN = await contract.carVIN();
    let isCarInspected = await contract.isCarOk();
    let contractBalance = ethers.utils.formatEther(await window._provider.getBalance(contract.address) );
    return {
        contractObject:contract,
        contractArbiter: contractArbiter,
        contractDepositor: contractDepositor,
        contractBeneficiary:contractBeneficiary,
        contractBalance: contractBalance,
        carVIN:carVIN,
        isCarInspected:isCarInspected
    }
}

