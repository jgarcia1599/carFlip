import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import {ethers} from 'ethers';
import model from "../model";
import {
  postContract,
  getContracts,
  contractIsApproved,
  uploadFile,
  updateEscrowAgentStats
} from "../utils/api";
import deployEscrowContract from "../utils/deployEscrowContract";
import "./Contracts.scss";

function DeployedContractsList () {
    
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");
    let [contractDeployError, setContractDeployError] = useState(false);
  
    const saveFile = (e) => {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    };



    if (!(model.contracts && model.contracts.length > 0)) return;
    return (
      <div className="contractsContainer">

        {model.contracts.map((contractData) => {
          let contractInfo = model.contractInfo[contractData.contractAddress];
          if (!contractInfo) return;
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
                        let commisionEarned = (contractInfo.escrowAgentCommission.toNumber() * contractInfo.carPrice.toNumber()) / 100;
                        updateEscrowAgentStats(1, commisionEarned, model.userAddress)
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
                            {contractDeployError && (
        <div class="alert alert-danger" role="alert">
          Error interacting with the contract!
        </div>
      )}

      </div>
    );
}

export default observer(DeployedContractsList);