import { useContext } from "react";
import { NetworkContext } from "../../../contexts/NetworkContext";
import { Button } from "./Button";
import { ConnectWalletButton } from "./ConnectWalletButton";

export function TransactionButton(
  props: Omit<React.HTMLProps<HTMLButtonElement>, "type" | "size">
) {
  const { connectedWalletAddress } = useContext(NetworkContext);
  if (!connectedWalletAddress) {
    return <ConnectWalletButton connectText="Connect Wallet" />;
  }

  return (
    <Button {...props} type="submit">
      {props.children}
    </Button>
  );
}
