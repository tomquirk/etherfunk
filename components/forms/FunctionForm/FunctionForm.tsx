import { useRouter } from "next/router";
import { FormEventHandler, useContext, useState } from "react";
import { ContractContext } from "../../../contexts/ContractContext";
import { Alert } from "../../common/Alert";
import { Button } from "../../common/buttons/Button";
import { TransactionButton } from "../../common/buttons/TransactionButton";
import { Input } from "../../common/form/Input";

export type FunctionFormValues = Array<string | number>;
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
  const { currentFunction } = useContext(ContractContext);

  const onFieldChange = (fieldIdx: number, value: string) => {
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
          {currentFunction.inputs.map((fn: any, i: number) => (
            <div key={`${i}-${fn.name}`} className="mb-5">
              <div className="flex justify-between">
                <label
                  htmlFor={`${i}-${fn.name}`}
                  className="block text-sm font-medium text-slate-700"
                >
                  {fn.name || "Unnamed input"}
                </label>
                <span className="text-sm text-slate-500" id="email-optional">
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
                  value={values[i] ?? ""}
                />
              </div>
            </div>
          ))}
          {currentFunction.stateMutability == "payable" && (
            <div className="mb-5 mt-10">
              <div className="flex justify-between">
                <label
                  htmlFor="payable-value"
                  className="block text-sm font-medium text-slate-700"
                >
                  Value
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
          <TransactionButton>Submit transaction</TransactionButton>
        )}
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
          variant="secondary"
          className="ml-3"
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
