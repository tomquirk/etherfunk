import { Web3Provider } from "@ethersproject/providers";
import { PropsWithChildren, useEffect, useState, createContext } from "react";

export const NetworkContext: React.Context<{
  connectedWalletAddress?: string;
  signingProvider?: Web3Provider;
  setSigningProvider?: (provider: Web3Provider | undefined) => void;
}> = createContext({});

export function NetworkProvider({ children }: PropsWithChildren<{}>) {
  const [signingProvider, setSigningProvider] = useState<
    Web3Provider | undefined
  >();
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<
    string | undefined
  >();

  useEffect(() => {
    const updateAddress = async () => {
      const address = await signingProvider?.getSigner().getAddress();
      setConnectedWalletAddress(address);
    };
    updateAddress();
  }, [signingProvider]);

  return (
    <NetworkContext.Provider
      value={{
        connectedWalletAddress,
        signingProvider,
        setSigningProvider,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
