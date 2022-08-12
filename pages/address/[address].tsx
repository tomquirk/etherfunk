import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { getAbi } from "../../lib/etherscan/api";
import { SparklesIcon } from "@heroicons/react/outline";
import Link from "next/link";

const AddressPage: NextPage = ({ functions }) => {
  const router = useRouter();
  const { address, fn } = router.query;

  return (
    <div className="h-screen bg-slate-50">
      <Head>
        <title>Etherfunk | Your Ethereum Control Panel</title>
        <meta
          name="description"
          content="Your Ethereum Control Panel. Interact with smart contracts on Ethereum."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex align-center justify-center h-full flex-col">
        <div className="hidden md:flex md:w-96 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-slate-200 px-5 py-10">
            <div>
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="mb-3">
                <input
                  type="search"
                  name="search"
                  id="search"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search..."
                />
              </div>
            </div>
            <div>
              {Object.keys(functions).map((k, i) => {
                return (
                  <div key={`${k}-${i}`} className="mb-5">
                    <span className="text-slate-500 uppercase text-sm font-bold">
                      {k}
                    </span>

                    <div className="flex flex-col pl-4">
                      {functions[k].map((fn: any, idx: number) => {
                        return (
                          <Link
                            href={`/address/${address}?fn=${fn.name}`}
                            key={`${fn.name}-${idx}`}
                          >
                            <a className="mb-1 px-2 py-1 hover:bg-slate-300 rounded-md">
                              {fn.name}
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:pl-96 flex flex-col flex-1">
          <div className="p-10">
            <div>
              <h1 className="text-xl tracking-tight text-gray-900">
                {address}
              </h1>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-10">
                {fn}
              </h2>
            </div>

            {!fn && (
              <div>
                <SparklesIcon className="h-10 w-10" />
                <p>Select a function to execute.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * Get functions from an ABI
 * @param rawAbi
 * @returns
 */
const parseAbi = (rawAbi: string) => {
  const abi = JSON.parse(rawAbi);
  const functions = abi.filter((v: any) => v.type === "function");
  const grouped = functions.reduce((map: any, fn: any) => {
    if (!map[fn.stateMutability]) {
      map[fn.stateMutability] = [fn];
    } else {
      map[fn.stateMutability].push(fn);
    }
    return map;
  }, {});

  return grouped;
};

// This gets called on every request
export async function getServerSideProps(context: NextPageContext) {
  const { address } = context?.query ?? {};
  if (!address || typeof address !== "string") {
    return {
      notFound: true,
    };
  }

  const data = await getAbi(address);
  const functions = parseAbi(data.data.result);

  return { props: { functions } };
}

export default AddressPage;
