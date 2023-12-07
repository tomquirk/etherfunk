import { JsonRpcProvider } from "@ethersproject/providers";

const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;
export const networkName =
  process.env.NEXT_PUBLIC_ETHEREUM_NETWORK_NAME ?? "mainnet";

export const rpcUrl =
  networkName === "optimism"
    ? `https://optimism-mainnet.infura.io/v3/${infuraKey}`
    : `https://${networkName}.infura.io/v3/${infuraKey}`;
export const readProvider = new JsonRpcProvider(rpcUrl);
