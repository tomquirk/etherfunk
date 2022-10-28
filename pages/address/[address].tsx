import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import {
  ArrowCircleLeftIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  PencilIcon,
} from "@heroicons/react/outline";
import { Contract } from "@ethersproject/contracts";
import { parseEther } from "@ethersproject/units";
import { ReactElement, useContext, useEffect, useState } from "react";
import { getAbi, getSourceCode } from "../../lib/etherscan/api";
import { readProvider } from "../../constants/network";
import { ResultCard } from "../../components/ResultCard";
import { EtherscanLogo } from "../../components/common/icons/EtherscanLogo";
import { NetworkContext } from "../../contexts/NetworkContext";
import {
  FunctionForm,
  FunctionFormValues,
} from "../../components/forms/FunctionForm/FunctionForm";
import { AutofillButton } from "../../components/AutofillButton";
import { ContractContext } from "../../contexts/ContractContext";
import { Alert } from "../../components/common/Alert";
import { ContractLayout } from "../../components/layout/ContractLayout/ContractLayout";
import { EtherscanLink } from "../../components/EtherscanLink";
import { Button } from "../../components/common/buttons/Button";

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

  const [abiRes, contractRes] = await Promise.all([
    getAbi(address),
    getSourceCode(address),
  ]);

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

const ResultsColumn = ({ result }: { result: unknown }) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [result]);

  if (result === undefined) return null;

  return (
    <div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">Result</h3>

      <ResultCard result={result} />
      <Button
        onClick={() => {
          const query = { ...router.query, [AUTORUN_QUERY_PARAM]: "1" };
          router.replace({ pathname: router.pathname, query }, undefined, {
            shallow: true,
          });

          console.log(router);

          navigator.clipboard.writeText(window.location.href);
          setCopied(true);
        }}
        type="button"
        variant="secondary"
        className="mt-3"
        data-tip={copied ? "Copied!" : "Copy link to clipboard"}
      >
        {copied ? "Copied link!" : "Share result"}
      </Button>
    </div>
  );
};

const AUTORUN_QUERY_PARAM = "run";

function AddressPage({ serverSideError }: { serverSideError: string }) {
  const { signingProvider } = useContext(NetworkContext);
  const { currentFunction, contractAddress, abi } = useContext(ContractContext);
  console.log("address::function::", currentFunction);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [functionArguments, setFunctionArguments] =
    useState<FunctionFormValues>([]);
  const [payableValue, setPayableValue] = useState<string>("");
  const [result, setResult] = useState<unknown>();

  const router = useRouter();

  // only run on initial render
  useEffect(() => {
    const { args } = router.query;
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
    const run = router.query[AUTORUN_QUERY_PARAM];

    if (!initialLoadDone) return;
    if (run && currentFunction.stateMutability === "view") {
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
        `page::address::calling "${currentFunction.name}" with args: ${functionArguments}`
      );
      const res = payableValue
        ? await contract[currentFunction.name](...functionArguments, {
            value: parseEther(payableValue),
          })
        : await contract[currentFunction.name](...functionArguments);

      console.log("page::address::result::", res);

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
    <div>
      {serverSideError ?? (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {!currentFunction ? (
            <div className="mt-10">
              <ArrowCircleLeftIcon className="h-10 w-10 text-slate-400" />
              <h1 className="font-semibold text-xl">
                Select a function to execute.
              </h1>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
                {currentFunction.name}
              </h1>

              <div className="flex items-center mb-8">
                <span className="uppercase mr-4 text-sm text-slate-500 tracking-wide flex items-center">
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
                {contractAddress && (
                  <EtherscanLink
                    className="text-sm font-normal text-slate-500 flex items-center hover:underline hover:text-blue-800 visited:text-purple-800"
                    linkSuffix="#readContract"
                    address={contractAddress}
                    type="address"
                  >
                    <EtherscanLogo />
                    <span className="ml-1">Etherscan</span>
                  </EtherscanLink>
                )}
              </div>

              <div className="text-sm font-normal text-slate-500">
                {currentFunction.inputs.length === 0 &&
                currentFunction.stateMutability !== "payable" ? (
                  <p>This function has no inputs.</p>
                ) : (
                  <p className="mb-5">
                    Complete the form and call this function.
                    {currentFunction.stateMutability !== "view" && (
                      <AutofillButton
                        onChange={(args) => setFunctionArguments(args)}
                      />
                    )}
                  </p>
                )}
              </div>

              {currentFunction.stateMutability === "payable" && (
                <Alert
                  variant="warning"
                  title="You're about to pay a smart contract."
                  body="This function sends funds from
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
            </div>
          )}
          <ResultsColumn result={result} />
        </div>
      )}
    </div>
  );
}

export default function AddressPageRender({
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <AddressPage serverSideError={error} />;
}

AddressPageRender.getLayout = function getLayout(
  page: ReactElement,
  pageProps: any // TODO fix
) {
  return <ContractLayout {...pageProps}>{page}</ContractLayout>;
};
