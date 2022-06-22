
import Escrow from './../artifacts/contracts/Escrow.sol/Escrow.json';
// the abi and the bytecode need to be accessible within the react project's folder hierarchy

import {ethers} from 'ethers';
console.log("Escrow", Escrow)

export default async function deployEscrowContract(arbiter, beneficiary, value) {
    if(!window._provider) return;
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const signer = window._provider.getSigner();
    const factory = new ethers.ContractFactory(Escrow.abi, Escrow.bytecode, signer);
    return factory.deploy(arbiter, beneficiary, { value });
}