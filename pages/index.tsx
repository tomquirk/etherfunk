import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { DefaultHead } from "../components/common/DefaultHead";
import { ExploreSection } from "../components/ExploreSection";
import { FooterLinks } from "../components/FooterLinks";
import { LoadContractForm } from "../components/LoadContractForm";

const Home: NextPage = () => {
  const router = useRouter();
  const onSubmit = async ({ address }: { address: string }) => {
    router.push(`/address/${address}`);
  };

  return (
    <div className="h-screen bg-slate-50 px-4">
      <Head>
        <title>Etherfunk | Your Ethereum Control Panel</title>
        <DefaultHead />
      </Head>

      <div className="h-full">
        <main className="flex align-center justify-center flex-col h-full">
          <section>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-10 text-center">
                Interact with smart contracts on Ethereum.
              </h1>
              <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <LoadContractForm onSubmit={onSubmit} />
              </div>
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
