import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { getAbi, getSourceCode } from "../../lib/etherscan/api";
import { ArrowCircleLeftIcon, ExclamationIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { ConnectWalletButton } from "../../components/common/buttons/ConnectWalletButton";
import { TransactionButton } from "../../components/common/buttons/TransactionButton";
import { Button } from "../../components/common/buttons/Button";
import { readProvider } from "../../constants/network";
import { Contract } from "ethers";
import { useContext, useEffect, useMemo, useState } from "react";
import { ResultCard } from "../../components/ResultCard";
import Breadcrumbs from "../../components/common/Breadcrumb";
import Nav from "./Nav";
import { EtherscanLogo } from "../../components/common/icons/EtherscanLogo";
import { DefaultHead } from "../../components/common/DefaultHead";
import { NetworkContext } from "../../contexts/NetworkContext";
import { parseEther } from "ethers/lib/utils";
import { getInputValues } from "../../components/forms/FunctionForm/helpers";
import { Alert } from "../../components/common/Alert";
import { Input } from "../../components/common/form/Input";

/**
 * Get functions from an ABI
 * @param rawAbi
 * @returns
 */
const parseAbi = (rawAbi: string) => {
  try {
    const abi = JSON.parse(rawAbi);
    const functions = abi.filter((v: any) => v.type === "function");

    const functionsDeduped: any[] = [];

    functions.forEach((fn: any) => {
      const functionsWithSameName = functionsDeduped.filter(
        (_fn: any) => _fn.name === fn.name || _fn.name.startsWith(fn.name + "_")
      );
      if (functionsWithSameName.length > 0) {
        return functionsDeduped.push({
          ...fn,
          name: `${fn.name}_${functionsWithSameName.length}`,
        });
      }

      functionsDeduped.push(fn);
    });

    return functionsDeduped;
  } catch (e) {
    console.error(e);
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
  const { signingProvider } = useContext(NetworkContext);

  const [functionArguments, setArguments] = useState<Array<string | number>>(
    []
  );
  const [payableValue, setPayableValue] = useState<string>("");
  const [result, setResult] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);
  const [autofillLoading, setAutofillLoading] = useState<boolean>(false);
  const [autofillDisabled, setAutofillDisabled] = useState<boolean>(false);

  const { address, fn } = router.query;

  const currentFunction = useMemo(
    () => functions.find((f: any) => f.name === fn),
    [fn, functions]
  );

  // only run on initial render
  useEffect(() => {
    const { args } = router.query;
    try {
      if (!args) throw new Error();
      const parsed = JSON.parse(args as string);
      setArguments(parsed);
    } catch (e) {
      setArguments([]);
    }
    setInitialLoadDone(true);
  }, []);

  useEffect(() => {
    setResult(undefined);
    setErrorMessage("");
    setAutofillDisabled(false);
    // if the initial page load has already happened,
    // we can reset state.
    // if the user comes in cold, this won't be called.
    // if they click a link from the sidebar, it will be called.
    if (initialLoadDone) {
      setArguments([]);
    }
  }, [currentFunction]);

  const onSubmit = async (e: any) => {
    console.log(signingProvider?.getSigner());
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMessage(undefined);

      const contract = new Contract(
        address as string,
        abi,
        signingProvider?.getSigner() ?? readProvider
      );

      console.log(
        `Calling "${currentFunction.name}" with args: ${functionArguments}`
      );
      const res = payableValue
        ? await contract[currentFunction.name](...functionArguments, {
            value: parseEther(payableValue),
          })
        : await contract[currentFunction.name](...functionArguments);

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

  const onFieldChange = (fieldIdx: number, value: string) => {
    // set state
    const newArgs = [...functionArguments];
    newArgs[fieldIdx] = value;
    setArguments(newArgs);

    const newQuery = { ...router.query, args: JSON.stringify(newArgs) };

    // sync params
    router.replace(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const onClickAutofill = async () => {
    setAutofillLoading(true);

    try {
      const args = await getInputValues(
        address as string,
        currentFunction.name,
        abi
      );

      if (args.length === 0) {
        setAutofillDisabled(true);
      } else {
        setArguments(args);
      }
    } catch (e) {
      setAutofillDisabled(true);
    } finally {
      setAutofillLoading(false);
    }
  };

  return (
    <div className="bg-slate-100" style={{ minHeight: "calc(100vh - 80px)" }}>
      <Head>
        <title>Etherfunk</title>
        <DefaultHead />
      </Head>

      <header className="p-5 h-20 fixed top-0 w-full flex justify-between items-center bg-white border-b border-slate-200">
        <div className="flex items-center">
          <Link href="/">
            <a className="font-extrabold tracking-tight mr-2">
              ether<span className="italic">funk</span>.io
            </a>
          </Link>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
                  <div className="mt-5 flex justify-between">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {fn}
                      </h1>

                      <p className="mt-1 text-sm font-normal text-slate-500 mb-5">
                        {currentFunction.inputs.length === 0 ? (
                          <>This function has no inputs.</>
                        ) : (
                          <span>
                            Complete the form and call this function.
                            <span
                              data-tip="This function didn't appear in the last 1000 transactions."
                              className="text-slate-400 italic"
                              hidden={!autofillDisabled}
                            >
                              {" "}
                              Autofill unavailable
                            </span>
                            <button
                              type="button"
                              className="ml-2 border-b border-dashed border-decoration-dashed border-slate-300  hover:border-slate-400 hover:text-slate-700 leading-tight"
                              onClick={onClickAutofill}
                              data-tip="Populate most common values from the last 1000 transactions."
                              hidden={autofillDisabled}
                            >
                              🔥{" "}
                              <span className="italic">
                                {autofillLoading
                                  ? "Autofilling..."
                                  : "Autofill"}
                              </span>
                            </button>
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <a
                        className="text-sm font-normal text-slate-500 mb-5 flex items-center hover:text-blue-700"
                        href={`https://etherscan.io/address/${address}#readContract`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <EtherscanLogo />
                        <span className="ml-1">View on Etherscan</span>
                      </a>
                    </div>
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
                        {errorMessage && (
                          <div className="mb-8">
                            <Alert
                              variant="danger"
                              title="Transaction failed."
                              body={errorMessage}
                            />
                          </div>
                        )}
                        {currentFunction.inputs.length > 0 && (
                          <div className="mb-3">
                            {currentFunction.inputs.map(
                              (fn: any, i: number) => (
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
                                    <Input
                                      type="text"
                                      name={`${i}-${fn.name}`}
                                      id={`${i}-${fn.name}`}
                                      aria-describedby="email-optional"
                                      onChange={(e) => {
                                        onFieldChange(i, e.target.value);
                                      }}
                                      value={functionArguments[i] ?? ""}
                                    />
                                  </div>
                                </div>
                              )
                            )}
                            {currentFunction.stateMutability == "payable" && (
                              <div className="mb-5 mt-10">
                                <div className="flex justify-between">
                                  <label
                                    htmlFor="payable-value"
                                    className="block text-sm font-medium text-slate-700"
                                  >
                                    Value
                                  </label>
                                  <span
                                    className="text-sm text-slate-500"
                                    id="payable-value"
                                  >
                                    ETH
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <Input
                                    type="text"
                                    name="payable-value"
                                    id="payable-value"
                                    aria-describedby="payable-value"
                                    onChange={(e) => {
                                      setPayableValue(e.target.value);
                                    }}
                                    value={payableValue ?? ""}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {currentFunction.stateMutability === "payable" && (
                          <Alert
                            variant="warning"
                            title="You're about to pay a smart contract."
                            body="This transaction will transfer funds from
                          your wallet to the contract. Etherfunk may
                          have bugs. Before submitting the
                          transaction, make sure you verify the
                          transaction data."
                            className="mb-5"
                          />
                        )}

                        <div className="flex">
                          {currentFunction.stateMutability === "view" ? (
                            <Button type="submit" loading={loading}>
                              Read contract
                            </Button>
                          ) : (
                            <TransactionButton>
                              Submit transaction
                            </TransactionButton>
                          )}
                          <Button
                            onClick={(e) => {
                              e.preventDefault();

                              setArguments([]);
                              router.replace(
                                {
                                  pathname: router.pathname,
                                  query: { ...router.query, args: undefined },
                                },
                                undefined,
                                { shallow: true }
                              );
                            }}
                            type="button"
                            variant="secondary"
                            className="ml-3"
                          >
                            Reset
                          </Button>
                        </div>
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
