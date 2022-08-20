import React, { useContext, useEffect } from "react";
import { init, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { Web3Provider } from "@ethersproject/providers";
import { NetworkContext } from "../../../contexts/NetworkContext";
import { rpcUrl } from "../../../constants/network";
import { Button } from "./Button";

const injected = injectedModule();

// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum",
      rpcUrl,
    },
  ],
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
});

export function ConnectWalletButton({
  connectText = "Connect",
}: {
  connectText?: string;
}) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const { setSigningProvider } = useContext(NetworkContext);

  useEffect(() => {
    if (wallet) {
      const ethersProvider = new Web3Provider(wallet.provider, "any");
      if (!ethersProvider) return;

      setSigningProvider?.(ethersProvider);
    } else {
      setSigningProvider?.(undefined);
    }
  }, [wallet, setSigningProvider]);

  return (
    <div>
      <Button
        disabled={connecting}
        onClick={() => (wallet ? disconnect(wallet) : connect())}
      >
        {connecting ? "Connecting" : wallet ? "Disconnect" : connectText}
      </Button>
    </div>
  );
}
