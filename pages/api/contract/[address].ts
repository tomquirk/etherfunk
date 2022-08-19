import { NextApiRequest, NextApiResponse } from "next";
import { listTransactions } from "../../../lib/etherscan/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;
  const txs = await listTransactions(address as string);

  return res.status(200).json({ transactions: txs.data.result });
}
