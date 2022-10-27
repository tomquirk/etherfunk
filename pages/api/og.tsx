import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

const fontBold = fetch(
  new URL("../../assets/fonts/Inter-ExtraBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const fontRegular = fetch(
  new URL("../../assets/fonts/Inter-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const fontDataBold = await fontBold;
  const fontDataRegular = await fontRegular;

  try {
    const { searchParams } = new URL(req.url);

    const fn = searchParams.get("fn")?.slice(0, 100);
    const contract = searchParams.get("contract")?.slice(0, 100);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            justifyContent: "space-between",
            fontFamily: '"Inter"',
          }}
          tw="px-16 pt-20 pb-10 border border-b-[20px] border-blue-500"
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                tw="text-7xl font-extrabold tracking-tight mb-5"
                style={{ fontFamily: '"InterBold"' }}
              >
                {contract ?? 'Etherfunk'}
              </div>
              {fn && <div tw="text-4xl font-bold flex">{fn}</div>}
            </div>
            <img
              src="https://etherfunk.io/etherfunk-logo-192x192.png"
              width={192}
              height={192}
              tw="rounded"
            />
          </div>

          <div tw="text-2xl">
            Interact with this smart contract on Etherfunk.io
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "InterBold",
            data: fontDataBold,
            style: "normal",
          },
          {
            name: "Inter",
            data: fontDataRegular,
            style: "normal",
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
