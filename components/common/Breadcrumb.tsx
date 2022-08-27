import { ChevronRightIcon, HomeIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useContext } from "react";
import { ContractContext } from "../../contexts/ContractContext";

export default function Breadcrumbs() {
  const { contractAddress, currentFunction, metadata } =
    useContext(ContractContext);

  return (
    <nav className="hidden lg:flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4 flex-wrap gap-y-1">
        <li>
          <div>
            <Link href="/">
              <a className="text-slate-500 hover:underline hover:text-blue-800">
                <HomeIcon
                  className="flex-shrink-0 h-4 w-4"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </a>
            </Link>
          </div>
        </li>

        <li key={contractAddress}>
          <div className="flex items-center">
            <ChevronRightIcon
              className="flex-shrink-0 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            <Link href={`/address/${contractAddress}`}>
              <a className="ml-4 text-sm font-normal text-slate-500 hover:underline hover:text-blue-800">
                {metadata?.name || contractAddress}
              </a>
            </Link>
          </div>
        </li>

        {currentFunction && (
          <li key={currentFunction.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="flex-shrink-0 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <Link
                href={`/address/${contractAddress}?fn=${currentFunction.name}`}
              >
                <a className="ml-4 text-sm font-normal text-slate-500 hover:underline hover:text-blue-800">
                  {currentFunction.name}
                </a>
              </Link>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
}
