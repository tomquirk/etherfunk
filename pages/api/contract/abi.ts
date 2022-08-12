import { NextApiRequest, NextApiResponse } from "next";
import { getAbi } from "../../../lib/etherscan/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;
  if (!address || typeof address !== "string") {
    return res.status(400);
  }

  const data = await getAbi(address);

  return res.status(200).json(data.data);
}
