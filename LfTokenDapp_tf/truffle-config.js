const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(process.env.SEPOLIA_PRIVATE_KEY, process.env.REACT_APP_ALCHEMY_URL),
      network_id: 11155111, // Sepolia network ID
      gas: 3600000,         // Gas limit
      confirmations: 2,     // Number of confirmations to wait for
      timeoutBlocks: 200,   // Number of blocks to wait for deployment
      skipDryRun: true      // Skip dry run before migrations
    },
  },
  compilers: {
    solc: {
      version: "^0.8.20", // Make sure this matches your Solidity version
    },
  },
};
