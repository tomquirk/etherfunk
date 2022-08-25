import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  ArrowCircleLeftIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  PencilIcon,
} from "@heroicons/react/outline";
import { Contract } from "@ethersproject/contracts";
import { parseEther } from "@ethersproject/units";
import { useContext, useEffect, useState } from "react";

import { getAbi, getSourceCode } from "../../lib/etherscan/api";
import { readProvider } from "../../constants/network";
import { ResultCard } from "../../components/ResultCard";
import Breadcrumbs from "../../components/common/Breadcrumb";
import Nav from "../../components/layout/Nav";
import { EtherscanLogo } from "../../components/common/icons/EtherscanLogo";
import { DefaultHead } from "../../components/common/DefaultHead";
import { NetworkContext } from "../../contexts/NetworkContext";
import {
  FunctionForm,
  FunctionFormValues,
} from "../../components/forms/FunctionForm/FunctionForm";
import { Header } from "../../components/layout/Header";
import { AutofillButton } from "../../components/AutofillButton";
import {
  ContractContext,
  ContractContextProvider,
} from "../../contexts/ContractContext";
import { Alert } from "../../components/common/Alert";

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
        error: abiRes.data.result as string,
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
      error: null,
    },
  };
};

function AddressPage({ serverSideError }: { serverSideError: string }) {
  const { signingProvider } = useContext(NetworkContext);
  const {
    currentFunction,
    contractAddress,
    abi,
    functions,
    metadata: contractMetadata,
  } = useContext(ContractContext);

  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [functionArguments, setFunctionArguments] =
    useState<FunctionFormValues>([]);
  const [payableValue, setPayableValue] = useState<string>("");
  const [result, setResult] = useState<any>();

  const router = useRouter();

  // only run on initial render
  useEffect(() => {
    const { args, run } = router.query;
    try {
      if (!args) throw new Error();
      const parsed = JSON.parse(args as string);
      setFunctionArguments(parsed);
    } catch (e) {
      setFunctionArguments([]);
    }
    setInitialLoadDone(true);
  }, []);

  useEffect(() => {
    const { run } = router.query;

    if (!initialLoadDone) return;
    if (run) {
      onSubmit();
    }
  }, [initialLoadDone]);

  useEffect(() => {
    setResult(undefined);
    setErrorMessage("");
    // If the initial page load has already happened,
    // we can reset state.
    // Example: if user clicks a link from the sidebar, reset the state.
    // If the user comes in cold, this won't be called.
    if (initialLoadDone) {
      setFunctionArguments([]);
    }
  }, [currentFunction]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage(undefined);

      const contract = new Contract(
        contractAddress as string,
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

  return (
    <div className="bg-slate-100" style={{ minHeight: "calc(100vh - 80px)" }}>
      <Header />

      <div className="mt-20">
        {serverSideError ? (
          <span>{serverSideError}</span>
        ) : (
          <>
            {functions && <Nav functions={functions} />}

            <main
              className="md:pl-96 flex flex-col flex-1 h-full"
              style={{ maxHeight: "calc(100% - 80px)" }}
            >
              <div className="px-10 py-4">
                <Breadcrumbs
                  address={contractAddress}
                  contractName={contractMetadata?.name}
                  fn={currentFunction?.name}
                />

                {currentFunction && (
                  <div className="mt-5 flex justify-between">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                        {currentFunction.name}
                      </h1>

                      <div className="flex items-center mb-7">
                        <span className="uppercase mr-4 text-xs text-slate-500 tracking-wide flex items-center">
                          {currentFunction.stateMutability === "view" ? (
                            <BookOpenIcon className="h-4 w-4" />
                          ) : currentFunction.stateMutability === "payable" ? (
                            <CurrencyDollarIcon className="h-4 w-4" />
                          ) : (
                            <PencilIcon className="h-4 w-4" />
                          )}{" "}
                          <span className="ml-1">
                            {currentFunction.stateMutability}
                          </span>
                        </span>
                        <a
                          className="text-xs font-normal text-blue-600 flex items-center hover:underline hover:text-blue-800 visited:text-purple-800"
                          href={`https://etherscan.io/address/${contractAddress}#readContract`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <EtherscanLogo />
                          <span className="ml-1">Etherscan</span>
                        </a>
                      </div>

                      <p className="mt-1 text-sm font-normal text-slate-500 mb-5">
                        {currentFunction.inputs.length === 0 &&
                        currentFunction.stateMutability !== "payable" ? (
                          <>This function has no inputs.</>
                        ) : (
                          <span>
                            Complete the form and call this function.
                            {currentFunction.stateMutability !== "view" && (
                              <AutofillButton
                                onChange={(args) => setFunctionArguments(args)}
                              />
                            )}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                  <div>
                    {!currentFunction ? (
                      <div className="mt-10">
                        <ArrowCircleLeftIcon className="h-10 w-10 text-slate-400" />
                        <p className="font-bold font-xl">
                          Select a function to execute.
                        </p>
                      </div>
                    ) : (
                      <>
                        {" "}
                        {currentFunction.stateMutability === "payable" && (
                          <Alert
                            variant="warning"
                            title="You're about to pay a smart contract."
                            body="This function is payable. Executing it will transfer funds from
      your wallet to the contract. Etherfunk may
      have bugs. Verify the
      transaction data before submitting the
      transaction"
                            className="mb-5"
                          />
                        )}
                        <FunctionForm
                          errorMessage={errorMessage}
                          loading={loading}
                          values={functionArguments}
                          payableValue={payableValue}
                          onSubmit={onSubmit}
                          onChange={(newArgs) => setFunctionArguments(newArgs)}
                          onPayableValueChange={(newPayableValue) =>
                            setPayableValue(newPayableValue)
                          }
                        />
                      </>
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

export default function AddressPageRender({
  functions,
  abi,
  contractMetadata,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Etherfunk</title>
        <DefaultHead />
      </Head>

      <ContractContextProvider
        functions={functions}
        abi={abi}
        metadata={contractMetadata}
      >
        <AddressPage serverSideError={error} />
      </ContractContextProvider>
    </>
  );
}
