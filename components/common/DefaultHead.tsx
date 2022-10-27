export function Favicon() {
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
        href="/etherfunk-logo-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/etherfunk-logo-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="msapplication-TileColor" content="#013076" />
      <meta name="theme-color" content="#ffffff"></meta>
    </>
  );
}

export function DefaultMeta() {
  return (
    <>
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content="https://etherfunk.io/etherfunk-logo-256x256.png"
      />
    </>
  );
}

export function FathomScript() {
  return (
    <script
      src="https://tvc15-essential.etherfunk.io/script.js"
      data-site="JIKXTFHK"
      defer
    ></script>
  );
}
