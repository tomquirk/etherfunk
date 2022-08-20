import axios from "axios";
import { Contract } from "@ethersproject/contracts";

const TENDERLY_ACCOUNT = process.env.NEXT_PUBLIC_TENDERLY_ACCOUNT;
const TENDERLY_PROJECT_NAME = process.env.NEXT_PUBLIC_TENDERLY_PROJECT_NAME;
const TENDERLY_API_KEY = process.env.NEXT_PUBLIC_TENDERLY_API_KEY;

const baseURL = "https://api.tenderly.co/api";

const axiosInstance = axios.create({
  baseURL,
});

export const simulateTransaction = async ({
  contract,
  functionName,
  args,
  userAddress,
}: {
  contract: Contract;
  functionName: string;
  args: any[];
  userAddress: string | undefined;
}) => {
  if (!TENDERLY_API_KEY) return;

  const unsignedTx = await contract.populateTransaction[functionName](...args);

  const body = {
    network_id: "1",
    from: userAddress,
    to: contract.address,
    input: unsignedTx.data,
    value: 0,
    save_if_fails: true,
  };

  const headers = {
    "content-type": "application/JSON",
    "X-Access-Key": TENDERLY_API_KEY,
  };

  const resp = await axiosInstance.post(
    `/v1/account/${TENDERLY_ACCOUNT}/project/${TENDERLY_PROJECT_NAME}/simulate`,
    body,
    { headers }
  );

  if (resp.data.simulation.status === false) {
    throw new Error(
      "A transaction was simulated with this data, and failed. Fix the data and try again."
    );
  }

  return resp.data;
};
