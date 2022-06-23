import { observer } from "mobx-react";
import React, { useEffect } from "react";
import model from "../model";
import { postContract, getContracts } from "../utils/api";
import deployEscrowContract from "../utils/deployEscrowContract";

function Contracts() {
  useEffect(() => {
    getContracts();
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            // test whether or not we can depploy the escrow contract
            deployEscrowContract(
              "0x2961ad60fda7ef31ceed903386bc435e92b18b24",
              "0x2961ad60fda7ef31ceed903386bc435e92b18b24",
              1000
            )
              .then(async (contract) => {
                console.log("this is the response of deploy action", contract);
                console.log("this is the contract address ", contract.address);
                postContract(contract.address, model.userAddress);
                //now i will save the contract address to the centralized api
              })
              .catch((err) => console.log("error deploying contract", err));
          }}
        >
          Test a deploy of Escrow Contract
        </button>
      </div>
      {model.contracts && model.contracts.length > 0 && (
        <ul>
          {model.contracts.map((contractData) => (
            <li key={contractData.contractAddress}>
              {contractData.contractAddress}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default observer(Contracts);
