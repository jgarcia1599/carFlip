import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import model from "../model";
import { postContract, getContracts , contractIsApproved} from "../utils/api";
import deployEscrowContract from "../utils/deployEscrowContract";
import "./Contracts.scss";
function Contracts() {
  let [newArbitrer, setNewArbitrer] = useState("");
  let [newBeneficiary, setNewBeneficiary] = useState("");
  let [newContractAmount, setNewContractAmount] = useState("");
  let [contractDeployError, setContractDeployError] = useState(false);

  useEffect(() => {
    getContracts();
  }, []);

  function deployNewContract(){
    if(!newArbitrer || !newContractAmount || !newBeneficiary) return
    deployEscrowContract(
      newArbitrer,
      newBeneficiary,
      newContractAmount
    )
    .then(async (contract) => {
      setContractDeployError(false);
      await contract.deployTransaction.wait();
      postContract(contract.address, model.userAddress);
      //now i will save the contract address to the centralized api
    })
    .catch((err) => {
      setContractDeployError(true)
      console.log("error deploying contract", err)
    });
    setNewArbitrer("");
    setNewBeneficiary("");
    setNewContractAmount("");
  }

  function renderDeployedContract(){
    if(!(model.contracts && model.contracts.length > 0)) return;
    return model.contracts.map((contractData) => {
      let contractInfo = model.contractInfo[contractData.contractAddress];
      if(!contractInfo) return;
      return <div
          key={contractData.contractAddress}
          className="existing-contract"
        >
          <ul className="fields">
            <li>
              <div> Arbiter </div>
              <div> {contractInfo.contractArbiter} </div>
            </li>
            <li>
              <div> Beneficiary </div>
              <div> {contractInfo.contractBeneficiary} </div>
            </li>
            <li>
              <div> Depositor </div>
              <div> {contractInfo.contractDepositor} </div>
            </li>
            <li>
              <div> Value </div>
              <div> {contractInfo.contractBalance} ETH</div>
            </li>
            <div className={contractData.isApproved ? "complete" : "button"} id={contractData.contractAddress} onClick={async ()=>{
              if(contractData.isApproved) return;
              const contract = contractInfo.contractObject
                const signer = window._provider.getSigner();
               contract.connect(signer).approve().then(()=>{
                contractIsApproved(contractData.contractAddress)
               }).catch((err)=>{
                setContractDeployError(true)
                console.log("error deploying contract", err)

               })
            }}>
              {contractData.isApproved ? "This contract has been approved!" : "Approve"}
            </div>
          </ul>
        </div>
      
    })
  }

  return (
    <div className="row">
      <div className="col-6">
        <div className="contract">
          <h3> New Contract </h3>
          <label>
            Arbiter Address
            <input type="text" id="arbiter" value={newArbitrer}onChange={(e)=>setNewArbitrer(e.target.value)}/>
          </label>

          <label>
            Beneficiary Address
            <input type="text" id="beneficiary" value={newBeneficiary} onChange={(e)=>setNewBeneficiary(e.target.value)} />
          </label>

          <label>
            Deposit Amount (in ETH)
            <input type="text" id="wei"  value={newContractAmount} onChange={(e)=>setNewContractAmount(e.target.value)}/>
          </label>

          <div className="button" id="deploy" onClick={()=>deployNewContract()}>
            Deploy
          </div>
          {contractDeployError && <div class="alert alert-danger" role="alert">
            
            Error interacting with the contract! Make sure you filled out the form correctly!

            </div>}
        </div>
      </div>
      <div className="col-6">
        {renderDeployedContract()}
      </div>
    </div>
  );
}

export default observer(Contracts);
