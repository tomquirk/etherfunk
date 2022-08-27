import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  DefaultMeta,
  FathomScript,
  Favicon,
} from "../components/common/DefaultHead";
import { ExploreSection } from "../components/ExploreSection";
import { FooterLinks } from "../components/FooterLinks";
import { LoadContractForm } from "../components/forms/LoadContractForm";

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
          <section className="-mt-10">
            <div className="text-center mb-8">
              <Image
                src="/etherfunk-logo-70x70.png"
                width={70}
                height={70}
                alt="Etherfunk logo"
                className="rounded"
              />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-10 text-center">
              Interact with smart contracts on Ethereum.
            </h1>
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
              <LoadContractForm onSubmit={onSubmit} />
            </div>
          </section>
        </main>

        <footer className="absolute bottom-0 right-0 p-4 text-center w-full">
          <div className="w-full sm:mx-auto sm:w-full sm:max-w-lg mb-6">
            <ExploreSection />
          </div>

          <FooterLinks />
        </footer>
      </div>
    </div>
  );
};

export default Home;
