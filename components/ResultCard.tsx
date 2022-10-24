import { BigNumber } from "@ethersproject/bignumber";
import { isAddress } from "ethers/lib/utils";
import { useContext } from "react";
import { ContractContext } from "../contexts/ContractContext";
import { formatVariableName } from "../utils/string";
import { EtherscanLink } from "./EtherscanLink";

function Value({ value }: { value: unknown }) {
  if (isAddress(value as string)) {
    return (
      <span>
        <EtherscanLink
          address={value as string}
          type="address"
          className="underline hover:text-blue-800 visited:text-purple-800"
        />
      </span>
    );
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return <span>{`${value}`}</span>;
  }

  if (BigNumber.isBigNumber(value)) {
    return <span>{value.toString()}</span>;
  }

  return null;
}

function LabelValue({ label, value }: { label?: string; value: string }) {
  return (
    <div className="text-md mb-1">
      {label && (
        <span className="font-semibold">{formatVariableName(label)}: </span>
      )}
      <span className="font-mono">
        <Value value={value} />
      </span>
    </div>
  );
}

const Result = ({
  result,
  output,
  depthIndex = 0,
}: {
  result: any;
  output: any;
  depthIndex?: number;
}) => {
  if (!result) return null;

  return (output.components ?? output).map((outputChild: any, idx: number) => {
    const key = `${outputChild.name}-${depthIndex}`;

    if (!outputChild.components) {
      const resultToRender = Array.isArray(result) ? result[idx] : result;
      return (
        <LabelValue key={key} label={outputChild.name} value={resultToRender} />
      );
    }

    const extraClasses = depthIndex === 0 ? "mb-2" : "";

    return (
      <div key={key}>
        <div className="font-semibold text-md mb-1">
          {formatVariableName(outputChild.name)}
        </div>
        <div className={`ml-6 ${extraClasses}`}>
          <Result
            result={result[idx]}
            output={outputChild}
            depthIndex={depthIndex + 1}
          />
        </div>
      </div>
    );
  });
};

export function ResultCard({ result }: { result: unknown }) {
  const { currentFunction } = useContext(ContractContext);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 overflow-scroll">
      <Result result={result} output={currentFunction.outputs} />
    </div>
  );
}
