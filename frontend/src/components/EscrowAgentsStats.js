import React, {useEffect} from "react";
import { observer } from "mobx-react";
import model from "../model";
import {getEscrowAgentStats
  } from "../utils/api";

function EscrowAgentStats() {


    useEffect(() => {
        getEscrowAgentStats();
      }, []);


  return (
    <div className="container">
      <h3>Escrow Agents</h3>
      <p>Below is a list of our top performing escrow agents.</p>
      <ul className="list-group">
        {model.escrowAgents.length > 0 && model.escrowAgents.map(agent=>{
            return         <li className="list-group-item d-flex justify-content-between align-items-center">
            {agent.agentAddress}
            <span className="badge badge-primary badge-pill">Commisions Earned: {agent.commissionEarned} ETH</span>
            <span className="badge badge-primary badge-pill">Contracts Escrowed: {agent.contractsEscrowed}</span>
            <span className="badge badge-primary badge-pill">Reviews Received: {agent.reviewsReceived}</span>
            <span className="badge badge-primary badge-pill">Average Review: {agent.avgReview}</span>
          </li>
        })}
      </ul>
    </div>
  );
}

export default observer(EscrowAgentStats);
