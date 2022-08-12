import type { NextPage } from "next";
import Head from "next/head";
import { FormEventHandler, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { LoadContractForm } from "../components/LoadContractForm";

const Home: NextPage = () => {
  const router = useRouter();
  const onSubmit = async ({ address }: { address: string }) => {
    router.push(`/address/${address}`);
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
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-10 text-center">
            Interact with contracts on Ethereum. Simple.
          </h1>

          <div className="sm:mx-auto sm:w-full sm:max-w-lg">
            <LoadContractForm onSubmit={onSubmit} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
