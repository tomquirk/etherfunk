import { HTMLProps } from "react";

export const EtherscanLink: React.FC<
  {
    address: string;
    type: "address" | "tx";
    linkSuffix?: string;
  } & HTMLProps<HTMLAnchorElement>
> = ({ children, address, type, linkSuffix = "", ...props }) => {
  return (
    <a
      href={`https://etherscan.io/${type}/${address}${linkSuffix}`}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children ?? address}
    </a>
  );
};
