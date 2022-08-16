import Head from "next/head";

export function DefaultHead() {
  return (
    <>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#013076" />
      <meta name="theme-color" content="#ffffff"></meta>

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
    </>
  );
}
