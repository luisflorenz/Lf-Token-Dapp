const Web3 = require('web3').default; // Correctly import Web3
require('dotenv').config();

// Log the API URL for debugging
console.log("Alchemy API URL:", process.env.REACT_APP_ALCHEMY_URL);
console.log("Private Key:", process.env.SEPOLIA_PRIVATE_KEY);

const web3 = new Web3(process.env.ALCHEMY_API_URL); // Use the correct variable

web3.eth.net.getId()
  .then(networkId => {
    console.log("Connected to network ID:", networkId);
  })
  .catch(err => {
    console.error("Error connecting to the network:", err);
  });
