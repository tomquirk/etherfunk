import axios from "axios";
import { BigNumber } from "@ethersproject/bignumber";
import { Transaction } from "@ethersproject/transactions";
import { Result } from "@ethersproject/abi";
import { Interface } from "@ethersproject/abi";

/**
 * Return array of the most common args from given sets of args
 */
const mergeArgs = (args: Result[]): any[] => {
  const occurences: { [k in string]: number }[] = [];

  args.forEach((argSet) => {
    argSet.forEach((arg, idx) => {
      const argKey =
        typeof arg === "string" ||
        typeof arg === "number" ||
        typeof arg === "boolean"
          ? arg.toString()
          : BigNumber.isBigNumber(arg)
          ? arg.toString()
          : null;

      if (argKey === null) return;

      if (!occurences[idx]) {
        occurences[idx] = {};
      }
      if (!occurences[idx][argKey]) {
        occurences[idx][argKey] = 1;
      } else {
        occurences[idx][argKey] += 1;
      }
    });
  });

  const modes = occurences.map((argCounts) => {
    const entries = Object.entries(argCounts);
    entries.sort((a, b) => {
      if (a[1] < b[1]) {
        return 1;
      }
      if (a[1] > b[1]) {
        return -1;
      }
      return 0;
    });

    return entries[0][0];
  });

  return modes;
};

export const getInputValues = async (
  contractAddress: string,
  functionName: string,
  ABI: string
) => {
  const contractInterface = new Interface(ABI);
  const getTransactionArgs = (tx: any) => {
    const decodedData = contractInterface.decodeFunctionData(
      functionName,
      tx.input
    );

    return decodedData;
  };

  const {
    data: { transactions },
  } = await axios.get(`/api/contract/${contractAddress}`);

  const transactionsWithFunction = transactions.filter((tx: any) =>
    tx.functionName.startsWith(functionName)
  );

  const args = (transactionsWithFunction as Transaction[]).map((tx) =>
    getTransactionArgs(tx)
  );

  return mergeArgs(args);
};
