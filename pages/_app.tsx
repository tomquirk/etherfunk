import "../styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import React, { ReactElement, ReactNode } from "react";
import { NetworkProvider } from "../contexts/NetworkContext";
import { NextPage } from "next";
import ReactTooltip from "react-tooltip";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, pageProps: any) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  const PageWithLayout = getLayout(<Component {...pageProps} />, pageProps);

  return (
    <NetworkProvider>
      <React.StrictMode>{PageWithLayout}</React.StrictMode>
      <ReactTooltip effect="solid" className="!px-3 !py-1 !text-xs" />
    </NetworkProvider>
  );
}
