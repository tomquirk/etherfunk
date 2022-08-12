import { useContext } from "react";
import { NetworkContext } from "../contexts/NetworkContext";
import { Button } from "./Button";
import { ConnectWalletButton } from "./ConnectWalletButton";

export function TransactionButton(
  props: Omit<React.HTMLProps<HTMLButtonElement>, "type">
) {
  const { connectedWalletAddress } = useContext(NetworkContext);
  console.log("connectedWalletAddress", connectedWalletAddress);
  if (!connectedWalletAddress) {
    return <ConnectWalletButton connectText="Connect Wallet" />;
  }

  return <Button {...props} disabled>{props.children}</Button>;
}
