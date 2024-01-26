import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ExploreSection } from "../components/ExploreSection";
import { HanddrawnUnderline } from "../components/HanddrawnUnderline";
import {
  DefaultMeta,
  FathomScript,
  Favicon,
} from "../components/common/DefaultHead";
import { LoadContractForm } from "../components/forms/LoadContractForm";
import { networkName } from "../constants/network";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/outline";

const displayName = networkName === "mainnet" ? "Ethereum" : networkName;

const Home: NextPage = () => {
  const router = useRouter();
  const onSubmit = async ({ address }: { address: string }) => {
    router.push(`/address/${address}`);
  };

  return (
    <div className="h-screen px-4">
      <Head>
        <title>Etherfunk</title>
        <meta
          name="description"
          content="Your Ethereum control panel. Interact with smart contracts on Ethereum."
        />
        <meta
          property="og:title"
          content="Etherfunk | Your Ethereum control panel"
        />
        <meta
          name="og:description"
          content="Interact with any smart contract on Ethereum."
        />
        <meta property="og:url" content="https://etherfunk.io" />

        <Favicon />
        <DefaultMeta />
        <FathomScript />
      </Head>

      <div className="h-full">
        <main className="flex align-center justify-center flex-col h-full">
          <section className="-mt-32">
            <div className="text-center mb-8">
              <Image
                src="/etherfunk-logo-70x70.png"
                width={70}
                height={70}
                alt="Etherfunk logo"
                className="rounded"
              />
            </div>

            <div className="text-center mb-3">
              <a
                href="https://etherhook.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-sm rounded-full bg-blue-50 text-blue-800 px-3 py-1 inline-flex mx-auto items-center gap-1 hover:underline hover:bg-blue-100 transition-colors">
                  <SparklesIcon className="h-4 w-4" />
                  <span>
                    <span className="font-bold">New</span>: Webhooks +
                    notifications for any onchain event
                  </span>
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </a>
            </div>

            <div className="mb-10">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-3 text-center">
                Read/Write for{" "}
                <span className="relative">
                  every
                  <span className="absolute -bottom-0.5 md:left-0 -left-3">
                    <HanddrawnUnderline />
                  </span>
                </span>{" "}
                <span className="capitalize">{displayName}</span> contract.
              </h1>
              <p className="text-center text-slate-500 text-lg">
                Your {displayName} control panel. Interact with smart contracts
                on {displayName}.
              </p>
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
              <LoadContractForm onSubmit={onSubmit} />
            </div>
          </section>
        </main>

        <footer className="absolute bottom-0 right-0 p-4 text-center w-full">
          <div className="w-full sm:mx-auto sm:w-full sm:max-w-lg mb-6">
            <ExploreSection />
          </div>

          <p className="mt-5 text-center text-slate-500 text-xs">
            Powered by Etherscan
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
