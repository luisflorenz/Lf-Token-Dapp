import axios from "axios";

const API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
const BASE_URL = "https://api.etherscan.io/api";

export const getTransactionDetails = async (txHash) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        module: "transaction",
        action: "gettxreceiptstatus",
        txhash: txHash,
        apikey: API_KEY,
      },
    });

    if (response.data.status === "1") {
      return response.data.result;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Etherscan API Error:", error);
    return null;
  }
};
