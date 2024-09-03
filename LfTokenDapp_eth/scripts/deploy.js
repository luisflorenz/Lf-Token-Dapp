require('dotenv').config();
const hre = require("hardhat");

async function main() {
    // Get the contract factory
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");

    console.log("Deploying MyNFT...");

    // Deploy the contract
    const myNFT = await MyNFT.deploy();

    // Wait for the transaction to be mined
    const tx = await myNFT.deployTransaction;
    
    console.log(`Transaction hash: ${tx.hash}`);

    // Wait for the transaction to be confirmed
    const receipt = await tx.wait();

    console.log(`MyNFT deployed to: ${myNFT.address}`);
    console.log(`Transaction receipt:`, receipt);
}

// Execute the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });
