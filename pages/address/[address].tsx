import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { getAbi } from "../../lib/etherscan/api";

const AddressPage: NextPage = ({ functions }) => {
  const router = useRouter();
  const { address } = router.query;

  return (
    <div className="h-screen bg-slate-50">
      <Head>
        <title>Etherfunk | Your Ethereum Control Panel</title>
        <meta
          name="description"
          content="Your Ethereum Control Panel. Interact with smart contracts on Ethereum."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex align-center justify-center h-full flex-col">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10 text-center">
            {address}
          </h1>
        </div>
      </main>
    </div>
  );
};

/**
 * Get functions from an ABI
 * @param rawAbi
 * @returns
 */
const parseAbi = (rawAbi: string) => {
  const abi = JSON.parse(rawAbi);
  const functions = abi.filter((v: any) => v.type === "function");
  const grouped = functions.reduce((map: any, fn: any) => {
    if (!map[fn.stateMutability]) {
      map[fn.stateMutability] = [fn];
    } else {
      map[fn.stateMutability].push(fn);
    }
    return map;
  }, {});

  return grouped;
};

// This gets called on every request
export async function getServerSideProps(context: NextPageContext) {
  const { address } = context?.query ?? {};
  if (!address || typeof address !== "string") {
    return {
      notFound: true,
    };
  }

  const data = await getAbi(address);
  const functions = parseAbi(data.data.result);

  return { props: { functions } };
}

export default AddressPage;
