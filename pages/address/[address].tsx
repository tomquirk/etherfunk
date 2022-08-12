import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { getAbi, getSourceCode } from "../../lib/etherscan/api";
import { SparklesIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { ConnectWalletButton } from "../../components/ConnectWalletButton";
import { TransactionButton } from "../../components/TransactionButton";
import { Button } from "../../components/Button";
import { readProvider } from "../../constants/network";
import { resourceLimits } from "worker_threads";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { ResultCard } from "../../components/ResultCard";
import Breadcrumbs from "../../components/Breadcrumb";

const AddressPage: NextPage = ({ functions, abi, contractMetadata }) => {
  const router = useRouter();
  const { address, fn } = router.query;
  const [functionArguments, setArguments] = useState<Array<string | number>>(
    []
  );
  const [result, setResult] = useState<any>();

  const currentFunction = functions.find((f: any) => f.name === fn);

  useEffect(() => {
    setResult(undefined);
  }, [currentFunction]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const contract = new Contract(address as string, abi, readProvider);
    const res = await contract[currentFunction.name](...functionArguments);
    console.log("RESULT::", res);

    setResult(res);
  };

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
            <a className="font-extrabold tracking-tight">
              ether<span className="italic">funk</span>.io
            </a>
          </Link>
        </div>
        <ConnectWalletButton />
      </header>

      <main className="h-screen">
        <div className="md:flex md:w-96 md:flex-col md:fixed flex-1 flex flex-col min-h-0 bg-slate-200 px-5 py-10 h-full">
          {/* <div>
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
          </div> */}
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
            <Breadcrumbs
              address={address as string}
              contractName={contractMetadata.name}
              fn={fn as string}
            />

            <div className="my-10">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 ">
                {fn}
              </h1>
              <span className="text-md tracking-tight text-gray-500">
                {contractMetadata.name ?? address}
              </span>
            </div>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
              <div>
                {!fn && (
                  <div>
                    <SparklesIcon className="h-10 w-10" />
                    <p>Select a function to execute.</p>
                  </div>
                )}

                {currentFunction && (
                  <form onSubmit={onSubmit}>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Inputs
                    </h3>

                    <div className="mb-3">
                      {currentFunction.inputs.length === 0 && (
                        <p className="text-slate-500 text-sm">
                          This function has no inputs.
                        </p>
                      )}
                      {currentFunction.inputs.map((fn: any, i: number) => (
                        <div key={`${i}-${fn.name}`} className="mb-5">
                          <div className="flex justify-between">
                            <label
                              htmlFor={`${i}-${fn.name}`}
                              className="block text-sm font-medium text-gray-700"
                            >
                              {fn.name || "Unnamed input"}
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
                              type="text"
                              name={`${i}-${fn.name}`}
                              id={`${i}-${fn.name}`}
                              className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              aria-describedby="email-optional"
                              onChange={(e) => {
                                const newArgs = [...functionArguments];
                                newArgs[i] = e.target.value;

                                setArguments(newArgs);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="py-3 bg-gray-50">
                      {currentFunction.stateMutability === "view" ? (
                        <Button>Execute</Button>
                      ) : (
                        <TransactionButton>Execute</TransactionButton>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {result !== undefined && <ResultCard result={result} />}
            </div>
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

  const abiRes = await getAbi(address);
  const functions = parseAbi(abiRes.data.result);

  const contractRes = await getSourceCode(address);

  return {
    props: {
      functions,
      abi: abiRes.data.result,
      contractMetadata: {
        name: contractRes.data.result?.[0].ContractName ?? "",
      },
    },
  };
}

export default AddressPage;
