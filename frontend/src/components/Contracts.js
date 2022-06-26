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

  function renderDeployedContract() {
    if (!(model.contracts && model.contracts.length > 0)) return;
    return (
      <div className="contractsContainer">
        {model.contracts.map((contractData) => {
          let contractInfo = model.contractInfo[contractData.contractAddress];
          if (!contractInfo) return;
          console.log("contract info", window.toJS(contractInfo))
          return (
            <div
              key={contractData.contractAddress}
              className="existing-contract"
            >
              <ul className="fields">
              {model.userAddress ===
                  contractInfo.escrowAgent.toLowerCase() && contractData.isApproved === false &&(
                    <div class={"alert alert-" + (contractInfo.isCarInspected === true ? "success" : "warning")} role="alert">
                      I am the Escrow of this contract. {contractInfo.isCarInspected === true? "This contract is ready to be approved as the car has been inspected by the new prospective owner." : "This contract must first be inspected by the car buyer before I can approve it"}
                    </div>
                  )}
                <li>
                  <div> Car VIN </div>
                  <div> {contractInfo.carVIN} </div>
                </li>
                <li>
                  <div> Escrow Agent </div>
                  <div> {contractInfo.escrowAgent} </div>
                </li>
                <li>
                  <div> Car Seller </div>
                  <div> {contractInfo.carSeller} </div>
                </li>
                <li>
                  <div> Car Buyer </div>
                  <div> {contractInfo.carBuyer} </div>
                </li>
                <li>
                  <div> Car Price </div>
                  <div> {contractInfo.carPrice.toNumber()} ETH</div>
                </li>
                <li>
                  <div> Commision </div>
                  <div> {contractInfo.escrowAgentCommission.toNumber()} %</div>
                </li>
                <li>
                  <div> Is Car Inspected ✔️?  </div>
                  <div> {contractInfo.isCarInspected === true ? "Yes 😊" : "No❌"} </div>
                </li>

                { contractData.filePath &&
                <li>
                  <div> Car Shop Inspection Document </div>
                  <div> {contractData.filePath} </div>
                </li>
        }
                {model.userAddress ===
                  contractInfo.carBuyer.toLowerCase() &&
                  (!contractData.filePath || contractInfo.isCarInspected === false) && (
                    <div class="alert alert-primary" role="alert">
                      <p>
                        As the prospective new owner of Car:{" "}
                        {contractInfo.carVIN}, I need to due diligence on the
                        conditions of the car for this transaction to be
                        approved by an escrow. Please upload a document issued
                        by an authorized car shop ensuring that the car is in
                        desirable conditions.
                      </p>
                      <input type="file" onChange={saveFile} />
                      <button
                        onClick={() => {
                          if (!file || !fileName) return;
                          uploadFile(
                            file,
                            fileName,
                            contractData.contractAddress
                          ).then(() => {
                            const contract = contractInfo.contractObject;
                            const signer = window._provider.getSigner();
                            contract
                              .connect(signer)
                              .carIsOkay( { value:ethers.utils.parseEther(`${contractInfo.carPrice.toNumber()}`)})
                              .then(() => {
                                setFile("");
                                setFileName("");
                                getContracts()
                              })
                              .catch((err) => {
                                setContractDeployError(true);
                                console.log("error deploying contract", err);
                              });
                          });
                        }}
                      >
                        Upload
                      </button>
                    </div>
                  )}

                <div
                  className={contractData.isApproved ? "complete" : "button"}
                  id={contractData.contractAddress}
                  onClick={async () => {
                    if (contractData.isApproved) return;
                    const contract = contractInfo.contractObject;
                    const signer = window._provider.getSigner();
                    contract
                      .connect(signer)
                      .approve()
                      .then(() => {
                        contractIsApproved(contractData.contractAddress);
                      })
                      .catch((err) => {
                        setContractDeployError(true);
                        console.log("error deploying contract", err);
                      });
                  }}
                >
                  {contractData.isApproved
                    ? "This contract has been approved!"
                    : "Approve"}
                </div>
              </ul>
            </div>
          );
        })}
      </div>
    );
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
              Error interacting with the contract! Make sure you filled out the
              form correctly!
            </div>
          )}
        </div>
      </div>
      <div className="col-6">{renderDeployedContract()}</div>
    </div>
  );
}

export default observer(Contracts);
