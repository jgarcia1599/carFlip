import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
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
  let [newArbitrer, setNewArbitrer] = useState("");
  let [newBeneficiary, setNewBeneficiary] = useState("");
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
    if (!newArbitrer || !newContractAmount || !newBeneficiary) return;
    deployEscrowContract(
      newArbitrer,
      newBeneficiary,
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
    setNewArbitrer("");
    setNewBeneficiary("");
    setNewContractAmount("");
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
                  contractInfo.contractArbiter.toLowerCase() && contractData.isApproved === false &&(
                    <div class={"alert alert-" + (contractInfo.isCarInspected === true ? "success" : "warning")} role="alert">
                      I am the Escrow of this contract. {contractInfo.isCarInspected === true? "This contract is ready to be approved as the car has been inspected by the new prospective owner." : "This contract must first be inspected by the beneficiary before I can approve it"}
                    </div>
                  )}
                <li>
                  <div> Car VIN </div>
                  <div> {contractInfo.carVIN} </div>
                </li>
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
                  contractInfo.contractBeneficiary.toLowerCase() &&
                  !contractData.filePath && (
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
                              .carIsOkay()
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
            Arbiter Address
            <input
              type="text"
              id="arbiter"
              value={newArbitrer}
              onChange={(e) => setNewArbitrer(e.target.value)}
            />
          </label>

          <label>
            Beneficiary Address
            <input
              type="text"
              id="beneficiary"
              value={newBeneficiary}
              onChange={(e) => setNewBeneficiary(e.target.value)}
            />
          </label>

          <label>
            Deposit Amount (in ETH)
            <input
              type="text"
              id="wei"
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
