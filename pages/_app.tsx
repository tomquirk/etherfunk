import "../styles/globals.css";
import type { AppProps } from "next/app";
import NetworkProvider from "../providers/NetworkProvider";
// import ReactTooltip from "react-tooltip";
import dynamic from "next/dynamic";
import React from "react";
const ReactTooltip = dynamic(() => import("react-tooltip"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NetworkProvider>
      <React.StrictMode>
        <Component {...pageProps} />
      </React.StrictMode>
      <ReactTooltip effect="solid" className="!px-3 !py-1 !text-xs" />
    </NetworkProvider>
  );
}

export default MyApp;
