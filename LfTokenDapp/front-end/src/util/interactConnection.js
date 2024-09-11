import Web3 from "web3"; // Ensure Web3 is imported
import { pinJSONToIPFS } from "./pinata.js";
import contractABI from "../contracts/MyNFT.json";

// Environment variables
const alchemyKey = process.env.REACT_APP_ALCHEMY_URL;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

if (!alchemyKey) {
  throw new Error("Missing Alchemy URL in environment variables.");
}
if (!contractAddress) {
  throw new Error("Missing contract address in environment variables.");
}

let web3;

// Connect to wallet and initialize Web3
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts", // Prompt user to connect their wallet
      });

      // Initialize web3 instance if not already initialized
      if (!web3) {
        web3 = new Web3(window.ethereum);
        console.log("Web3 initialized:", web3);
      }

      const balance = await web3.eth.getBalance(addressArray[0]); // Fetch balance
      const formattedBalance = web3.utils.fromWei(balance, "ether"); // Convert balance to ether

      return {
        address: addressArray[0],
        balance: formattedBalance,
        status: "👆🏽 Write a message in the text-field above.",
      };
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            🦊{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://metamask.io/download.html`}
            >
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

// Function to get current wallet connected
export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      if (!web3) {
        web3 = new Web3(window.ethereum); // Initialize web3 if not done already
      }

      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);
      const formattedBalance = web3.utils.fromWei(balance, "ether");

      return {
        address: accounts.length > 0 ? accounts[0] : "",
        balance: formattedBalance,
      };
    } catch (err) {
      return {
        address: "",
        balance: "0",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      balance: "0",
      status: (
        <span>
          <p>
            🦊{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://metamask.io/download.html`}
            >
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

// Load contract
const loadContract = async () => {
  return new web3.eth.Contract(contractABI.abi, contractAddress);
};

// Mint NFT function
export const mintNFT = async (url, name, description) => {
  if (url.trim() === "" || name.trim() === "" || description.trim() === "") {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    };
  }

  const metadata = { name, image: url, description };
  const pinataResponse = await pinJSONToIPFS(metadata);

  if (!pinataResponse.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    };
  }

  const tokenURI = pinataResponse.pinataUrl;
  window.contract = await loadContract();

  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectedAddress,
    data: window.contract.methods
      .mintNFT(window.ethereum.selectedAddress, tokenURI)
      .encodeABI(),
  };

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    return {
      success: true,
      status: `✅ Check out your transaction on Etherscan: https://etherscan.io/tx/${txHash}`,
    };
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message,
    };
  }
};
