import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {ethers} from 'ethers';
import model from "../model";
import {
  postContract,
  getContracts,
  contractIsApproved,
  uploadFile,
} from "../utils/api";
import deployEscrowContract from "../utils/deployEscrowContract";
import DeployedContractsList from "./DeployedContractslist";
import "./Contracts.scss";
function Contracts() {
  let [escrowAgent, setNewEscrowAgent] = useState("");
  let [newCarBuyer, setNewCarBuyer] = useState("");
  let [newCommision, setNewCommision] = useState(1);
  let [newContractAmount, setNewContractAmount] = useState("");
  let [newCarVIN, setNewCarVin] = useState("");
  let [contractDeployError, setContractDeployError] = useState(false);

  useEffect(() => {
    getContracts();
  }, []);

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  function deployNewContract() {
    console.log     ("agent "+ escrowAgent,
      "buyer "+newCarBuyer,
      "commision "+newCommision, 
      "car price" + newContractAmount,
      "car vin" + newCarVIN)
    if (!escrowAgent || !newContractAmount || !newCarBuyer || !newCommision || !newCarVIN) return;

    deployEscrowContract(
      escrowAgent,
      newCarBuyer,
      newCommision, 
      newContractAmount,
      newCarVIN
    )
      .then(async (contract) => {
        setContractDeployError(false);
        await contract.deployTransaction.wait();
        postContract(contract.address, model.userAddress);
        //now i will save the contract address to the centralized api
      })
      .catch((err) => {
        setContractDeployError(true);
        console.log("error deploying contract", err);
      });
    setNewEscrowAgent("");
    setNewCarBuyer("");
    setNewContractAmount("");
    setNewCommision(1);
    setNewCarVin("");
  }

  return (
    <div className="row">
      <div className="col-6">
        <div cl>
          <h3> New Car Transfer Contract </h3>
          <label>
            Car's Vehicle Identification Number
            <input
              type="text"
              id="carVIN"
              value={newCarVIN}
              onChange={(e) => setNewCarVin(e.target.value)}
            />
          </label>
          <label>
            Escrow Agent Address
            <input
              type="text"
              id="escrow"
              value={escrowAgent}
              onChange={(e) => setNewEscrowAgent(e.target.value)}
            />
          </label>

          <label>
            Car Buyer Address
            <input
              type="text"
              id="carBuyer"
              value={newCarBuyer}
              onChange={(e) => setNewCarBuyer(e.target.value)}
            />
          </label>
          <label>
            Escrow Agent Commision
            <input
              type="number"
              id="escrowCommision"
              value={newCommision}
              onChange={(e) => setNewCommision(e.target.value)}
            />
          </label>

          <label>
            Car Selling Price (in ETH)
            <input
              type="text"
              id="eth"
              value={newContractAmount}
              onChange={(e) => setNewContractAmount(e.target.value)}
            />
          </label>

          <div
            className="button"
            id="deploy"
            onClick={() => deployNewContract()}
          >
            Deploy
          </div>
          {contractDeployError && (
            <div class="alert alert-danger" role="alert">
              Error deploying the contract! Make sure you filled out the
              form correctly!
            </div>
          )}
        </div>
      </div>
      <div className="col-6"><DeployedContractsList/></div>
    </div>
  );
}

export default observer(Contracts);
