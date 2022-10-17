import axios, { AxiosError } from "axios";
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
  value = "0",
}: {
  contract: Contract;
  functionName: string;
  args: unknown[];
  userAddress: string;
  value?: string;
}) => {
  if (!TENDERLY_API_KEY) return;

  const unsignedTx = await contract.populateTransaction[functionName](...args);

  const body = {
    network_id: "1", // TODO support alt networks
    from: userAddress,
    to: contract.address,
    input: unsignedTx.data,
    value,
    save_if_fails: true,
  };

  const headers = {
    "content-type": "application/JSON",
    "X-Access-Key": TENDERLY_API_KEY,
  };

  let res;
  try {
    res = await axiosInstance.post(
      `/v1/account/${TENDERLY_ACCOUNT}/project/${TENDERLY_PROJECT_NAME}/simulate`,
      body,
      { headers }
    );
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      console.log(e?.response?.data);

      throw new Error(e?.response?.data.error.message);
    }
  }

  if (res?.data.simulation.status === false) {
    throw new Error(res?.data.transaction.error_message);
  }

  return res?.data;
};
