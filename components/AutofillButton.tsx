import { useContext, useEffect, useState } from "react";
import { ContractContext } from "../contexts/ContractContext";
import { getInputValues } from "./forms/FunctionForm/helpers";

export function AutofillButton({
  onChange,
}: {
  onChange: (args: any[]) => void;
}) {
  const { contractAddress, abi, currentFunction } = useContext(ContractContext);
  const [autofillLoading, setAutofillLoading] = useState<boolean>(false);
  const [autofillDisabled, setAutofillDisabled] = useState<boolean>(false);

  useEffect(() => {
    setAutofillDisabled(false);
  }, [currentFunction]);

  const onClickAutofill = async () => {
    setAutofillLoading(true);

    if (!contractAddress) return;

    try {
      const args = await getInputValues(
        contractAddress,
        currentFunction.name,
        abi
      );

      if (args.length === 0) {
        setAutofillDisabled(true);
      } else {
        onChange(args);
      }
    } catch (e) {
      setAutofillDisabled(true);
    } finally {
      setAutofillLoading(false);
    }
  };

  return (
    <>
      <span
        data-tip="This function didn't appear in the last 1000 transactions."
        className="text-slate-400 italic ml-2 cursor-not-allowed "
        hidden={!autofillDisabled}
      >
        Autofill unavailable
      </span>
      <button
        type="button"
        className="ml-2 border-b border-dashed border-decoration-dashed border-slate-300  hover:border-slate-400 hover:text-blue-800 leading-tight"
        onClick={onClickAutofill}
        data-tip="Populate most common values from the last 1000 transactions."
        hidden={autofillDisabled}
      >
        🔥{" "}
        <span className="italic">
          {autofillLoading ? "Autofilling..." : "Autofill"}
        </span>
      </button>
    </>
  );
}
