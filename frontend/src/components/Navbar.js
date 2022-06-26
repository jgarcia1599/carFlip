import React from "react";
import model from "../model";
import {observer} from "mobx-react";

function Navbar() {
    return <nav className="navbar navbar-expand-lg navbar-light bg-light nav-fill w-100">
    <a className="navbar-brand" href="#">CarFlip 🚗</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarText">
      <ul className="navbar-nav mr-auto">
        <li className={"nav-item" + (model.currentPage === "contracts" ? " active" : "")} onClick={()=>model.changePage("contracts")}>
          <a className="nav-link" href="#">Contracts</a>
        </li>
        <li className={"nav-item" + (model.currentPage === "escrow" ? " active" : "")} onClick={()=>model.changePage("escrow")}>
          <a className="nav-link" href="#">Escrow Agents</a>
        </li>
      </ul>
      <span className="navbar-text">
        <b>User:</b> {model.userAddress}
      </span>
    </div>
  </nav>
}

export default observer(Navbar);