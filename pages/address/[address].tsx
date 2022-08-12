import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { getAbi } from "../../lib/etherscan/api";
import { SparklesIcon } from "@heroicons/react/outline";
import Link from "next/link";

const AddressPage: NextPage = ({ functions }) => {
  const router = useRouter();
  const { address, fn } = router.query;

  const currentFunction = functions.find((f: any) => f.name === fn);

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

      <header className="px-5 py-5 flex justify-between align-center bg-white border-b border-gray-200">
        <div>
          <Link href="/">
            <a className="font-extrabold tracking-tight">etherfunk</a>
          </Link>
        </div>
        <button>Connect</button>
      </header>

      <main className="h-screen">
        <div className="md:flex md:w-96 md:flex-col md:fixed flex-1 flex flex-col min-h-0 bg-slate-200 px-5 py-10 h-full">
          <div>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="mb-3">
              <input
                type="search"
                name="search"
                id="search"
                className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Search..."
              />
            </div>
          </div>
          <div>
            <div className="mb-5">
              <span className="text-slate-500 uppercase text-sm font-bold">
                READ
              </span>
              <div className="flex flex-col pl-4">
                {functions
                  .filter((f: any) => f.stateMutability === "view")
                  .map((fn: any, idx: number) => {
                    return (
                      <Link
                        href={`/address/${address}?fn=${fn.name}`}
                        key={`${fn.name}-${idx}`}
                        shallow
                        replace
                      >
                        <a className="mb-1 px-2 py-1 hover:bg-slate-300 rounded-md">
                          {fn.name}
                        </a>
                      </Link>
                    );
                  })}
              </div>
            </div>
            <div className="mb-5">
              <span className="text-slate-500 uppercase text-sm font-bold">
                WRITE
              </span>

              <div className="flex flex-col pl-4">
                {functions
                  .filter(
                    (f: any) =>
                      f.stateMutability === "nonpayable" ||
                      f.stateMutability === "payable"
                  )
                  .map((fn: any, idx: number) => {
                    return (
                      <Link
                        href={`/address/${address}?fn=${fn.name}`}
                        key={`${fn.name}-${idx}`}
                        shallow
                        replace
                      >
                        <a className="mb-1 px-2 py-1 hover:bg-slate-300 rounded-md">
                          {fn.name}
                        </a>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="md:pl-96 flex flex-col flex-1 h-full">
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

            {currentFunction && (
              <form className="max-w-lg">
                {currentFunction.inputs.map((fn: any, i: number) => (
                  <div key={`${i}-${fn.name}`}>
                    <div className="flex justify-between">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {fn.name || "Unnamed"}
                      </label>
                      <span
                        className="text-sm text-gray-500"
                        id="email-optional"
                      >
                        {fn.type}
                      </span>
                    </div>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        aria-describedby="email-optional"
                      />
                    </div>
                  </div>
                ))}
                <div className="py-3 bg-gray-50 text-right">
                  <button
                    type="submit"
                    className="bg-sky-500 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    Execute
                  </button>
                </div>
              </form>
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

  return functions;
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
