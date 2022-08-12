import "../styles/globals.css";
import type { AppProps } from "next/app";
import NetworkProvider from "../providers/NetworkProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NetworkProvider>
      <Component {...pageProps} />
    </NetworkProvider>
  );
}

export default MyApp;
