import React, { useState, useEffect } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./util/interactConnection.js";
import { pinFileToIPFS, pinJSONToIPFS } from "./util/pinata.js";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import { getTransactionDetails } from "./util/getTransactionDetails";
import Web3 from "web3"; // Make sure this is at the top of your file

function Minter() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");
  const [ipfsLink, setIpfsLink] = useState("");
  const [imageStatus, setImageStatus] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("0"); // Set initial balance to "0"
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);

  // New: function to connect wallet and fetch balance
  const connectWalletPressed = async () => {
    // Connect the wallet and get response
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWalletAddress(walletResponse.address);

    // Fetch balance if wallet is connected
    if (walletResponse.address) {
      // Initialize Web3 after wallet connection
      const web3 = new Web3(window.ethereum);

      try {
        // Fetch the balance using the connected wallet address
        const balance = await web3.eth.getBalance(walletResponse.address);
        const formattedBalance = web3.utils.fromWei(balance, "ether");
        setWalletBalance(formattedBalance);
      } catch (error) {
        setStatus(`😥 Error fetching balance: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    const fetchWalletData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          const { address, formattedBalance } = await getCurrentWalletConnected(
            web3
          );
          setWalletAddress(address);
          setWalletBalance(formattedBalance || "0");
        } catch (error) {
          console.error("Error fetching wallet data:", error);
        }
      } else {
        setStatus(
          <p>
            🦊{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://metamask.io/download.html`}
            >
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        );
      }
    };
    fetchWalletData();
    addWalletListener(); // Add listener to detect account changes
  }, []);

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          const newAddress = accounts[0];

          // Initialize web3 locally within the listener
          const web3 = new Web3(window.ethereum);

          // Fetch the new balance using web3 instance
          const balance = await web3.eth.getBalance(newAddress);
          const formattedBalance = web3.utils.fromWei(balance, "ether");

          setWalletAddress(newAddress);
          setWalletBalance(formattedBalance);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWalletAddress("");
          setWalletBalance("0"); // Reset balance if disconnected
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          🦊{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://metamask.io/download.html`}
          >
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageStatus("Image selected for upload");
    setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleMint = async () => {
    if (!name || !description || !image) {
      setStatus("❗Please make sure all fields are completed before minting.");
      return;
    }

    setLoading(true);

    // Upload the image to IPFS
    const uploadResponse = await pinFileToIPFS(image);

    if (!uploadResponse.success) {
      setStatus("😢 Failed to upload image to IPFS.");
      setLoading(false);
      return;
    }

    // Prepare metadata
    const metadata = {
      name,
      description,
      image: uploadResponse.pinataUrl, // Use the IPFS URL of the uploaded image
    };

    // Upload metadata to IPFS
    const metadataResponse = await pinJSONToIPFS(metadata);

    if (metadataResponse.success) {
      const tokenURI = metadataResponse.pinataUrl;
      setIpfsLink(tokenURI);

      // Mint the NFT
      const mintResponse = await mintNFT(tokenURI, name, description);

      if (mintResponse.success) {
        setTransactionHistory([
          ...transactionHistory,
          mintResponse.transactionHash,
        ]);

        // Retrieve transaction details from Etherscan
        const transactionDetails = await getTransactionDetails(
          mintResponse.transactionHash
        );
        console.log(transactionDetails);

        setStatus(mintResponse.status);
        setAlertOpen(true);
      } else {
        setStatus(
          "😥 Something went wrong during minting: " + mintResponse.status
        );
      }
    } else {
      setStatus("😢 Something went wrong while uploading your tokenURI.");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="lg" className="minter-container">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Mamut NFT Minter
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        spacing={2}
      >
        <Box flex={1} mr={{ md: 2 }}>
          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={connectWalletPressed} // Updated button handler
              size="small"
              disabled={!!walletAddress}
            >
              {walletAddress
                ? "Wallet Connected"
                : "Connect Wallet to Mamut NFT Minter Token Dapp 1.X"}
            </Button>
          </Box>
          {walletAddress && (
            <Box mt={2}>
              <Typography align="center">
                Wallet Address: {walletAddress}
              </Typography>
              <Typography align="center">
                Wallet Balance: {walletBalance} ETH
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="NFT Name"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="NFT Description"
            variant="outlined"
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            style={{ display: "none" }}
            id="image-upload"
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <Button variant="contained" color="primary" component="span">
              Upload Image
            </Button>
          </label>
          {imageStatus && (
            <Typography variant="caption" display="block" gutterBottom>
              {imageStatus}
            </Typography>
          )}
          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleMint}
              disabled={loading}
            >
              Mint NFT
            </Button>
          </Box>
          {loading && <LinearProgress />}

          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={() => setAlertOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setAlertOpen(false)}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              NFT minted successfully!
            </Alert>
          </Snackbar>
        </Box>
        <Box flex={1} ml={{ md: 2 }} mt={{ xs: 2, md: 0 }}>
          <Box
            mt={2}
            sx={{
              border: "1px dashed #999",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
              background: imagePreviewUrl
                ? "none"
                : "linear-gradient(45deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Uploaded preview"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
              />
            ) : (
              <Typography variant="caption" color="text.secondary">
                Preview image will be displayed here
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box mt={2}>
        <Typography align="center" color="textSecondary">
          {status}
        </Typography>
        {ipfsLink && (
          <Typography align="left">
            IPFS Link:{" "}
            <Link href={ipfsLink} target="_blank" rel="noopener noreferrer">
              {ipfsLink}
            </Link>
          </Typography>
        )}
      </Box>
      <Box mt={4}>
        <Typography variant="h7" align="center">
          Transaction History:
        </Typography>
        {transactionHistory.length > 0 ? (
          transactionHistory.map((hash, index) => (
            <Box key={index} mt={1} textAlign="left">
              <Link
                href={`https://sepolia.etherscan.io/tx/${hash}`} // Updated to Sepolia Etherscan
                target="_blank"
                rel="noopener noreferrer"
              >
                {`Transaction ${index + 1}: ${hash}`}
              </Link>
            </Box>
          ))
        ) : (
          <Typography align="center" mt={1}>
            No transactions yet.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Minter;
