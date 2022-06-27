const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow", function () {
  let contract;
  let escrowAgent = ethers.provider.getSigner(0);
  let carBuyer = ethers.provider.getSigner(1);
  let escrowCommission; // will be tested before assignment;

  let carVin = "HMFBT9F38F6027999";
  let carPrice ="20";

  describe("Catch Deploy Errors: Escrow commission should be set between 1 and 10", async () => {
    it("should revert as commission is less than 1 ", async () => {
      const Escrow = await ethers.getContractFactory("Escrow");
      escrowCommission = -1;
      let ex;
      try {
        contract = await Escrow.deploy(
          escrowAgent.getAddress(),
          carBuyer.getAddress(),
          -1,
          carVin,
          carPrice
        );
        await contract.deployed();
      } catch (_ex) {
        ex = _ex;
      }
      assert(
        ex,
        "Escrow Agent Commission needs to be greater than or equal to 1"
      );
    });
    it("should revert as commission is greater than 10 ", async () => {
      const Escrow = await ethers.getContractFactory("Escrow");
      escrowCommission = 11;
      let ex;
      try {
        contract = await Escrow.deploy(
          escrowAgent.getAddress(),
          carBuyer.getAddress(),
          -1,
          carVin,
          carPrice
        );
        await contract.deployed();
      } catch (_ex) {
        ex = _ex;
      }
      assert(
        ex,
        "Escrow Agent Commission needs to be greater than or equal to 1"
      );
    });
  });
  describe("after successful contract deployement", async () => {
    beforeEach(async () => {
      const Escrow = await ethers.getContractFactory("Escrow");
      escrowCommission = 5;
      contract = await Escrow.deploy(
        escrowAgent.getAddress(),
        carBuyer.getAddress(),
        escrowCommission,
        carPrice,
        carVin
      );
      await contract.deployed();
    });

    it("should not be funded if the car is not ok", async function () {
      let balance = await ethers.provider.getBalance(contract.address);
      let isCarOk = await contract.isCarOk();

      assert.equal(balance.toString(), 0);
      assert.equal(isCarOk, false);
    });

    it("escrow agent can't approve of contract if the buyer doesnt approve of the car", async function () {
      let err;
      try {
        await contract.connect(escrowAgent).approve();
      } catch (error) {
        err = error;
      }
      assert(err, "Car Buyer hasn't verified car condition!");
    });

    it("only car buyer can approve the car's conditions", async function () {
      let randomAddress = ethers.provider.getSigner(6).getAddress();
      try {
        await contract.connect(randomAddress).carIsOkay({ value: carPrice });
      } catch (error) {
        err = error;
      }
      assert(err, "Only the car buyer can approve this transaction");
    });

    describe("after car buyer approves of the car's conditions", async function () {
      beforeEach(async () => {
        await contract.connect(carBuyer).carIsOkay({ value: ethers.utils.parseEther("20")});
      });
      it("only escrow agent can approve the transaction", async function () {
        let err;
        try {
          await contract.connect(carSeller).approve();
        } catch (error) {
          err = error;
        }
        assert(err, "Only the escrow agent can approve the transaction");
      });
    });
  });
});
