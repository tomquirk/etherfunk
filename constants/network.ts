import { JsonRpcProvider } from "@ethersproject/providers";

const infuraKey = "c2838024e339438fbe8a31d6754efe8a";
export const rpcUrl = `https://mainnet.infura.io/v3/${infuraKey}`;

export const readProvider = new JsonRpcProvider(rpcUrl);
