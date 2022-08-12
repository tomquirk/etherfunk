import type { NextPage } from "next";
import Head from "next/head";
import { FormEventHandler, useState } from "react";
import axios from "axios";

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

const Home: NextPage = () => {
  const [address, setAddress] = useState<string>("");
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const data = await axios.get("/api/contract/abi", { params: { address } });
    const rawAbi = data.data.result;

    try {
      const functions = parseAbi(rawAbi);
      console.log(functions);
    } catch (e) {
      console.error(e);
    }
  };

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
            Interact with contracts on Ethereum. Simple.
          </h1>

          <div className="sm:mx-auto sm:w-full sm:max-w-lg">
            <form action="" onSubmit={onSubmit}>
              <label htmlFor="address" className="block text-lg">
                Load a contract
              </label>
              <input
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                placeholder="0x00..."
                id="address"
                name="address"
                autoComplete="off"
                className="focus:ring-sky-500 py-3 focus:border-sky-500 block w-full pl-7 text-md border border-slate-500 rounded-md bg-transparent text-black mb-3"
              ></input>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600"
              >
                Load it up
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
