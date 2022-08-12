import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { getAbi, getSourceCode } from "../../lib/etherscan/api";
import { ArrowCircleLeftIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { ConnectWalletButton } from "../../components/ConnectWalletButton";
import { TransactionButton } from "../../components/TransactionButton";
import { Button } from "../../components/Button";
import { readProvider } from "../../constants/network";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { ResultCard } from "../../components/ResultCard";
import Breadcrumbs from "../../components/Breadcrumb";
import Nav from "./Nav";

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
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { address, fn } = router.query;

  const currentFunction = functions.find((f: any) => f.name === fn);

  useEffect(() => {
    setResult(undefined);
    setArguments([]);
    setErrorMessage("");
  }, [currentFunction]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const contract = new Contract(address as string, abi, readProvider);
      const res = await contract[currentFunction.name](...functionArguments);
      console.log("RESULT::", res);

      setResult(res);
    } catch (e) {
      console.error(e);
      if (typeof e === "string") {
        setErrorMessage(e);
      } else {
        setErrorMessage((e as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <Head>
        <title>Etherfunk | Your Ethereum Control Panel</title>
        <meta
          name="description"
          content="Your Ethereum Control Panel. Interact with smart contracts on Ethereum."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="p-5 h-20 fixed top-0 w-full flex justify-between items-center bg-white border-b border-slate-200">
        <div className="flex items-center">
          <Link href="/">
            <a className="font-extrabold tracking-tight mr-2">
              ether<span className="italic">funk</span>.io
            </a>
          </Link>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-900">
            Beta
          </span>
        </div>
        <ConnectWalletButton />
      </header>

      <div className="mt-20">
        {error ? (
          <span>{error}</span>
        ) : (
          <>
            <Nav functions={functions} />

            <main
              className="md:pl-96 flex flex-col flex-1 h-full"
              style={{ maxHeight: "calc(100% - 80px)" }}
            >
              <div className="px-10 py-4">
                <Breadcrumbs
                  address={address as string}
                  contractName={contractMetadata.name}
                  fn={fn as string}
                />
                {fn && (
                  <div className="mt-5 mb-10">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                      {fn}
                    </h1>
                    <p className="mt-1 text-sm font-normal text-slate-500 mb-5">
                      Enter data and call this function.
                    </p>
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

                        <div>
                          {currentFunction.stateMutability === "view" ? (
                            <Button loading={loading}>Execute</Button>
                          ) : (
                            <TransactionButton>Execute</TransactionButton>
                          )}
                        </div>
                        {errorMessage && (
                          <div className="text-red-500">{errorMessage}</div>
                        )}
                      </form>
                    )}
                  </div>

                  {result !== undefined && (
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 mb-2">
                        Result
                      </h3>

                      <ResultCard result={result} />
                    </div>
                  )}
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
