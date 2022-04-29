const hre = require("hardhat"); // optional

async function main() {
  const DerpiesFactory = await hre.ethers.getContractFactory("WhoopsieDerpies");
  console.log("deploying contract");
  const derpiesContract = await DerpiesFactory.deploy();
  console.log("waiting on block confirmation");
  await derpiesContract.deployed();
  console.log("Contract deployed to:", derpiesContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
