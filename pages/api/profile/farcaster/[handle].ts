import type { NextApiRequest, NextApiResponse } from "next";
import {
  HandleNotFoundResponseData,
  HandleResponseData,
  LinksItem,
  errorHandle,
} from "@/utils/base";
import { getSocialMediaLink, resolveHandle } from "@/utils/resolver";
import { PlatformType } from "@/utils/platform";
import { regexTwitter } from "@/utils/regexp";

const originBase = "https://searchcaster.xyz/api/";

const regTwitter = /(\S*).twitter/i;

const FetchFromOrigin = async (value: string) => {
  if (!value) return;
  const res = await fetch(originBase + `profiles?username=${value}`).then(
    (res) => res.json()
  );
  return res;
};

const resolveFarcasterHandle = async (
  handle: string,
  res: NextApiResponse<HandleResponseData | HandleNotFoundResponseData>
) => {
  try {
    const response = await FetchFromOrigin(handle);
    if (!response || !response.length) {
      errorHandle(handle, res);
      return;
    }
    const _res = response[0].body;
    const resolvedHandle = resolveHandle(_res.username);
    const LINKRES: Partial<Record<PlatformType, LinksItem>> = {
      [PlatformType.farcaster]: {
        link: getSocialMediaLink(resolvedHandle, PlatformType.farcaster),
        handle: resolvedHandle,
      },
    };
    if (_res.bio && _res.bio.match(regTwitter)) {
      const matched = _res.bio.match(regTwitter)[1];
      const resolveMatch = resolveHandle(matched);
      LINKRES[PlatformType.twitter] = {
        link: getSocialMediaLink(resolveMatch, PlatformType.twitter),
        handle: resolveMatch,
      };
    }
    const resJSON = {
      owner: response[0].connectedAddress || _res.address,
      identity: _res.username || _res.displayName,
      displayName: _res.displayName || resolvedHandle,
      avatar: _res.avatarUrl,
      email: null,
      description: _res.bio,
      location: null,
      header: null,
      links: LINKRES,
      addresses: {
        eth: response[0].connectedAddress || _res.address,
      },
    };
    res
      .status(200)
      .setHeader(
        "Cache-Control",
        `public, s-maxage=${60 * 60 * 24 * 7}, stale-while-revalidate=${
          60 * 30
        }`
      )
      .json(resJSON);
  } catch (e: any) {
    res.status(500).json({
      identity: handle,
      error: e.message,
    });
  }
};
const resolve = (from: string, to: string) => {
  const resolvedUrl = new URL(to, new URL(from, "resolve://"));
  if (resolvedUrl.protocol === "resolve:") {
    const { pathname, search, hash } = resolvedUrl;
    return `${pathname}${search}${hash}`;
  }
  return resolvedUrl.toString();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HandleResponseData | HandleNotFoundResponseData>
) {
  const inputName = req.query.handle as string;
  const lowercaseName = inputName.toLowerCase();
  if (inputName !== lowercaseName) {
    return res.redirect(307, resolve(req.url!, lowercaseName));
  }
  if (!inputName || !regexTwitter.test(inputName))
    return errorHandle(inputName, res);
  return resolveFarcasterHandle(lowercaseName, res);
}
