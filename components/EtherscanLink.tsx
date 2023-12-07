import { HTMLProps } from "react";
import { networkName } from "../constants/network";

const ETHERSCAN_HOSTNAME =
  networkName === "optimism"
    ? "optimistic.etherscan.io"
    : networkName === "goerli"
    ? "goerli.etherscan.io"
    : "etherscan.io";

export const EtherscanLink: React.FC<
  {
    address: string;
    type: "address" | "tx";
    linkSuffix?: string;
  } & HTMLProps<HTMLAnchorElement>
> = ({ children, address, type, linkSuffix = "", ...props }) => {
  return (
    <a
      href={`https://${ETHERSCAN_HOSTNAME}/${type}/${address}${linkSuffix}`}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children ?? address}
    </a>
  );
};
