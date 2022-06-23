import { action, makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import { getContractInfoOnChain } from "../utils/ethers";

// Model the application state.
class Model {
  currentPage = "token";
  contracts = [];
  contractInfo = {};
  userAddress = null;
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

const model = new Model();
export default model;
