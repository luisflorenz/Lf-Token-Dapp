require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

//console.log("Alchemy URL:", process.env.REACT_APP_ALCHEMY_URL);
//console.log("Private Key:", process.env.SEPOLIA_PRIVATE_KEY ? "Loaded" : "Not Loaded");

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.REACT_APP_ALCHEMY_URL, // Sepolia network URL from Alchemy
      accounts: [process.env.SEPOLIA_PRIVATE_KEY], // Private key for deploying
      // gasPrice: 1000000000, // 1 Gwei (adjust this value as needed)
      // gas: 500000000, // Adjust based on your contract's requirements
    },
  },
};


