import { BigNumber } from "@ethersproject/bignumber";
import { isAddress } from "ethers/lib/utils";
import { EtherscanLink } from "./EtherscanLink";

const listClasses = ["ml-2", "ml-3", "ml-4", "ml-5", "ml-6"];

const RenderResult = ({
  result,
  depthIndex = 0,
}: {
  result: any;
  depthIndex?: number;
}) => {
  if (Array.isArray(result)) {
    return (
      <div className={`ml-${depthIndex * 3}`}>
        {result.map((r, i) => (
          <div key={i} className="mb-2">
            <RenderResult result={r} depthIndex={depthIndex + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (isAddress(result)) {
    return (
      <div>
        <EtherscanLink
          address={result}
          type="address"
          className="underline hover:text-blue-800 visited:text-purple-800"
        />
      </div>
    );
  }

  if (
    typeof result === "string" ||
    typeof result === "number" ||
    typeof result === "boolean"
  ) {
    return <div>{`${result}`}</div>;
  }

  if (BigNumber.isBigNumber(result)) {
    return <div>{result.toString()}</div>;
  }

  if (result && typeof result === "object") {
    return (
      <div>
        {Object.keys(result).map((key) => (
          <div key={key}>
            <div>{key}</div>
            <RenderResult result={result[key]} />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export function ResultCard({ result }: { result: any }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 overflow-scroll">
      <RenderResult result={result} />
    </div>
  );
}
