import axios from "axios";
import {configuration} from "../configuration";


// functions to interface with our centralized Node.js api

function apiConfig() {
    return {
      headers: {
        "content-type": "application/json",
      }
    };
  }
  

  export function getContracts() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${configuration.API_LINK}/get_contracts`, apiConfig())
        .then((response) => {
            console.log("get a contract", response.data)
          resolve();
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  }

  export function postContract(contractAddress, userAddress) {
    let data = {
        contractAddress:contractAddress, 
        userAddress:userAddress
    }
    return new Promise((resolve, reject) => {
      axios
        .post(`${configuration.API_LINK}/post_contracts`, data, apiConfig())
        .then((response) => {
        console.log("post a contract",response.data)
          resolve();
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  }


