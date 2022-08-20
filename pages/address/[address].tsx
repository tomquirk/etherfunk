import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowCircleLeftIcon } from "@heroicons/react/outline";
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
  const [functionArguments, setArguments] = useState<FunctionFormValues>([]);
  const [payableValue, setPayableValue] = useState<string>("");
  const [result, setResult] = useState<any>();

  const router = useRouter();

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
    // if the initial page load has already happened,
    // we can reset state.
    // if the user comes in cold, this won't be called.
    // if they click a link from the sidebar, it will be called.
    if (initialLoadDone) {
      setArguments([]);
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
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        {currentFunction.name}
                      </h1>

                      <p className="mt-1 text-sm font-normal text-slate-500 mb-5">
                        {currentFunction.inputs.length === 0 ? (
                          <>This function has no inputs.</>
                        ) : (
                          <span>
                            Complete the form and call this function.
                            {currentFunction.stateMutability !== "view" && (
                              <AutofillButton
                                onChange={(args) => setArguments(args)}
                              />
                            )}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <a
                        className="text-sm font-normal text-slate-500 mb-5 flex items-center hover:text-blue-700"
                        href={`https://etherscan.io/address/${contractAddress}#readContract`}
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
                    {!currentFunction ? (
                      <div className="mt-10">
                        <ArrowCircleLeftIcon className="h-10 w-10 text-slate-400" />
                        <p className="font-bold font-xl">
                          Select a function to execute.
                        </p>
                      </div>
                    ) : (
                      <FunctionForm
                        errorMessage={errorMessage}
                        loading={loading}
                        values={functionArguments}
                        payableValue={payableValue}
                        onSubmit={onSubmit}
                        onChange={(newArgs) => setArguments(newArgs)}
                        onPayableValueChange={(newPayableValue) =>
                          setPayableValue(newPayableValue)
                        }
                      />
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
