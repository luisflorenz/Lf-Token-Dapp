const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Correct usage of ethers.utils.parseUnits
  const initialSupply = ethers.utils.parseUnits("1000", 18);

  // Deploy the contract
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const token = await MyNFT.deploy(initialSupply);

  console.log("MyNFT contract deployed to:", token.address);

  // Wait for the contract to be mined
  await token.deployed();

  // Update .env file with the new contract address
  const envFilePath = path.resolve(__dirname, "../.env");
  let envFileContent = fs.existsSync(envFilePath)
    ? fs.readFileSync(envFilePath, "utf8")
    : "";

  // Replace or add the contract address in .env file
  const updatedEnvFileContent = envFileContent.replace(
    /^REACT_APP_CONTRACT_ADDRESS=.*$/m,
    `REACT_APP_CONTRACT_ADDRESS=${token.address}`
  ) || `REACT_APP_CONTRACT_ADDRESS=${token.address}`;

  fs.writeFileSync(envFilePath, updatedEnvFileContent, "utf8");

  console.log(".env file updated with new contract address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
