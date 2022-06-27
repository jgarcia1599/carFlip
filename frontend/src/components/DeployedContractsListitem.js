import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import model from "../model";
import {
  getContracts,
  contractIsApproved,
  uploadFile,
  updateEscrowAgentStats,
  submittedReview,
} from "../utils/api";
import "./Contracts.scss";

function DeployedContractsListItem(props) {
  let contractData = props.contractData;
  let contractInfo = props.contractInfo;
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(false);

  const [review, setReview] = useState(null);

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  function uploadInspection() {
    if (!file || !fileName) return;
    uploadFile(file, fileName, contractData.contractAddress).then(() => {
      const contract = contractInfo.contractObject;
      const signer = window._provider.getSigner();
      contract
        .connect(signer)
        .carIsOkay({
          value: ethers.utils.parseEther(`${contractInfo.carPrice.toNumber()}`),
        })
        .then(() => {
          setFile("");
          setFileName("");
          getContracts();
        })
        .catch((err) => {
          console.log("error deploying contract", err);
          setError(true);
        });
    });
  }
  async function approveCarContractTransaction() {
    if (contractData.isApproved) return;
    const contract = contractInfo.contractObject;
    const signer = window._provider.getSigner();
    contract
      .connect(signer)
      .approve()
      .then(() => {
        contractIsApproved(contractData.contractAddress);
        let commisionEarned =
          (contractInfo.escrowAgentCommission.toNumber() *
            contractInfo.carPrice.toNumber()) /
          100;
        updateEscrowAgentStats(1, commisionEarned, contractInfo.escrowAgent);
      })
      .catch((err) => {
        console.log("error deploying contract", err);
        setError(true);
      });
  }

  function renderBuyerInspectionAlert() {
    return (
      <div className="alert alert-primary" role="alert">
        <p>
          As the prospective new owner of Car: {contractInfo.carVIN}, I need to
          due diligence on the conditions of the car for this transaction to be
          approved by an escrow. Please upload a document issued by an
          authorized car shop ensuring that the car is in desirable conditions.
        </p>
        <input type="file" onChange={saveFile} />
        <button onClick={() => uploadInspection()}>Upload</button>
      </div>
    );
  }

  function renderEscrowReviewForm() {
    let isCarBuyer = model.userAddress === contractInfo.carBuyer.toLowerCase();
    let isCarSeller =
      model.userAddress === contractInfo.carSeller.toLowerCase();
    let by = null;
    if (isCarSeller && contractData.carSellerSubmittedReview === false) {
      by = "carSeller";
    }
    if (isCarBuyer && contractData.carBuyerSubmittedReview === false) {
      by = "carBuyer";
    }

    if (!by) return;

    return (
      <div className="alert alert-info" role="alert">
        <p>
          Please leave a review for the escrow agent that facilitated this
          transaction:
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => setReview(parseInt(e.target.value))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </p>
        <button onClick={() => submitReview(by)} className="btn btn-success">
          {" "}
          Submit Review
        </button>
      </div>
    );
  }

  function submitReview(by) {
    try {
      if (!review) return;
      updateEscrowAgentStats(null, null, contractInfo.escrowAgent, review);
      submittedReview(contractData.contractAddress, by);
    } catch (error) {
      setError(true);
    }
  }

  if (!contractData || !contractInfo) return null;

  if (error === true) {
    setTimeout(() => setError(false), 2000); // hacky fix to remove error message after some time
  }

  return (
    <div className="contractsContainer">
      <div key={contractData.contractAddress} className="existing-contract">
        <ul className="fields">
          {error && (
            <div className="alert alert-danger">
              Error performing action on contract!
            </div>
          )}
          {model.userAddress === contractInfo.escrowAgent.toLowerCase() &&
            contractData.isApproved === false && (
              <div
                className={
                  "alert alert-" +
                  (contractInfo.isCarInspected === true ? "success" : "warning")
                }
                role="alert"
              >
                I am the Escrow of this contract.{" "}
                {contractInfo.isCarInspected === true
                  ? "This contract is ready to be approved as the car has been inspected by the new prospective owner."
                  : "This contract must first be inspected by the car buyer before I can approve it"}
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
            <div> Is Car Inspected ✔️? </div>
            <div>
              {" "}
              {contractInfo.isCarInspected === true ? "Yes 😊" : "No❌"}{" "}
            </div>
          </li>

          {contractData.filePath && (
            <li>
              <div> Car Shop Inspection Document </div>
              <div> {contractData.filePath} </div>
            </li>
          )}
          {model.userAddress === contractInfo.carBuyer.toLowerCase() &&
            (!contractData.filePath || contractInfo.isCarInspected === false) &&
            renderBuyerInspectionAlert()}

          {contractData.isApproved === true &&
            (model.userAddress === contractInfo.carBuyer.toLowerCase() ||
              model.userAddress === contractInfo.carSeller.toLowerCase()) &&
            renderEscrowReviewForm()}

          <div
            className={contractData.isApproved ? "complete" : "button"}
            id={contractData.contractAddress}
            onClick={() => approveCarContractTransaction()}
          >
            {contractData.isApproved
              ? "This contract has been approved!"
              : "Approve"}
          </div>
        </ul>
      </div>
    </div>
  );
}

export default observer(DeployedContractsListItem);
