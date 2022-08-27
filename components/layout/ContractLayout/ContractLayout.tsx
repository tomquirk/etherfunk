import { Header } from "./Header";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileSidebar } from "./MobileSidebar";
import { Content } from "./Content";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { DefaultMeta, FathomScript, Favicon } from "../../common/DefaultHead";
import { ContractContextProvider } from "../../../contexts/ContractContext";

const DESCRIPTION_SUFFIX =
  "Interact with smart contracts on Ethereum with Etherfunk.";

export function ContractLayout({
  children,
  contractMetadata,
  abi,
  functions,
}: {
  children: JSX.Element;
} & any) {
  // TODO add type lol
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const router = useRouter();
  const { fn, address } = router.query;

  const title = fn
    ? `${fn} | ${contractMetadata.name} ${address}`
    : `${contractMetadata.name} ${address}`;

  const description = fn
    ? `Call function ${fn} on contract ${contractMetadata.name} (${address}). ${DESCRIPTION_SUFFIX}`
    : `Call any function on contract ${contractMetadata.name} (${address}). ${DESCRIPTION_SUFFIX}`;

  // close sidebar when page changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [fn, setSidebarOpen]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta name="og:description" content={description} />

        <Favicon />
        <DefaultMeta />
        <FathomScript />
      </Head>

      <ContractContextProvider
        functions={functions}
        abi={abi}
        metadata={contractMetadata}
      >
        <div className="max-w-screen-2xl mx-auto">
          <MobileSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <DesktopSidebar />
          <div className="md:pl-80 flex flex-col flex-1">
            <Header setSidebarOpen={setSidebarOpen} />
            <Content>{children}</Content>
          </div>
        </div>
      </ContractContextProvider>
    </>
  );
}
