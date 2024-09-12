# Lf Token Dapp

NFT Minter DApp using Pinata and Sepolia Testnet
-
This decentralized application (DApp) allows users to mint NFTs on the Ethereum Sepolia test network. The app leverages Pinata to upload images and metadata to IPFS and integrates with MetaMask for wallet connection and transaction signing. It is built using React, Hardhat, and Web3.js.

Key Features:
-
1- MetaMask Integration: Users can connect their MetaMask wallet to interact with the application.
Wallet details (address and balance) are displayed after a successful connection.

2- Image Upload with Pinata: Users can upload an image for their NFT, which is stored on IPFS via Pinata.
The pinFileToIPFS function uploads. The selected image is sent to IPFS and returns an IPFS hash (URL).

3- NFT Metadata Creation: Users input an NFT name and description along with the image. Metadata is compiled (name, description, image link) and uploaded to IPFS using the pinJSONToIPFS function.

4- Minting NFTs: Once the image and metadata are uploaded to IPFS, users can mint the NFT on the Sepolia network. The NFT’s metadata URI (IPFS link) is passed to the smart contract for minting. A transaction is created and requires user confirmation in MetaMask.

5- Transaction Confirmation: After a successful minting transaction, the transaction hash and details are retrieved via Etherscan for tracking.

6- Error Handling: If there are issues with the wallet connection, image upload, or transaction, appropriate error messages are shown to guide the user.

Tools and Libraries:
-
React.js: Frontend framework for building the user interface.

Hardhat: Ethereum development environment for compiling and deploying smart contracts.

Web3.js: Used for interacting with the Ethereum blockchain.

Pinata: Service for uploading files (image and metadata) to IPFS.

MetaMask: Wallet for connecting to the Ethereum network and signing transactions.

Etherscan API: Used for fetching transaction details.

How It Works:
-
* The user connects their MetaMask wallet.
* An image for the NFT is uploaded and stored on IPFS via Pinata.
* The user provides a name and description for the NFT.
* Metadata (including the IPFS image link) is uploaded to IPFS.
* The user mints the NFT, initiating a transaction on the Sepolia testnet.
* The transaction is signed and processed via MetaMask, and the NFT is minted on the blockchain.

 This web app is a fully functional NFT minting platform, ideal for testing on the Sepolia network.
