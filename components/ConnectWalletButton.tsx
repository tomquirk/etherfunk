import React, { useContext, useEffect } from "react";
import { init, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { ethers } from "ethers";
import { NetworkContext } from "../contexts/NetworkContext";
import { rpcUrl } from "../constants/network";
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
  appMetadata: {
    // app name
    name: "Juicebox",
    // SVG icon string, with height or width (whichever is larger) set to 100% or a valid image URL
    icon: "https://juicebox.money/assets/juice_logo-ol.png",
    // Optional wide format logo (ie icon and text) to be displayed in the sidebar of connect modal. Defaults to icon if not provided
    // description of app
    description: "Juicebox is sick",
    // url that points to more information about app
    explore: "https://info.juicebox.money",
  },
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
    console.log("here", setSigningProvider);
    if (wallet) {
      const ethersProvider = new ethers.providers.Web3Provider(
        wallet.provider,
        "any"
      );
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
