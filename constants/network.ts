import { JsonRpcProvider } from "@ethersproject/providers";

type NetworkName = "mainnet" | "goerli" | "optimism";
const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;
export const networkName: NetworkName =
  (process.env.NEXT_PUBLIC_ETHEREUM_NETWORK_NAME as NetworkName) ?? "mainnet";

export const rpcUrl =
  networkName === "optimism"
    ? `https://optimism-mainnet.infura.io/v3/${infuraKey}`
    : `https://${networkName}.infura.io/v3/${infuraKey}`;
export const readProvider = new JsonRpcProvider(rpcUrl);
