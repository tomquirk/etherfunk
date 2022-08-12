import { ChevronRightIcon, HomeIcon } from "@heroicons/react/outline";
import Link from "next/link";

export default function Breadcrumbs({
  address,
  fn,
  contractName,
}: {
  address: string | undefined;
  fn: string | undefined;
  contractName: string | undefined;
}) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/">
              <a className="text-gray-400 hover:text-gray-500">
                <HomeIcon
                  className="flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </a>
            </Link>
          </div>
        </li>

        <li key={address}>
          <div className="flex items-center">
            <ChevronRightIcon
              className="flex-shrink-0 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <Link href={`/address/${address}`}>
              <a className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                {contractName || address}
              </a>
            </Link>
          </div>
        </li>

        {fn && (
          <li key={fn}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <Link href={`/address/${address}?fn=${fn}`}>
                <a className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  {fn}
                </a>
              </Link>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
}
