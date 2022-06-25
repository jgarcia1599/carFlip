import axios from "axios";
import model from "../../model";
import { configuration } from "../configuration";

// functions to interface with our centralized Node.js api

function apiConfig() {
  return {
    headers: {
      "content-type": "application/json",
    },
  };
}

export function getContracts() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${configuration.API_LINK}/get_contracts`, apiConfig())
      .then((response) => {
        console.log("get a contract", response.data);
        model.saveContracts(response.data.contracts);
        resolve();
      })
      .catch((error) => {
        console.log(error)
        reject();
      });
  });
}

export async function uploadFile(file, fileName, contractAddress){
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", fileName);
  try {
    const res = await axios.post(`${configuration.API_LINK}/`+contractAddress+`/uploadContractCheckup`, formData, apiConfig())
    console.log(res);
  } catch (ex) {
    console.log(ex);
  }
};

export function postContract(contractAddress, userAddress) {
  let data = {
    contractAddress: contractAddress,
    userAddress: userAddress,
  };
  return new Promise((resolve, reject) => {
    axios
      .post(`${configuration.API_LINK}/post_contracts`, data, apiConfig())
      .then((response) => {
        console.log("post a contract", response.data);
        getContracts();
        resolve();
      })
      .catch((error) => {
        reject(error.response.data.message);
      });
  });
}
export function contractIsApproved(contractAddress) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${configuration.API_LINK}/approve/${contractAddress}`, {}, apiConfig())
      .then((response) => {
        console.log("post a contract", response.data);
        getContracts();
        resolve();
      })
      .catch((error) => {
        reject(error.response.data.message);
      });
  });
}
