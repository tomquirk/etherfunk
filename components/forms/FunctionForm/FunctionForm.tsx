import { Contract } from "ethers";
import { useRouter } from "next/router";
import { FormEventHandler, useContext, useEffect, useState } from "react";
import { readProvider } from "../../../constants/network";
import { ContractContext } from "../../../contexts/ContractContext";
import { NetworkContext } from "../../../contexts/NetworkContext";
import { simulateTransaction } from "../../../lib/tenderly/api";
import { Alert } from "../../common/Alert";
import { Button } from "../../common/buttons/Button";
import { TransactionButton } from "../../common/buttons/TransactionButton";
import { Input } from "../../common/form/Input";

export type FunctionFormValues = Array<string | number | boolean>;
export interface OnSubmitValue {
  functionArguments: FunctionFormValues;
  payableValue: string;
}

export function FunctionForm({
  errorMessage,
  loading,
  values,
  payableValue,
  onSubmit,
  onChange,
  onPayableValueChange,
}: {
  errorMessage?: string;
  loading?: boolean;
  values: FunctionFormValues;
  payableValue: string;
  onSubmit: VoidFunction;
  onChange: (newValues: FunctionFormValues) => void;
  onPayableValueChange: (newPayableValue: string) => void;
}) {
  const router = useRouter();
  const { currentFunction, contractAddress, abi } = useContext(ContractContext);
  const { connectedWalletAddress, signingProvider } =
    useContext(NetworkContext);

  const [loadingSimulation, setLoadingSimulation] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>();
  const [simulationError, setSimulationError] = useState<any>();

  useEffect(() => {
    setSimulationError(undefined);
    setSimulationResult(undefined);
  }, [currentFunction]);

  const onFieldChange = (
    fieldIdx: number,
    value: string | number | boolean
  ) => {
    // set state
    const newArgs = [...values];
    newArgs[fieldIdx] = value;
    onChange(newArgs);

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

  const _onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={_onSubmit}>
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
          {currentFunction.inputs.map((argument: any, idx: number) => {
            if (argument.type === "bool") {
              const checked = values[idx] === true || values[idx] === "true";
              return (
                <div
                  key={`${idx}-${argument.name}`}
                  className="relative flex items-start mb-5"
                >
                  <div className="flex items-center h-5">
                    <input
                      id={`${idx}-${argument.name}`}
                      name={`${idx}-${argument.name}`}
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded"
                      onChange={(e) => {
                        onFieldChange(idx, e.target.checked);
                      }}
                      checked={checked}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor={`${idx}-${argument.name}`}
                      className="font-medium text-gray-700"
                    >
                      {argument.name}
                    </label>
                  </div>
                </div>
              );
            }

            return (
              <div key={`${idx}-${argument.name}`} className="mb-5">
                <div className="flex justify-between">
                  <label
                    htmlFor={`${idx}-${argument.name}`}
                    className="block text-sm font-medium text-slate-700"
                  >
                    {argument.name || "Unnamed input"}
                  </label>
                  <span className="text-sm text-slate-500" id="email-optional">
                    {argument.type}
                  </span>
                </div>
                <div className="mt-1">
                  <Input
                    type="text"
                    name={`${idx}-${argument.name}`}
                    id={`${idx}-${argument.name}`}
                    aria-describedby="email-optional"
                    onChange={(e) => {
                      onFieldChange(idx, e.target.value);
                    }}
                    value={(values[idx] as string) ?? ""}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {currentFunction.stateMutability == "payable" && (
        <div>
          <div className="flex justify-between">
            <label
              htmlFor="payable-value"
              className="block text-sm font-medium text-slate-700"
            >
              Ether value
            </label>
            <span className="text-sm text-slate-500" id="payable-value">
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
                onPayableValueChange(e.target.value);
              }}
              value={payableValue ?? ""}
            />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            The amount of Ether to send with the transaction.
          </p>
        </div>
      )}

      <div className="mt-5">
        {simulationResult && (
          <div className="mb-5">
            <Alert
              variant="success"
              title="Simulation successful."
              body={
                <>
                  <p>
                    A transaction was successfully simulated with this data.
                    {/*{" "} <a
                className="underline hover:text-green-900 whitespace-nowrap"
                href=""
              >
                Read simulation report.
              </a> */}
                  </p>
                  {simulationResult?.transaction?.gas_used && (
                    <p className="mt-1">
                      Used{" "}
                      <span className="font-mono">
                        {simulationResult.transaction.gas_used.toString()}
                      </span>{" "}
                      <span className="font-medium">gwei</span> gas.
                    </p>
                  )}
                </>
              }
            />
          </div>
        )}

        {simulationError && (
          <div className="mb-5">
            <Alert
              variant="danger"
              title="Simulation failed."
              body={simulationError.message}
            />
          </div>
        )}

        <div className="flex mb-5">
          {currentFunction.stateMutability === "view" ? (
            <Button type="submit" loading={loading}>
              Read contract
            </Button>
          ) : (
            <>
              <TransactionButton>Submit transaction</TransactionButton>

              {connectedWalletAddress && (
                <Button
                  type="button"
                  variant="secondary"
                  className="ml-3"
                  loading={loadingSimulation}
                  onClick={async () => {
                    if (!contractAddress) return;

                    setLoadingSimulation(true);
                    setSimulationError(undefined);
                    setSimulationResult(undefined);

                    try {
                      const contract = new Contract(
                        contractAddress,
                        abi,
                        signingProvider?.getSigner() ?? readProvider
                      );

                      const res = await simulateTransaction({
                        contract,
                        functionName: currentFunction.name,
                        args: values,
                        userAddress: connectedWalletAddress,
                      });

                      setSimulationResult(res);
                    } catch (e) {
                      setSimulationError(e);
                    } finally {
                      setLoadingSimulation(false);
                    }
                  }}
                >
                  Simulate
                </Button>
              )}
            </>
          )}
          {currentFunction.inputs.length > 0 && (
            <Button
              onClick={(e) => {
                e.preventDefault();

                onChange([]);
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
              variant="tertiary"
              className="ml-3"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
