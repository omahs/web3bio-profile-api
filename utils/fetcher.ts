export const NFTSCAN_BASE_API_ENDPOINT = "https://restapi.nftscan.com/api/v2/";
export const NFTSCAN_POLYGON_BASE_API =
  "https://polygonapi.nftscan.com/api/v2/";
const AUTHENTICATION = process.env.NEXT_PUBLIC_NFTSCAN_API_KEY;
export const NFTSCANFetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      "x-api-key": AUTHENTICATION ?? "",
    },
  });
  return res.json();
};
