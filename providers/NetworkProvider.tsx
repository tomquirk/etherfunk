import { PropsWithChildren, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";

import { NetworkContext } from "../contexts/NetworkContext";

export default function NetworkProvider({ children }: PropsWithChildren<{}>) {
  const [signingProvider, setSigningProvider] = useState<
    Web3Provider | undefined
  >();
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<
    string | undefined
  >();

  useEffect(() => {
    console.log("here", signingProvider, "signing");
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
