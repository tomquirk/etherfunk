import axios from "axios";
import { networkName } from "../../constants/network";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const baseURL =
  networkName === "mainnet"
    ? "https://api.etherscan.io/api"
    : `https://api-${networkName}.etherscan.io/api`;

const axiosInstance = axios.create({
  baseURL,
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

export const listTransactions = (contractAddress: string) => {
  return axiosInstance.get("", {
    params: {
      module: "account",
      action: "txlist",
      address: contractAddress,
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "0",
      sort: "desc",
      apikey: ETHERSCAN_API_KEY,
    },
  });
};
