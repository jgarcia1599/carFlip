// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());


  // repeat the above for escrow contract
  // we should be able to deploy this from the frontend on contract creation
  // const Escrow = await ethers.getContractFactory("Escrow");
  // const escrow = await Escrow.deploy();
  // await escrow.deployed();

  // console.log("Escrow contract address:", escrow.address);
  // // We also save the contract's artifacts and address in the frontend directory
  // saveFrontendFiles(escrow);


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
