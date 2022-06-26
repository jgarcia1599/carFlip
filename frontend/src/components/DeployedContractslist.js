import { observer } from "mobx-react";
import React from "react";
import model from "../model";
import "./Contracts.scss";
import DeployedContractsListitem from "./DeployedContractsListitem";

function DeployedContractsList() {
  if (!(model.contracts && model.contracts.length > 0)) return;
  return (
    <div className="contractsContainer">
      {model.contracts.map((contractData) => {
        let contractInfo = model.contractInfo[contractData.contractAddress];
        if (!contractInfo) return;
        return (
          <DeployedContractsListitem
            key={contractData.contractAddress}
            contractInfo={contractInfo}
            contractData={contractData}
          />
        );
      })}
    </div>
  );
}

export default observer(DeployedContractsList);
