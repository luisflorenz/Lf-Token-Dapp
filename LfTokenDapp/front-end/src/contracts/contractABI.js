import MyNFT from "./MyNFT.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

const contractABI = MyNFT.abi;

export { contractAddress, contractABI };