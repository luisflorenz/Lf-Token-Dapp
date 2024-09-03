const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require('dotenv').config(); // Load environment variables from .env file

async function main() {
  // Read Alchemy URL and private key from .env
  const INFURA_URL = process.env.REACT_APP_ALCHEMY_URL;
  const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

  // Create a provider and a wallet instance
  const provider = new ethers.JsonRpcProvider(INFURA_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deploying contracts with the account:", wallet.address);

  // Define the contract's ABI and bytecode
  const MyNFT_ABI = [
    // Include the constructor and function ABI
    "constructor()",
    "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)"
  ];

  const MyNFT_BYTECODE = "YOUR_CONTRACT_BYTECODE"; // You will need to compile your contract and get the bytecode

  // Create a contract factory
  const MyNFTFactory = new ethers.ContractFactory(MyNFT_ABI, MyNFT_BYTECODE, wallet);

  try {
    console.log("Preparing to deploy the contract...");
    const contract = await MyNFTFactory.deploy(); // No parameters needed for the constructor
    console.log("Deployment transaction initiated...");

    // Wait for the contract to be mined
    const receipt = await contract.deployTransaction.wait();
    console.log("MyNFT contract deployed to:", contract.address);
    console.log("Transaction receipt:", receipt);

    // Update .env file with the new contract address
    const envFilePath = path.resolve(__dirname, "../.env");
    let envFileContent = fs.existsSync(envFilePath)
      ? fs.readFileSync(envFilePath, "utf8")
      : "";

    // Replace or add the contract address in .env file
    const updatedEnvFileContent = envFileContent.replace(
      /^REACT_APP_CONTRACT_ADDRESS=.*$/m,
      `REACT_APP_CONTRACT_ADDRESS=${contract.address}`
    ) || `REACT_APP_CONTRACT_ADDRESS=${contract.address}`;

    fs.writeFileSync(envFilePath, updatedEnvFileContent, "utf8");
    console.log(".env file updated with new contract address:", contract.address);
  } catch (error) {
    console.error("Error deploying contract:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unexpected error:", error.message);
    process.exit(1);
  });
