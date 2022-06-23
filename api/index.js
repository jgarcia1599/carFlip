const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

//require enviroment variables
require("dotenv").config();
const { setupDB } = require("./db/setup");
const db = require("./db");

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
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

app.listen(port, () => {
  console.log(`App api listening on port ${port}`);
});
