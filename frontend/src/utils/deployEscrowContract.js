import Escrow from "./../artifacts/contracts/Escrow.sol/Escrow.json";
// the abi and the bytecode need to be accessible within the react project's folder hierarchy

import { ethers, BigNumber } from "ethers";

export default async function deployEscrowContract(
  escrowAgent,
  carBuyer,
  commision, 
  carPrice,
  carVIN
) {
  console.log(
    "ijsfconwowevmd"
  )
  if (!window._provider) return;
  // transform value from eth to wei
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const signer = window._provider.getSigner();
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );
  //{ value:ethers.utils.parseEther(value)}
  return factory.deploy(escrowAgent, carBuyer,commision, carPrice, carVIN );
}