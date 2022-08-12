import { JsonRpcProvider } from "@ethersproject/providers";

const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;
export const rpcUrl = `https://mainnet.infura.io/v3/${infuraKey}`;

export const readProvider = new JsonRpcProvider(rpcUrl);
