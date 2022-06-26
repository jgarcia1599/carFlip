import { action, makeAutoObservable, toJS } from "mobx";
import { observer } from "mobx-react";
import { getContractInfoOnChain } from "../utils/ethers";

// Model the application state.
class Model {
  currentPage = "contracts";
  contracts = [];
  contractInfo = {};
  userAddress = null;
  escrowAgents = [];
  constructor() {
    makeAutoObservable(this, { changePage: action });
  }

  changePage(pageName) {
    this.currentPage = pageName;
  }

  async saveContracts(contracts) {
    this.contracts = contracts;
    for (let contractData of this.contracts) {
      this.contractInfo[contractData.contractAddress] =
        await getContractInfoOnChain(contractData.contractAddress);
    }
  }
}
window.toJS = toJS

const model = new Model();
export default model;
