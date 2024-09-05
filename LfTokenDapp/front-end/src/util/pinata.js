import axios from 'axios';

const pinataApiKey = process.env.REACT_APP_PINATA_KEY;
const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET;
//const axios = require('axios');

export const pinJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey,
            },
        })
        .then((response) => {
            return {
                success: true,
                pinataUrl: response.data.IpfsHash,
            };
        })
        .catch((error) => {
            console.error("Error uploading JSON to IPFS:", error);
            return {
                success: false,
                message: error.message,
            };
        });
};
