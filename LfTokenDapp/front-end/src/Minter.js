import React, { useState, useEffect } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  mintNFT,
} from "./util/interactConnection.js";
import { pinJSONToIPFS } from "./util/pinata.js";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  Grid,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";

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
  const [walletBalance, setWalletBalance] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    const fetchWalletData = async () => {
      const { address, formattedBalance } = await getCurrentWalletConnected();
      setWalletAddress(address);
      setWalletBalance(formattedBalance);
    };
    fetchWalletData();
    addWalletListener();
  }, []);

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWalletAddress("");
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

    // Upload metadata to IPFS
    const metadata = {
      name,
      description,
      image
    };

    const response = await pinJSONToIPFS(metadata);

    if (response.success) {
      const tokenURI = response.pinataUrl;
      setIpfsLink(tokenURI);

      // Mint the NFT
      const mintResponse = await mintNFT(tokenURI, name, description);

      if (mintResponse.success) {
        setTransactionHistory([...transactionHistory, mintResponse.transactionHash]);
        setStatus(mintResponse.status);
        setAlertOpen(true);
      } else {
        setStatus("😥 Something went wrong during minting: " + mintResponse.status);
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
          Shardeum NFT Minter
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={connectWallet}
              size="small"
              disabled={!!walletAddress}
            >
              {walletAddress
                ? "Wallet Connected"
                : "Connect Wallet to Shardeum Sphinx Dapp 1.X"}
            </Button>
          </Box>
          {walletAddress && (
            <Box mt={2}>
              <Typography align="center">
                Wallet Address: {walletAddress}
              </Typography>
              <Typography align="center">
                Wallet Balance: {walletBalance} SHM
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
        </Grid>
        <Grid item xs={12} md={6}>
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
        </Grid>
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
      </Grid>
      <Box mt={4}>
        <Typography variant="h7" align="center">
          Transaction History:
        </Typography>
        {transactionHistory.length > 0 ? (
          transactionHistory.map((hash, index) => (
            <Box key={index} mt={1} textAlign="left">
              <Link
                href={`https://explorer-dapps.shardeum.org/transaction/${hash}`}
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