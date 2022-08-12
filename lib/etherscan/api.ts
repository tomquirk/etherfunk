import axios from "axios";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const axiosInstance = axios.create({
  baseURL: "https://api.etherscan.io/api",
});

export const getAbi = (contractAddress: string) => {
  return axiosInstance.get("", {
    params: {
      module: "contract",
      action: "getabi",
      address: contractAddress,
      apikey: ETHERSCAN_API_KEY,
    },
  });
};

export const getSourceCode = (contractAddress: string) => {
  return axiosInstance.get("", {
    params: {
      module: "contract",
      action: "getsourcecode",
      address: contractAddress,
      apikey: ETHERSCAN_API_KEY,
    },
  });
};
