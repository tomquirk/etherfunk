import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { getAbi, getSourceCode } from "../../lib/etherscan/api";
import {
  ArrowCircleLeftIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { ConnectWalletButton } from "../../components/ConnectWalletButton";
import { TransactionButton } from "../../components/TransactionButton";
import { Button } from "../../components/Button";
import { readProvider } from "../../constants/network";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { ResultCard } from "../../components/ResultCard";
import Breadcrumbs from "../../components/Breadcrumb";

/**
 * Get functions from an ABI
 * @param rawAbi
 * @returns
 */
const parseAbi = (rawAbi: string) => {
  try {
    const abi = JSON.parse(rawAbi);
    const functions = abi.filter((v: any) => v.type === "function");

    return functions;
  } catch (e) {
    return [];
  }
};

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address } = context?.query ?? {};
  if (!address || typeof address !== "string") {
    return {
      notFound: true,
    };
  }

  const abiRes = await getAbi(address);
  const contractRes = await getSourceCode(address);

  if (abiRes.data.message === "NOTOK") {
    return {
      props: {
        error: abiRes.data.result,
        functions: [],
        abi: "",
        contractMetadata: {},
      },
    };
  }

  const functions = parseAbi(abiRes.data.result);

  return {
    props: {
      functions,
      abi: abiRes.data.result,
      contractMetadata: {
        name: contractRes.data.result?.[0].ContractName ?? "",
      },
    },
  };
};

const NavItem = ({
  href,
  selected,
  children,
}: {
  href: string;
  selected: boolean;
  children: JSX.Element;
}) => {
  return (
    <Link href={href} shallow replace>
      <a
        className={`"mb-1 px-2 py-1 text-slate-900 text-sm hover:bg-slate-50 rounded-md mb-1 " ${
          selected ? "bg-slate-100" : ""
        }`}
      >
        {children}
      </a>
    </Link>
  );
};

export default function AddressPage({
  functions,
  abi,
  contractMetadata,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [functionArguments, setArguments] = useState<Array<string | number>>(
    []
  );
  const [result, setResult] = useState<any>();

  const { address, fn } = router.query;
  const readFunctions = functions.filter(
    (f: any) => f.stateMutability === "view"
  );
  const writeFunctions = functions.filter(
    (f: any) => f.stateMutability === "nonpayable"
  );
  const payableFunctions = functions.filter(
    (f: any) => f.stateMutability === "payable"
  );
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
    <div className="h-screen bg-slate-100">
      <Head>
        <title>Etherfunk | Your Ethereum Control Panel</title>
        <meta
          name="description"
          content="Your Ethereum Control Panel. Interact with smart contracts on Ethereum."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="p-5 flex justify-between align-center bg-white border-b border-slate-200">
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
        {error ? (
          <span>{error}</span>
        ) : (
          <>
            <div className="md:flex md:w-96 md:flex-col md:fixed flex-1 flex flex-col min-h-0 bg-white px-6 py-8 h-full">
              <div className="mb-5 px-2">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="mb-3">
                  <input
                    type="search"
                    name="search"
                    id="search"
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
                    placeholder="Search..."
                  />
                </div>
              </div>

              <div>
                <div className="mb-5">
                  <div className="text-slate-500  px-2 uppercase text-xs font-bold mb-2">
                    READ
                  </div>
                  <div className="flex flex-col">
                    {readFunctions.map((readFunction: any, idx: number) => {
                      return (
                        <NavItem
                          href={`/address/${address}?fn=${readFunction.name}`}
                          key={`${readFunction.name}-${idx}`}
                          selected={fn === readFunction.name}
                        >
                          {readFunction.name}
                        </NavItem>
                      );
                    })}
                    {readFunctions.length === 0 && (
                      <div className="text-slate-500 text-sm px-2">
                        No read functions.
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-5">
                  <div className="text-slate-500 uppercase text-xs px-2 font-bold mb-2">
                    WRITE
                  </div>

                  <div className="flex flex-col">
                    {writeFunctions.map((writeFunction: any, idx: number) => {
                      return (
                        <NavItem
                          href={`/address/${address}?fn=${writeFunction.name}`}
                          key={`${writeFunction.name}-${idx}`}
                          selected={fn === writeFunction.name}
                        >
                          {writeFunction.name}
                        </NavItem>
                      );
                    })}
                    {payableFunctions.map(
                      (payableFunction: any, idx: number) => {
                        return (
                          <NavItem
                            href={`/address/${address}?fn=${payableFunction.name}`}
                            key={`${payableFunction.name}-${idx}`}
                            selected={fn === payableFunction.name}
                          >
                            <span className="flex items-center">
                              {payableFunction.name}
                              <CurrencyDollarIcon className="ml-1 h-4 w-4 text-slate-400" />
                            </span>
                          </NavItem>
                        );
                      }
                    )}
                    {writeFunctions.length === 0 &&
                      payableFunctions.length === 0 && (
                        <div className="text-slate-500 text-sm px-2">
                          No write functions.
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:pl-96 flex flex-col flex-1 h-full">
              <div className="px-10 py-4">
                <Breadcrumbs
                  address={address as string}
                  contractName={contractMetadata.name}
                  fn={fn as string}
                />
                {fn && (
                  <div className="my-10">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 ">
                      {fn}
                    </h1>
                    <span className="text-md tracking-tight text-slate-500">
                      {contractMetadata.name ?? address}
                    </span>
                  </div>
                )}

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                  <div>
                    {!fn && (
                      <div className="mt-10">
                        <ArrowCircleLeftIcon className="h-10 w-10 text-slate-400" />
                        <p className="font-bold font-xl">
                          Select a function to execute.
                        </p>
                      </div>
                    )}

                    {currentFunction && (
                      <form onSubmit={onSubmit}>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
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
                                  className="block text-sm font-medium text-slate-700"
                                >
                                  {fn.name || "Unnamed input"}
                                </label>
                                <span
                                  className="text-sm text-slate-500"
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
                                  className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-slate-300 rounded-md"
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

                        <div className="py-3">
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
          </>
        )}
      </main>
    </div>
  );
}
