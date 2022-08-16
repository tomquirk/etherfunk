import Link from "next/link";
import { networkName } from "../constants/network";

const CONTRACTS = [
  {
    address: "0x00000000006c3852cbef3e08e8df289169ede581",
    name: "OpenSea",
  },
  {
    address: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
    name: "Uniswap V3",
  },
  {
    address: "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5",
    name: "ENS",
  },
  {
    address: "0xcc8f7a89d89c2ab3559f484e0c656423e979ac9c",
    name: "Juicebox",
  },
];

export function ExploreSection() {
  if (networkName !== "mainnet") return null;

  return (
    <div className="flex justify-between">
      <span className="text-sm font-medium uppercase tracking-wide text-slate-500">
        Explore
      </span>
      {CONTRACTS.map((c) => (
        <Link href={`/address/${c.address}`} key={c.address}>
          <a className="text-sm underline text-slate-800 hover:text-blue-800">
            {c.name}
          </a>
        </Link>
      ))}
    </div>
  );
}
