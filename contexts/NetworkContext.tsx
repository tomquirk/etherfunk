import { Web3Provider } from "@ethersproject/providers";

import { createContext } from "react";

export const NetworkContext: React.Context<{
  connectedWalletAddress?: string;
  signingProvider?: Web3Provider;
  setSigningProvider?: (provider: Web3Provider | undefined) => void;
}> = createContext({});
