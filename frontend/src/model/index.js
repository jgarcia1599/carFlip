import { action, makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

// Model the application state.
class Model {
  currentPage = "token";
  contracts = [];
  userAddress = null;
  constructor() {
    makeAutoObservable(this, { changePage: action });
  }

  changePage(pageName) {
    this.currentPage = pageName;
    console.log("page name", this.currentPage);
  }
}

const model = new Model();
export default model;
