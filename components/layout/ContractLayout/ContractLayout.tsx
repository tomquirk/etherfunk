import { Header } from "./Header";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileSidebar } from "./MobileSidebar";
import { Content } from "./Content";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { FathomScript, Favicon } from "../../common/DefaultHead";
import { ContractContextProvider } from "../../../contexts/ContractContext";
import { Footer } from "./Footer";
import Script from "next/script";

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

  const ogTitle = `${fn} | ${contractMetadata.name}`;
  const ogImageSrc = `https://etherfunk.io/api/og?fn=${fn ?? ""}&contract=${
    contractMetadata.name
  }`;
  
  const description = fn
    ? `Call "${fn}" on contract ${contractMetadata.name} | ${address} | | ${DESCRIPTION_SUFFIX}`
    : `Call any function on contract ${contractMetadata.name} | ${address} | ${DESCRIPTION_SUFFIX}`;

  // close sidebar when page changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [fn, setSidebarOpen]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={ogTitle} />
        <meta name="og:description" content={description} />
        <meta property="twitter:title" content={ogTitle} />
        <meta name="twitter:card" content={ogImageSrc} />
        <meta name="twitter:image:src" content="summary_large_image" />
        <meta property="og:type" content="object" />
        <meta property="og:site_name" content="Etherfunk" />
        <meta property="og:image" content={ogImageSrc} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta
          property="og:image:alt"
          content="Interact with any smart contract on Ethereum"
        />

        <Favicon />
        <FathomScript />
      </Head>

      <Script
        src="https://tools.juicebox.money/public/dist/pay.min.js"
        data-project-id="163"
        data-description="Help keep etherfunk.io alive. Your donation will be used for infrastructure costs."
      />

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
          <div className="md:pl-80 flex flex-col h-screen">
            <div className="flex-1">
              <Header setSidebarOpen={setSidebarOpen} />
              <Content>{children}</Content>
            </div>

            <Footer />
          </div>
        </div>
      </ContractContextProvider>
    </>
  );
}
