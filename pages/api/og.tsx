import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { gasPrice } from "../../lib/etherscan/api";

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

  const gas = await gasPrice();
  const currentGasPrice = gas.result.ProposeGasPrice;

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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                tw="text-7xl tracking-tight mb-5"
                style={{
                  fontFamily: '"InterBold"',
                  width: "800px",
                  textOverflow: "ellipsis",
                }}
              >
                {contract ?? "Etherfunk"}
              </div>
              {fn && <div tw="text-4xl flex">{fn}</div>}
              <div tw="flex mt-5 text-2xl">⛽️ {currentGasPrice} gwei</div>
            </div>
            <img
              src="https://etherfunk.io/etherfunk-logo-192x192.png"
              width={192}
              height={192}
              tw="rounded"
            />
          </div>

          <div tw="text-2xl flex">
            Interact with this smart contract on{" "}
            <span
              style={{
                fontFamily: '"InterBold"',
                marginLeft: "8px",
              }}
            >
              etherfunk.io
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 600,
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
