const hre = require("hardhat");

async function main() {
  // Get the contract to deploy
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  // Explicit gas settings
  const gasLimit = 3000000; // Adjust based on contract complexity
  const gasPrice = hre.ethers.utils.parseUnits("20", "gwei"); // Adjust Gwei as needed

  // Deploy contract with explicit gas settings
  const myNFT = await MyNFT.deploy({
    gasLimit: gasLimit,
    gasPrice: gasPrice,
  });

  console.log("Deploying MyNFT...");
  await myNFT.deployed();

  console.log("MyNFT deployed to:", myNFT.address);
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
