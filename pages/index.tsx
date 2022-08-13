import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
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
        <meta
          name="description"
          content="Your Ethereum Control Panel. Interact with smart contracts on Ethereum."
        />
        <link rel="icon" href="/favicon.ico" />
        <script
          src="https://tvc15-essential.etherfunk.io/script.js"
          data-site="JIKXTFHK"
          defer
        ></script>
      </Head>

      <div className="h-full">
        <main className="flex align-center justify-center flex-col h-full">
          <div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-10 text-center">
                Interact with smart contracts on Ethereum.
              </h1>

              <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <LoadContractForm onSubmit={onSubmit} />
              </div>
            </div>
          </div>
        </main>
        <footer className="absolute bottom-0 right-0 p-4 text-center w-full">
          <a
            href="https://twitter.com/aeolianeth"
            className="text-sm hover:text-sky-600 text-slate-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            @aeolianeth
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Home;
