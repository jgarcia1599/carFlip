const express = require("express");
const app = express();
const fileupload = require("express-fileupload");
const cors = require("cors");
const port = 3042;

//require enviroment variables
require("dotenv").config();
const { setupDB } = require("./db/setup");
const db = require("./db");

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(express.json());

//include DB setup and wait for async function to finish
(async () => {
  await setupDB();
})();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/get_contracts", async (req, res) => {
  try {
    let contracts = await db.models.contract_records.findAll();
    res.json({ status: "success", contracts: contracts });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});

app.post("/post_contracts", async (req, res) => {
  try {
    let contractAddress = req.body["contractAddress"];
    let userAddress = req.body["userAddress"];
    let contractRecordEntry = await db.models.contract_records.findOrCreate({
      where: {
        contractAddress: contractAddress,
        userAddress: userAddress,
      },
    });
    res.json({
      status: "success",
      contractRecordEntry: contractRecordEntry[0],
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});
app.post("/approve/:contractAddress", async (req, res) => {
  try {
    let contractAddress = req.params["contractAddress"];
    let contractRecordEntry = await db.models.contract_records.findOne({
      where: {
        contractAddress: contractAddress,
      },
    });
    await contractRecordEntry.update({ isApproved: true });
    res.json({
      status: "success",
      contractRecordEntry: contractRecordEntry,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});
app.post("/submittedReview/:contractAddress", async (req, res) => {
  try {
    let whoSubmittedReview = req.body["by"];
    let contractAddress = req.params["contractAddress"];
    let contractRecordEntry = await db.models.contract_records.findOne({
      where: {
        contractAddress: contractAddress,
      },
    });
    if (whoSubmittedReview === "carBuyer") {
      await contractRecordEntry.update({ carBuyerSubmittedReview: true });
    } else if (whoSubmittedReview === "carSeller") {
      await contractRecordEntry.update({ carSellerSubmittedReview: true });
    }

    res.json({
      status: "success",
      contractRecordEntry: contractRecordEntry,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});
app.post("/escrow/:agentAddress/updateStats", async (req, res) => {
  try {
    let agentAddress = req.params["agentAddress"];
    let contractsCommisioned = req.body["newContractsCommissioned"];
    let commisionEarned = req.body["commissionEarned"];
    let newReview = req.body["review"];
    let escrowAgentEntry = await db.models.escrow_agents.findOrCreate({
      where: {
        agentAddress: agentAddress,
      },
    });
    let escrowAgent = escrowAgentEntry[0];
    if (contractsCommisioned && commisionEarned) {
      let newContractsCommissioned =
        escrowAgent.contractsEscrowed + contractsCommisioned;
      await escrowAgent.update({
        contractsEscrowed: newContractsCommissioned,
      });
      let newComissionEarned = escrowAgent.commissionEarned + commisionEarned;
      await escrowAgent.update({
        commissionEarned: newComissionEarned,
      });
    }
    if (newReview) {
      let newReviewsRecieved = escrowAgent.reviewsReceived + 1;
      let newAvgReview =
        (escrowAgent.reviewsReceived * escrowAgent.avgReview + newReview) /
        newReviewsRecieved;
      await escrowAgent.update({ reviewsReceived: newReviewsRecieved });
      await escrowAgent.update({ avgReview: newAvgReview });
    }
    res.json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});
app.get("/escrow/stats", async (req, res) => {
  try {
    let records = await db.models.escrow_agents.findAll();
    res.json({
      status: "success",
      escrowAgents: records,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});

app.post("/:contractAddress/uploadContractCheckup", (req, res) => {
  try {
    let contractAddress = req.params["contractAddress"];
    const newpath = __dirname + "/files/";
    const file = req.files.file;
    console.log("fileee", file);
    const filename = file.name;
    file.mv(`${newpath}${filename}`, async (err) => {
      if (err) {
        res.status(500).send({ message: "File upload failed", code: 200 });
      }
      console.log("success yaya");

      let contractRecordEntry = await db.models.contract_records.findOne({
        where: {
          contractAddress: contractAddress,
        },
      });
      await contractRecordEntry.update({ filePath: `${newpath}${filename}` });

      res.status(200).send({ message: "File Uploaded", code: 200 });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
});

app.listen(port, () => {
  console.log(`App api listening on port ${port}`);
});
